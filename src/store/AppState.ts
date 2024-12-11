import { makeAutoObservable } from "mobx";
import { ApiConfig } from "@/api/ApiConfig";
import { apiServer } from "@/envUtils/envUtils";
import { AuthApi } from "@/api/AuthApi";
import { UserApi } from "@/api/UserApi";
import { AnnouncementApi } from "@/api/AnnouncementApi";

export class AppState {
  apiConfig: ApiConfig;
  authApi: AuthApi;
  userAPi: UserApi;
  announcementApi: AnnouncementApi;

  constructor(api: string = apiServer) {
    this.apiConfig = new ApiConfig(api);
    this.authApi = new AuthApi(this.apiConfig);
    this.userAPi = new UserApi(this.apiConfig);
    this.announcementApi = new AnnouncementApi(this.apiConfig);

    makeAutoObservable(this);
  }
}
