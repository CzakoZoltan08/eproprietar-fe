import { ApiConfig } from "./ApiConfig";
import { Endpoints } from "@/constants/endpoints";
import { FirebaseRegisterModel } from "@/models/authModels";
import { HttpMethods } from "@/constants/http-methods.enum";

export class AuthApi {
  apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  async login() {}

  async register(data: FirebaseRegisterModel) {
    return await this.apiConfig.sendRequest(HttpMethods.POST, Endpoints.REGISTER, data);
  }
}
