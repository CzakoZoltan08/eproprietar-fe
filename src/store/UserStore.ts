import { getAuth, onAuthStateChanged } from "firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";

import { UserApi } from "@/api/UserApi";
import { UserModel } from "@/models/userModels";
import autoBind from "auto-bind";

export class UserStore {
  userApi: UserApi;
  user: UserModel | null;

  constructor(userApi: UserApi) {
    this.userApi = userApi;
    this.user = null;

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
            reject(error);
          }
        } else {
          resolve(); // Resolve even if no user is authenticated
        }
      }, reject); // Reject if onAuthStateChanged encounters an error
    });
  }
  
  setCurrentUser(currentUser: UserModel) {
    runInAction(() => {
      this.user = currentUser;
    });
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
