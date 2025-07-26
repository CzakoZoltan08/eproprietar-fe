import { getAuth, onAuthStateChanged } from "firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";

import { UserApi } from "@/api/UserApi";
import { UserModel } from "@/models/userModels";
import autoBind from "auto-bind";

export class UserStore {
  userApi: UserApi;
  user: UserModel | null;
  users: UserModel[] = [];

  constructor(userApi: UserApi) {
    this.userApi = userApi;
    this.user = null;
    this.users = [];

    makeAutoObservable(this);
    autoBind(this);
  }

  getCurrentUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      const auth = getAuth();

      onAuthStateChanged(auth, async (user: any) => {
        if (user) {
          try {
            const userByEmail = await this.userApi.getUserByEmail(user.email);
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
    });
  }

  async fetchAllUsers(): Promise<void> {
    try {
      const all = await this.userApi.getAllUsers();
      runInAction(() => {
        this.users = all;
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
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

    // Optional: Sign out from Firebase
    const auth = getAuth();
    await auth.signOut();
  }
}
