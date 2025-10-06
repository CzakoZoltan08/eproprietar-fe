import { CreateFirebaseUserModel, CreateUserModel, UserModel } from "@/models/userModels";

import { ApiConfig } from "./ApiConfig";
import { Endpoints } from "@/constants/endpoints";
import { HttpMethods } from "@/constants/http-methods.enum";

export class UserApi {
  apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  async getAllUsers() {
    return this.apiConfig.sendRequest(HttpMethods.GET, Endpoints.USERS);
  }

  async getUserByEmail(email: string) {
    const normalized = (email ?? "").trim().toLowerCase();
    const url = `${Endpoints.USERS_BY_EMAIL}?email=${encodeURIComponent(normalized)}`;

    try {
      return await this.apiConfig.sendRequest(HttpMethods.GET, url);
    } catch (err: any) {
      if (err?.status === 404) return null; // only 404 means "not found"
      throw err; // any other error -> bubble up
    }
  }

  async getUserById(id: string) {
    return this.apiConfig.sendRequest(HttpMethods.GET, `${Endpoints.USERS}/${id}`);
  }

  async createUser(data: CreateUserModel): Promise<any> {
    if (!data || !data.email) throw new Error("Invalid user data: email is required");

    const payload: CreateUserModel = {
      ...data,
      email: data.email.trim().toLowerCase(),
    };

    return this.apiConfig.sendRequest(HttpMethods.POST, Endpoints.USERS, payload);
  }

  async createFirebaseUser(data: CreateFirebaseUserModel): Promise<any> {
    if (!data || !data.email) throw new Error("Invalid user data: email is required");

    const payload: CreateFirebaseUserModel = {
      ...data,
      email: data.email.trim().toLowerCase(),
    };

    return this.apiConfig.sendRequest(HttpMethods.POST, Endpoints.USERS_FIREBASE, payload);
  }

  async updateUser(id: string, data: Partial<UserModel>) {
    const payload = {
      ...data,
      ...(data.email ? { email: data.email.trim().toLowerCase() } : null),
    };
    return this.apiConfig.sendRequest(HttpMethods.PATCH, `${Endpoints.USERS}/${id}`, payload);
  }

  async deleteUser(id: string) {
    return this.apiConfig.sendRequest(HttpMethods.DELETE, `${Endpoints.USERS}/${id}`);
  }
}