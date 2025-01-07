import { Auth, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { CreateUserModel, UserModel } from "@/models/userModels";
import { ErrorMessages, FirebaseErrors } from "@/constants/FirebaseErrors";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { AuthApi } from "@/api/AuthApi";
import { AuthProvider } from "@/constants/authProviders";
import { FacebookAuthProvider } from "firebase/auth";
import { StorageKeys } from "@/constants/storageKeys";
import { UserApi } from "@/api/UserApi";
import { UserStore } from "@/store/UserStore";
import { auth } from "@/config/firebase";
import autoBind from "auto-bind";

export class AuthStore {
  authApi: AuthApi;
  userApi: UserApi;
  userStore: UserStore;
  accessToken: any = null;
  errorMessage: string = "";
  errors: any = {
    emailAlreadyInUse: false,
    invalidEmailAddress: false,
    wrongPassword: false,
  };
  loading: boolean = false;

  constructor(authApi: AuthApi, userApi: UserApi, userStore: UserStore) {
    this.authApi = authApi;
    this.userApi = userApi;
    this.userStore = userStore;

    makeAutoObservable(this);
    autoBind(this);
  }

  getAccessToken() {
    if (typeof window !== "undefined") {
      const currentToken = localStorage.getItem(StorageKeys.token);

      runInAction(() => {
        this.accessToken = currentToken;
      });
    }
  }

  resetErrors() {
    this.errors = {
      emailAlreadyInUse: false,
      invalidEmailAddress: false,
      wrongPassword: false,
    };
  }

  async loginWithGoogle(provider: GoogleAuthProvider, doRegister = true) {
    try {
      const result = await signInWithPopup(auth, provider);
      // @ts-ignore
      const token = await result.user?.getIdToken();
      const firstName = result?.user?.displayName
        ?.split(" ")
        .slice(0, -1)
        .join(" ");
      const lastName = result?.user?.displayName
        ?.split(" ")
        .slice(-1)
        .join(" ");

      if (token && result.user?.email) {
        if (typeof window !== "undefined") {
          localStorage.setItem(StorageKeys.token, token);
        }
        runInAction(() => {
          this.accessToken = token;
        });

        const user = {
          email: result.user.email,
          firstName: firstName || null,
          lastName: lastName || null,
          authProvider: AuthProvider.GOOGLE,
          firebaseId: result?.user?.uid,
        };

        this.userStore.setCurrentUser(user);

        const userByEmail = await this.userApi.getUserByEmail(
          result.user?.email,
        );

        if (doRegister || !userByEmail) {
          const email = result?.user?.email;
          const uid = result?.user?.uid;
        
          // Validate required fields before proceeding
          if (!email || !uid) {
            throw new Error("Invalid user data: email and firebaseId are required");
          }
        
          const payload: CreateUserModel = {
            email,
            firstName: firstName || "",
            lastName: lastName || "",
            authProvider: AuthProvider.GOOGLE,
            firebaseId: uid
          }

          await this.userApi.createUser(payload);
        }
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  }

  async loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // @ts-ignore
      const token = await result.user?.getIdToken();
      const firstName = result?.user?.displayName
        ?.split(" ")
        .slice(0, -1)
        .join(" ");
      const lastName = result?.user?.displayName
        ?.split(" ")
        .slice(-1)
        .join(" ");

      if (token && result.user?.email) {
        if (typeof window !== "undefined") {
          localStorage.setItem(StorageKeys.token, token);
        }
        runInAction(() => {
          this.accessToken = token;
        });

        const user = {
          email: result.user.email,
          firstName: firstName || null,
          lastName: lastName || null,
          authProvider: AuthProvider.FACEBOOK,
          firebaseId: result?.user?.uid,
        };

        this.userStore.setCurrentUser(user);

        const userByEmail = await this.userApi.getUserByEmail(
          result.user?.email,
        );

        if (!userByEmail) {
          const email = result?.user?.email;
          const uid = result?.user?.uid;

          // Validate required fields before proceeding
          if (!email || !uid) {
            throw new Error("Invalid user data: email and firebaseId are required");
          }

          const payload: CreateUserModel = {
            email,
            firstName: firstName || "",
            lastName: lastName || "",
            authProvider: AuthProvider.FACEBOOK,
            firebaseId: uid,
          };

          await this.userApi.createUser(payload);
        }
      }
    } catch (e) {
      console.log("Error: ", e);
      runInAction(() => {
        this.errorMessage = "Failed to log in with Facebook.";
      });
    }
  }

  async signInEmailAndPassword(email: string, password: string) {
    this.errorMessage = "";

    const userByEmail = await this.userApi.getUserByEmail(email);
    console.log("userByEmail", userByEmail);

    if (!userByEmail) {
      runInAction(() => {
        this.errors.wrongPassword = true;
        this.errorMessage = ErrorMessages.UserNotFound;
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("auth.currentUser", auth.currentUser);
        if (auth.currentUser) {
          const userModel: UserModel = {
            firstName: auth.currentUser.displayName?.split(' ')[0] || '',
            lastName: auth.currentUser.displayName?.split(' ')[1] || '',
            firebaseId: auth.currentUser.uid,
            email: auth.currentUser.email || '',
          };
          this.userStore.setCurrentUser(userModel);
        } else {
            console.warn("No current user available");
        }
        this.resetErrors();
      })
      .catch((error: { code: string }) => {
        runInAction(() => {
          this.loading = false;

          if (error.code === FirebaseErrors.InvalidEmail) {
            this.errors.invalidEmailAddress = true;
            this.errorMessage = ErrorMessages.InvalidEmailAddress;
          }

          if (error.code === FirebaseErrors.WrongPassword) {
            this.errors.wrongPassword = true;
            this.errorMessage = ErrorMessages.WrongPassword;
          }

          if (error.code === FirebaseErrors.UserNotFound) {
            this.errors.wrongPassword = true;
            this.errorMessage = ErrorMessages.UserNotFound;
          }
        });
      });
  }

  async logout() {
    signOut(auth).then(() => console.log("User signed out!"));

    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }

  async resetPassword(email: string) {
    const userByEmail = await this.userApi.getUserByEmail(email);

    if (!userByEmail) {
      runInAction(() => {
        this.loading = false;

        this.errorMessage =
          "Nu exista cont cu aceasta adresa de email. Va rugam sa va inregistrati!";
      });
      return;
    }

    if (userByEmail.authProvider !== "email") {
      runInAction(() => {
        this.loading = false;

        this.errorMessage =
          "Numai userii autentificati cu email si parola isi pot schimba parola";
      });
      return;
    }

    return sendPasswordResetEmail(auth, email)
      .then((a) => {
        alert(
          "Emailul pentru resetarea parolei a fost trimis la aceasta adresa",
        );
      })
      .catch((error: any) => {
        runInAction(() => {
          this.loading = false;

          this.errorMessage = error.message;
        });
        console.log("resetPassword error", error);
      });
  }

  recaptchaVerifier: RecaptchaVerifier | null = null;

  async setupRecaptcha(auth: Auth, containerId: string) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(
        auth, // Pass the Auth instance here
        containerId, // Container ID or HTMLElement
        {
          size: "invisible", // Options for RecaptchaVerifier
          callback: (response: any) => {
            console.log("Recaptcha verified:", response);
          },
          "expired-callback": () => {
            console.error("Recaptcha expired. Please try again.");
          },
        }
      );
    }
  }

  async sendPhoneOtp(auth: Auth, phoneNumber: string) {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error("RecaptchaVerifier is not set up.");
      }

      console.log("Sending OTP to", phoneNumber);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );
      return confirmationResult;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }

  async verifyPhoneOtp(confirmationResult: any, verificationCode: string) {
    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      const token = await userCredential.user.getIdToken();

      if (token && typeof window !== "undefined") {
        localStorage.setItem(StorageKeys.token, token);
      }

      const user = {
        email: userCredential.user.email || null,
        firstName: userCredential.user.displayName?.split(" ")[0] || null,
        lastName: userCredential.user.displayName?.split(" ")[1] || null,
        authProvider: AuthProvider.PHONE,
        firebaseId: userCredential.user.uid,
      };

      this.userStore.setCurrentUser(user);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }
}
