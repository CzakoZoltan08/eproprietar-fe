import { AnnouncementApi } from "@/api/AnnouncementApi";
import { ApiConfig } from "@/api/ApiConfig";
import { AuthApi } from "@/api/AuthApi";
import { PricingApi } from "@/api/PricingApi";
import { UserApi } from "@/api/UserApi";
import { apiServer } from "@/envUtils/envUtils";
import { makeAutoObservable } from "mobx";

export class AppState {
  apiConfig: ApiConfig;
  authApi: AuthApi;
  userAPi: UserApi;
  announcementApi: AnnouncementApi;
  pricingApi: PricingApi;

  constructor(api: string = apiServer) {
    this.apiConfig = new ApiConfig(api);
    this.authApi = new AuthApi(this.apiConfig);
    this.userAPi = new UserApi(this.apiConfig);
    this.announcementApi = new AnnouncementApi(this.apiConfig);
    this.pricingApi = new PricingApi(this.apiConfig);

    makeAutoObservable(this);
  }
}
