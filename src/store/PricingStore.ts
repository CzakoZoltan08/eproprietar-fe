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

  async getPricingOptions(userId: string) {
    try {
      const response = await this.pricingApi.getPricingOptions(userId);
      runInAction(() => {
        this.packages = response?.packages || [];
        this.promotions = response?.promotions || [];
      });

      return response;
    } catch (error) {
      console.error("Failed to fetch pricing options", error);
      return { packages: [], promotions: [] };
    }
  }
}