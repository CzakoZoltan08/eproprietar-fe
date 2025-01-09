import { FacebookAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { runInAction, makeAutoObservable } from "mobx";
import { UserApi } from "@/api/UserApi";
import { UserStore } from "@/store/UserStore";
import { StorageKeys } from "@/constants/storageKeys";
import autoBind from "auto-bind";
import { auth } from "@/config/firebase";
import { AuthProvider } from "@/constants/authProviders";

export class YahooAuthStore {
  userApi: UserApi;
  userStore: UserStore;
  provider: OAuthProvider;

  constructor(userApi: UserApi, userStore: UserStore, provider: OAuthProvider) {
    this.userApi = userApi;
    this.userStore = userStore;
    this.provider = provider;
    makeAutoObservable(this);
    autoBind(this);
  }

  async loginWithYahoo() {
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
        authProvider: AuthProvider.YAHOO
      };

      runInAction(() => {
        this.userStore.setCurrentUser(userModel);
      });

      const userByEmail = result.user.email ? await this.userApi.getUserByEmail(result.user.email) : null;
      if (!userByEmail) {
        await this.userApi.createUser(userModel);
      }
    } catch (error) {
      console.error("Yahoo login failed:", error);
      throw error;
    }
  }
}
