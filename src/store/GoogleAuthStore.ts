import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";

import { AuthProvider } from "@/constants/authProviders";
import { StorageKeys } from "@/constants/storageKeys";
import { UserApi } from "@/api/UserApi";
import { UserStore } from "@/store/UserStore";
import { auth } from "@/config/firebase";
import autoBind from "auto-bind";

export class GoogleAuthStore {
  userApi: UserApi;
  userStore: UserStore;
  provider: GoogleAuthProvider;

  constructor(userApi: UserApi, userStore: UserStore, provider: GoogleAuthProvider) {
    this.userApi = userApi;
    this.userStore = userStore;
    this.provider = provider;
    makeAutoObservable(this);
    autoBind(this);
  }

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, this.provider);
      const token = await result.user?.getIdToken();

      if (token && typeof window !== "undefined") {
        localStorage.setItem(StorageKeys.token, token);
      }

      const userModel = {
        email: result.user.email || "",
        firstName: result.user.displayName?.split(" ")[0] || "",
        lastName: result.user.displayName?.split(" ")[1] || "",
        firebaseId: result.user.uid,
        authProvider: AuthProvider.GOOGLE
      };

      runInAction(() => {
        this.userStore.setCurrentUser(userModel);
      });

      const userByEmail = result.user.email ? await this.userApi.getUserByEmail(result.user.email) : null;
      if (!userByEmail) {
        await this.userApi.createUser(userModel);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  }
}