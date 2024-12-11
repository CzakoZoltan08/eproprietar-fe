import { AnnouncementStore } from "@/store/AnnouncementStore";
import { AppState } from "@/store/AppState";
import { AuthStore } from "@/store/AuthStore";
import { UserStore } from "@/store/UserStore";
import { configure } from "mobx";

configure({ enforceActions: "observed" });

export default class RootStore {
  appState: AppState;
  authStore: AuthStore;
  userStore: UserStore;
  announcementStore: AnnouncementStore;
  constructor() {
    this.appState = new AppState();
    this.userStore = new UserStore(this.appState.userAPi);
    this.announcementStore = new AnnouncementStore(
      this.appState.announcementApi,
    );
    this.authStore = new AuthStore(
      this.appState.authApi,
      this.appState.userAPi,
      this.userStore,
    );
  }
}
