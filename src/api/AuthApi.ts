import { ApiConfig } from "./ApiConfig";
import { FirebaseRegisterModel } from "@/models/authModels";

export class AuthApi {
  apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  async login() {}

  async register(data: FirebaseRegisterModel) {
    return await this.apiConfig.sendRequest("POST", "/auth/register", data);
  }
}
