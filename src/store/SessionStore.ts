import { OAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";
import {
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { AuthApi } from "@/api/AuthApi";
import { StorageKeys } from "@/constants/storageKeys";
import { UserApi } from "@/api/UserApi";
import { UserStore } from "@/store/UserStore";
import { auth } from "@/config/firebase";
import autoBind from "auto-bind";

export class SessionStore {
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
}
