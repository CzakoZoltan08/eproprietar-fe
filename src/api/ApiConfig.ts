import axios, { AxiosError, Method } from "axios";

import { ContentTypes } from "@/constants/content-types.enum";
import { Headers } from "@/constants/headers.enum";
import { auth } from "@/config/firebase";

export class ApiConfig {
  private bearerToken: string | null = null;

  constructor(private readonly api: string) {}

  setAuthToken(token: string) {
    this.bearerToken = token;
  }

  async sendRequest<T = any>(
    method: Method,
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    contentType: ContentTypes = ContentTypes.JSON
  ): Promise<T> {
    if (typeof window === "undefined") {
      throw new Error("sendRequest called on server environment");
    }

    let token = this.bearerToken;

    if (!token) {
      const user = auth.currentUser;
      if (user) {
        try {
          token = await user.getIdToken();
        } catch (e) {
          console.warn("⚠️ Could not get Firebase token:", e);
        }
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
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      throw this.normalizeAxiosError(error);
    }
  }

  private normalizeAxiosError(error: unknown) {
    if (axios.isAxiosError(error)) {
      const ax = error as AxiosError<any>;
      const status = ax.response?.status ?? 0;
      const data = ax.response?.data;
      const message =
        (typeof data === "string" && data) ||
        (data?.message as string) ||
        ax.message ||
        `HTTP ${status}`;

      const err: any = new Error(message);
      err.status = status;
      err.data = data;
      err.isAxiosError = true;
      return err;
    }

    const err: any = error instanceof Error ? error : new Error(String(error));
    err.status = 0;
    return err;
  }
}