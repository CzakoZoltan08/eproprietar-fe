import { AnnouncementStore } from "@/store/AnnouncementStore";
import { AppState } from "@/store/AppState";
import { AuthStore } from "@/store/AuthStore";
import { EmailAuthStore } from "./EmailAuthStore";
import { PhoneAuthStore } from "./PhoneAuthStore";
import { PricingStore } from "./PricingStore";
import { UserStore } from "@/store/UserStore";
import { configure } from "mobx";

configure({ enforceActions: "observed" });

export default class RootStore {
  appState: AppState;
  authStore: AuthStore;
  emailAuthStore: EmailAuthStore;
  phoneAuthStore: PhoneAuthStore;
  userStore: UserStore;
  announcementStore: AnnouncementStore;
  pricingStore: PricingStore;
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
    this.emailAuthStore = new EmailAuthStore(this.appState.userAPi, this.userStore);
    this.phoneAuthStore = new PhoneAuthStore(this.userStore);
    this.pricingStore = new PricingStore(this.appState.pricingApi);
  }
}
