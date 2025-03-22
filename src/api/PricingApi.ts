import { ApiConfig } from "./ApiConfig";
import { Endpoints } from "@/constants/endpoints";
import { HttpMethods } from "@/constants/http-methods.enum";

export class PricingApi {
  constructor(private apiConfig: ApiConfig) {}

  async getPricingOptions(userId: string) {
    return this.apiConfig.sendRequest(
      HttpMethods.GET,
      `${Endpoints.PRICING_OPTIONS}?userId=${userId}`
    );
  }
}