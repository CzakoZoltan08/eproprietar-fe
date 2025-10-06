import { makeAutoObservable, runInAction } from "mobx";
import { sendPasswordResetEmail, signOut } from "firebase/auth";

import { AuthApi } from '@/api/AuthApi';
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

  async logout() {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }

    // Trigger MobX change BEFORE async work
    this.userStore.setCurrentUser(null);

    runInAction(() => {
      this.accessToken = null;
    });

    try {
      await signOut(auth);
      console.log("User signed out!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /**
   * Reset password flow:
   * - Normalize email (lowercase)
   * - Check existence via GET /users/by-email?email=...
   * - Only allow if authProvider === 'email' (or 'password', depending on your DB)
   * - Then call Firebase's sendPasswordResetEmail
   */
  async resetPassword(email: string) {
    const normalized = (email ?? "").trim().toLowerCase();

    try {
      const userByEmail = await this.userApi.getUserByEmail(normalized);

      if (!userByEmail) {
        runInAction(() => {
          this.loading = false;
          this.errorMessage =
            "Nu exista cont cu aceasta adresa de email. Va rugam sa va inregistrati!";
        });
        return;
      }

      // Some DBs store 'email', others 'password' for manual credentials.
      const provider = (userByEmail as any)?.authProvider;
      const isEmailProvider = provider === "email" || provider === "password";

      if (!isEmailProvider) {
        runInAction(() => {
          this.loading = false;
          this.errorMessage =
            "Numai userii autentificati cu email si parola isi pot schimba parola";
        });
        return;
      }

      await sendPasswordResetEmail(auth, normalized);
      alert("Emailul pentru resetarea parolei a fost trimis la aceasta adresa");
    } catch (error: any) {
      // If getUserByEmail threw for a non-404 reason (e.g., 500), show a generic server error
      console.log("resetPassword error", error);
      runInAction(() => {
        this.loading = false;
        this.errorMessage =
          error?.message ||
          "A apărut o eroare la server. Te rugăm să încerci din nou.";
      });
    }
  }
}
