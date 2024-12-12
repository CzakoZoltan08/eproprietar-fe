import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";

import { StorageKeys } from "@/constants/storageKeys";

export class ApiConfig {
  api: string;

  constructor(api: string) {
    this.api = api;
  }

  async sendRequest<T = any>(
    method: Method,
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T | null> {
    if (typeof window === "undefined") return null;

    try {
      const accessToken = localStorage.getItem(StorageKeys.token);
      const url = `${this.api}${endpoint}`;

      const config = {
        method,
        url,
        data,
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios<T>(config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}