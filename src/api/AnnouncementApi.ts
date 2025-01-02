import {
  CreateAnnouncementDto,
  FetchAnnouncementsModel,
  PropertyAnnouncementModel,
} from "@/models/announcementModels";

import { ApiConfig } from "./ApiConfig";
import{ Endpoints } from "@/constants/endpoints";
import{ FilterOperators } from "@/constants/filter-operators.enum";
import{ HttpMethods } from "@/constants/http-methods.enum";
import{ QueryKeys } from "@/constants/query-keys";

export class AnnouncementApi {
  constructor(private apiConfig: ApiConfig) {}

  async createAnnouncement(data: CreateAnnouncementDto) {
    return this.apiConfig.sendRequest(HttpMethods.POST, Endpoints.ANNOUNCEMENTS, data);
  }

  async updateAnnouncement(
    id: string,
    data: Partial<CreateAnnouncementDto>,
  ): Promise<PropertyAnnouncementModel> {
    const response = await this.apiConfig.sendRequest(
      HttpMethods.PATCH,
      `${Endpoints.ANNOUNCEMENTS}/${id}`,
      data,
    );

    if (!response) {
      throw new Error("Announcement not found or update failed");
    }

    return response;
  }

  async getAnnouncementById(id: string) {
    return this.apiConfig.sendRequest(HttpMethods.GET, `${Endpoints.ANNOUNCEMENTS}/${id}`);
  }

  async fetchSavedAnnouncements(userId: string) {
    return this.apiConfig.sendRequest(
      HttpMethods.GET,
      `${Endpoints.FAVORITES}/${userId}`,
    );
  }

  async fetchPaginatedAnnouncements(data: FetchAnnouncementsModel) {
    const endpoint = this.buildPaginatedEndpoint(data);
    return this.apiConfig.sendRequest(HttpMethods.GET, endpoint);
  }

  private buildPaginatedEndpoint(data: FetchAnnouncementsModel): string {
    const filters = {
      ...this.buildPaginationParams(data),
      ...this.buildFilterParams(data?.filter),
      ...this.buildSearchParam(data?.search),
    };
  
    const params = Object.entries(filters)
      .filter(([_, value]) => value !== undefined) // Exclude undefined values
      .map(([key, value]) => `${key}=${value}`) // Map key-value pairs to query strings
      .join("&");
  
    return `${Endpoints.ANNOUNCEMENTS}${params ? `?${params}` : ""}`;
  }
  
  private buildPaginationParams(data?: FetchAnnouncementsModel): Record<string, string> {
    return {
      [QueryKeys.PAGE]: data?.page?.toString() || "",
      [QueryKeys.LIMIT]: data?.limit?.toString() || "",
    };
  }
  
  private buildFilterParams(filter?: FetchAnnouncementsModel["filter"]): Record<string, string | undefined> {
    if (!filter) return {};
  
    const {
      minSurface,
      maxSurface,
      price,
      city,
      rooms,
      type,
      transactionType,
      userId,
    } = filter;
  
    return {
      [QueryKeys.FILTER_SURFACE]: this.buildSurfaceFilter(
        typeof minSurface === "number" ? minSurface : undefined,
        typeof maxSurface === "number" ? maxSurface : undefined
      ),
      [QueryKeys.FILTER_PRICE]: price
        ? `${FilterOperators.LESS_THAN_EQUAL}:${price}`
        : undefined,
      [QueryKeys.FILTER_CITY]: city ? `${FilterOperators.IN}:${city}` : undefined,
      [QueryKeys.FILTER_ROOMS]: rooms
        ? `${FilterOperators.EQUAL}:${rooms}`
        : undefined,
      [QueryKeys.FILTER_ANNOUNCEMENT_TYPE]: type
        ? `${FilterOperators.IN}:${type}`
        : undefined,
      [QueryKeys.FILTER_TRANSACTION_TYPE]: transactionType
        ? `${FilterOperators.IN}:${transactionType}`
        : undefined,
      [QueryKeys.FILTER_USER]: userId
        ? `${FilterOperators.EQUAL}:${userId}`
        : undefined,
    };
  }
  
  private buildSurfaceFilter(minSurface?: number, maxSurface?: number): string | undefined {
    if (minSurface && maxSurface) {
      return `${FilterOperators.BETWEEN}:${minSurface},${maxSurface}`;
    }
    if (minSurface) {
      return `${FilterOperators.GREATER_THAN_EQUAL}:${minSurface}`;
    }
    if (maxSurface) {
      return `${FilterOperators.LESS_THAN_EQUAL}:${maxSurface}`;
    }
    return undefined;
  }
  
  private buildSearchParam(search?: string): Record<string, string | undefined> {
    return {
      [QueryKeys.SEARCH]: search?.length ? search : undefined,
    };
  }
}