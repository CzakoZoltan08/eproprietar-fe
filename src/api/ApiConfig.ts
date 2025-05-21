import axios, { Method } from "axios";

import { ContentTypes } from "@/constants/content-types.enum";
import { Headers } from "@/constants/headers.enum";
import { auth } from "@/config/firebase";

export class ApiConfig {
  constructor(private readonly api: string) {}

  async sendRequest<T = any>(
    method: Method,
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    contentType: ContentTypes = ContentTypes.JSON
  ): Promise<T | null> {
    if (typeof window === "undefined") return null;

    let token: string | null = null;

    const user = auth.currentUser;
    if (user) {
      try {
        token = await user.getIdToken();
      } catch (e) {
        console.warn("⚠️ Could not get Firebase token:", e);
      }
    }

    try {
      const response = await axios<T>({
        method,
        url: `${this.api}${endpoint}`,
        data,
        params,
        headers: {
          ...(token ? { [Headers.AUTHORIZATION]: `Bearer ${token}` } : {}),
          [Headers.CONTENT_TYPE]: contentType,
        },
      });

      return response.data;
    } catch (error) {
      // this.logError(error);
      // return null;
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