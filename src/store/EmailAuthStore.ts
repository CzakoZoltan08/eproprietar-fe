import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import { ErrorMessages, FirebaseErrors } from "@/constants/FirebaseErrors";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";

import { AuthProvider } from "@/constants/authProviders";
import { StorageKeys } from "@/constants/storageKeys";
import { UserApi } from "@/api/UserApi";
import { UserStore } from "@/store/UserStore";
import { auth } from "@/config/firebase";
import autoBind from "auto-bind";

// EmailAuthStore.ts


export class EmailAuthStore {
  userApi: UserApi;
  userStore: UserStore;
  errorMessage: string = "";

  constructor(userApi: UserApi, userStore: UserStore) {
    this.userApi = userApi;
    this.userStore = userStore;
    makeAutoObservable(this);
    autoBind(this);
  }

  async register(email: string, password: string, firstName: string, lastName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      const token = await user.getIdToken();

      const userModel = {
        email: user.email || "",
        firstName,
        lastName,
        firebaseId: user.uid,
        authProvider: AuthProvider.EMAIL,
        role: "user"
      };

      const createdUser = await this.userApi.createUser(userModel);
      if (!createdUser) {
        throw new Error("User creation failed. Please try again.");
      }

      runInAction(() => {
        this.userStore.setCurrentUser(createdUser); // Use BE response
      });

    } catch (error: any) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(StorageKeys.token); // Ensure token is removed on error
      }

      runInAction(() => {
        if (error.code === FirebaseErrors.EmailAlreadyInUse) {
          this.errorMessage = ErrorMessages.EmailAlreadyInUse;
        } else if (error.code === FirebaseErrors.InvalidEmail) {
          this.errorMessage = ErrorMessages.InvalidEmailAddress;
        } else {
          this.errorMessage = "An unexpected error occurred during registration.";
        }
      });

      throw new Error(this.errorMessage); // Throw error for the component to catch
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userByEmail = await this.userApi.getUserByEmail(user.email || "");
      if (!userByEmail) {
        // User must exist in the backend to proceed
        throw new Error("User not found in our system. Please register.");
      }

      runInAction(() => {
        this.userStore.setCurrentUser(userByEmail); // Use BE response
      });

    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "";

      runInAction(() => {
        // Map Firebase errors to user-friendly messages
        if (error.code === FirebaseErrors.InvalidEmail) {
          errorMessage = ErrorMessages.InvalidEmailAddress;
        } else if (error.code === FirebaseErrors.WrongPassword) {
          errorMessage = ErrorMessages.WrongPassword;
        } else if (error.code === FirebaseErrors.UserNotFound) {
          errorMessage = ErrorMessages.UserNotFound;
        } else {
          errorMessage = "An unexpected error occurred.";
        }
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * Change password for the currently logged-in user (EMAIL provider).
   * Requires current password for reauthentication.
   */
  async changePassword(currentPassword: string, newPassword: string) {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("Nu ești autentificat.");

    // only for email/password accounts
    const isEmailProvider = user.providerData.some(
      (p) => p.providerId === "password"
    );
    if (!isEmailProvider) {
      throw new Error(
        "Contul tău nu folosește autentificarea cu email și parolă. Folosește resetarea prin email."
      );
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (err: any) {
      // map a few common Firebase errors to friendlier messages
      if (err?.code === "auth/weak-password") {
        throw new Error("Parola este prea slabă (minim 6 caractere).");
      }
      if (err?.code === "auth/wrong-password") {
        throw new Error("Parola curentă este incorectă.");
      }
      if (err?.code === "auth/too-many-requests") {
        throw new Error("Prea multe încercări. Încearcă mai târziu.");
      }
      // auth/requires-recent-login would be handled by reauthenticate above;
      // if it still bubbles up, show a generic message:
      if (err?.code === "auth/requires-recent-login") {
        throw new Error(
          "Te rugăm să te reconectezi și să încerci din nou schimbarea parolei."
        );
      }
      throw new Error("Nu am putut schimba parola. Încearcă din nou.");
    }
  }

  /**
   * Sends a password reset / set email.
   * Works for email-password accounts; for social login, it can be used after linking an email.
   */
  async sendResetEmail(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err?.code === "auth/invalid-email") {
        throw new Error("Adresa de email nu este validă.");
      }
      if (err?.code === "auth/user-not-found") {
        throw new Error("Nu există un cont cu acest email.");
      }
      throw new Error("Nu am putut trimite emailul de resetare.");
    }
  }
}