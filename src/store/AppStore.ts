import { AnnouncementStore } from "@/store/AnnouncementStore";
import { AppState } from "@/store/AppState";
import { AuthStore } from "@/store/AuthStore";
import { EmailAuthStore } from "./EmailAuthStore";
import { GoogleAuthStore } from "./GoogleAuthStore";
import { PhoneAuthStore } from "./PhoneAuthStore";
import { UserStore } from "@/store/UserStore";
import { configure } from "mobx";
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { FacebookAuthStore } from "./FacebookAuthStore";
import { YahooAuthStore } from "./YahooAuthStore";
import { AuthProvider } from "@/constants/authProviders";

configure({ enforceActions: "observed" });

export default class RootStore {
  appState: AppState;
  authStore: AuthStore;
  emailAuthStore: EmailAuthStore;
  phoneAuthStore: PhoneAuthStore;
  googleAuthStore: GoogleAuthStore;
  facebookAuthStore: FacebookAuthStore;
  yahooAuthStore: YahooAuthStore;
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
    this.emailAuthStore = new EmailAuthStore(this.appState.userAPi, this.userStore);
    this.phoneAuthStore = new PhoneAuthStore(this.userStore);
    this.googleAuthStore = new GoogleAuthStore(this.appState.userAPi, this.userStore, new GoogleAuthProvider());
    this.facebookAuthStore = new FacebookAuthStore(this.appState.userAPi, this.userStore, new FacebookAuthProvider());
    this.yahooAuthStore = new YahooAuthStore(this.appState.userAPi, this.userStore, new OAuthProvider(AuthProvider.YAHOO));
  }
}
