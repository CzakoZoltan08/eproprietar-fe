import { ApiConfig } from "./ApiConfig";
import { CreateUserModel, UserModel } from "@/models/userModels";

export class UserApi {
  apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  async createUser(data: CreateUserModel) {
    return await this.apiConfig.sendRequest("POST", "/users", data);
  }

  async getUserByEmail(email: string) {
    return await this.apiConfig.sendRequest("GET", `/users/by-email/${email}`);
  }

  async updateUser(id: string, data: Partial<UserModel>) {
    return await this.apiConfig.sendRequest("PATCH", `/users/${id}`, data);
  }
}
