import { auth, initAuthPersistence } from "@/config/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";

import { UserApi } from "@/api/UserApi";
import { UserModel } from "@/models/userModels";
import autoBind from "auto-bind";

export class UserStore {
  userApi: UserApi;
  user: UserModel | null | undefined = undefined; // ✅ initially undefined (loading)
  users: UserModel[] = [];

  constructor(userApi: UserApi) {
    this.userApi = userApi;
    // this.user = null; ❌ Do NOT overwrite undefined (used for loading state)
    this.users = [];

    makeAutoObservable(this);
    autoBind(this);
  }

  getCurrentUser(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await initAuthPersistence(); // ✅ set local persistence before checking auth

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const userByEmail = await this.userApi.getUserByEmail(firebaseUser.email || "");
              runInAction(() => {
                this.user = userByEmail;
              });
              resolve();
            } catch (error) {
              runInAction(() => {
                this.user = null;
              });
              reject(error);
            }
          } else {
            runInAction(() => {
              this.user = null;
            });
            resolve();
          }
        }, reject);
      } catch (err) {
        console.error("Failed to initialize Firebase persistence", err);
        reject(err);
      }
    });
  }

  async fetchAllUsers(): Promise<void> {
    try {
      const all = await this.userApi.getAllUsers();
      runInAction(() => {
        this.users = all;
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      runInAction(() => {
        this.users = [];
      });
    }
  }

  setCurrentUser(currentUser: UserModel | null) {
    runInAction(() => {
      this.user = currentUser;
    });
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  async updateUser(id: string, data: Partial<UserModel>) {
    const updatedUser = await this.userApi.updateUser(id, data);
    this.setCurrentUser(updatedUser);
  }

  async deleteCurrentUser(id: string) {
    await this.userApi.deleteUser(id);
    runInAction(() => {
      this.user = null;
    });

    const auth = getAuth();
    await auth.signOut();
  }
}