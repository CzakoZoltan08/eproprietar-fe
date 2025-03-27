import { ApiConfig } from "./ApiConfig";
import { Endpoints } from "@/constants/endpoints";
import { HttpMethods } from "@/constants/http-methods.enum";

export class PricingApi {
  constructor(private apiConfig: ApiConfig) {}

  async getAnnouncementPackages(userId: string, targetAudience: string = 'normal') {
    return await this.apiConfig.sendRequest(HttpMethods.GET, `${Endpoints.PRICING_PACKAGES}?userId=${userId}&audience=${targetAudience}`);
  }
  
  async getPromotionPackages(userId: string) {
    return await this.apiConfig.sendRequest(HttpMethods.GET, `${Endpoints.PRICING_PROMOTIONS}?userId=${userId}`);
  }
}