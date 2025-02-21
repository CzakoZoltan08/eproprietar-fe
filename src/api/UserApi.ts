import { CreateUserModel, UserModel } from "@/models/userModels";

import { ApiConfig } from "./ApiConfig";
import { Endpoints } from "@/constants/endpoints";
import { HttpMethods } from "@/constants/http-methods.enum";

export class UserApi {
  apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  async getAllUsers() {
    return await this.apiConfig.sendRequest(HttpMethods.GET, `${Endpoints.USERS}`);
  }

  async getUserByEmail(email: string) {
    return await this.apiConfig.sendRequest(HttpMethods.GET, `${Endpoints.USERS_BY_EMAIL}/${email}`);
  }

  async getUserById(id: string) {
    return await this.apiConfig.sendRequest(HttpMethods.GET, `${Endpoints.USERS}/${id}`);
  }

  async createUser(data: CreateUserModel): Promise<any> {
    // Validate the input data
    if (!data || !data.email) {
      throw new Error("Invalid user data: email is required");
    }
  
    // Send the request to the backend
    return this.apiConfig.sendRequest(HttpMethods.POST, Endpoints.USERS, data);
  }

  async updateUser(id: string, data: Partial<UserModel>) {
    return await this.apiConfig.sendRequest(HttpMethods.PATCH, `${Endpoints.USERS}/${id}`, data);
  }

  async deleteUser(id: string) {
    return await this.apiConfig.sendRequest(HttpMethods.DELETE, `${Endpoints.USERS}/${id}`);
  }
}
