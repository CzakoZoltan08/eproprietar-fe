import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { runInAction, makeAutoObservable } from "mobx";
import { UserApi } from "@/api/UserApi";
import { UserStore } from "@/store/UserStore";
import { StorageKeys } from "@/constants/storageKeys";
import autoBind from "auto-bind";
import { auth } from "@/config/firebase";
import { AuthProvider } from "@/constants/authProviders";

export class FacebookAuthStore {
  userApi: UserApi;
  userStore: UserStore;
  provider: FacebookAuthProvider;

  constructor(userApi: UserApi, userStore: UserStore, provider: FacebookAuthProvider) {
    this.userApi = userApi;
    this.userStore = userStore;
    this.provider = provider
    makeAutoObservable(this);
    autoBind(this);
  }

  async loginWithFacebook() {
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
        authProvider: AuthProvider.FACEBOOK,
      };

      runInAction(() => {
        this.userStore.setCurrentUser(userModel);
      });

      const userByEmail = result.user.email ? await this.userApi.getUserByEmail(result.user.email) : null;
      if (!userByEmail) {
        await this.userApi.createUser(userModel);
      }
    } catch (error) {
      console.error("Facebook login failed:", error);
      throw error;
    }
  }
}