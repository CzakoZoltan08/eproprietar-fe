import { makeAutoObservable, runInAction } from "mobx";

import { PricingApi } from "@/api/PricingApi";
import autoBind from "auto-bind";

export class PricingStore {
  pricingApi: PricingApi;
  packages: any[] = [];
  promotions: any[] = [];
  freePlanId: string | null = null;

  constructor(pricingApi: PricingApi) {
    this.pricingApi = pricingApi;

    makeAutoObservable(this);
    autoBind(this);
  }

  async getAnnouncementPackages(userId: string, targetAudience: string = 'normal') {
    try {
      const response = await this.pricingApi.getAnnouncementPackages(userId, targetAudience);
      runInAction(() => {
        this.packages = response?.packages || [];
        const freePkg = this.packages.find(p => Number(p.price) === 0);
        this.freePlanId = freePkg?.id || null;
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