import { makeAutoObservable, runInAction } from "mobx";

import { PricingApi } from "@/api/PricingApi";
import autoBind from "auto-bind";

export class PricingStore {
  pricingApi: PricingApi;
  packages: any[] = [];
  promotions: any[] = [];

  constructor(pricingApi: PricingApi) {
    this.pricingApi = pricingApi;

    makeAutoObservable(this);
    autoBind(this);
  }

  async getAnnouncementPackages(userId: string) {
    try {
      const response = await this.pricingApi.getAnnouncementPackages(userId);
      runInAction(() => {
        this.packages = response?.packages || [];
      });

      return response;
    } catch (error) {
      console.error("Failed to fetch pricing packages", error);
      return { packages: [] };
    }
  }

  async getPromotionPackages(userId: string) {
    try {
      const response = await this.pricingApi.getPromotionPackages(userId);
      runInAction(() => {
        this.promotions = response?.promotions || [];
      });

      return response;
    } catch (error) {
      console.error("Failed to fetch promotion options", error);
      return { promotions: [] };
    }
  }
}