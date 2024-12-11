import autoBind from "auto-bind";
import { makeAutoObservable, runInAction } from "mobx";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { UserApi } from "@/api/UserApi";
import { UserModel } from "@/models/userModels";

export class UserStore {
  userApi: UserApi;
  user: UserModel | null;

  constructor(userApi: UserApi) {
    this.userApi = userApi;
    this.user = null;

    makeAutoObservable(this);
    autoBind(this);
  }

  getCurrentUser() {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const userByEmail = await this.userApi.getUserByEmail(user.email);
        this.setCurrentUser(userByEmail);
      }
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
}
