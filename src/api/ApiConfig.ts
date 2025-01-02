import axios, { Method } from "axios";

import { ContentTypes } from "@/constants/content-types.enum";
import { Headers } from "@/constants/headers.enum";
import { StorageKeys } from "@/constants/storageKeys";

export class ApiConfig {
  constructor(private readonly api: string) {}

  async sendRequest<T = any>(
    method: Method,
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T | null> {
    if (typeof window === "undefined") return null;

    try {
      const accessToken = localStorage.getItem(StorageKeys.token);
      const response = await axios<T>({
        method,
        url: `${this.api}${endpoint}`,
        data,
        params,
        headers: {
          [Headers.AUTHORIZATION]: `Bearer ${accessToken}`,
          [Headers.CONTENT_TYPE]: ContentTypes.JSON,
        },
      });

      return response.data;
    } catch (error) {
      this.logError(error);
      return null;
    }
  }

  private logError(error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data || error.message
      : error;
    console.error("API Error:", message);
  }
}