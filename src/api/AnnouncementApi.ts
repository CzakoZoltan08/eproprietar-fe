import {
  CreateAnnouncementDto,
  FetchAnnouncementsModel,
  PropertyAnnouncementModel,
} from "@/models/announcementModels";

import { ApiConfig } from "./ApiConfig";
import { ContentTypes } from "@/constants/content-types.enum";
import { Endpoints } from "@/constants/endpoints";
import { FilterOperators } from "@/constants/filter-operators.enum";
import { HttpMethods } from "@/constants/http-methods.enum";
import { QueryKeys } from "@/constants/query-keys";

export class AnnouncementApi {
  constructor(private apiConfig: ApiConfig) {}

  private async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, delayMs));
        }
      }
    }
    throw lastError;
  }

  async createImageOrVideo(
    fileData: FormData,
    announcementId: string,
    options?: {
      fileName?: string;
      onError?: (fileName: string, message: string) => void;
      maxRetries?: number;
    }
  ): Promise<any | null> {
    const fileName = options?.fileName || "file";

    try {
      return await this.retry(
        () =>
          this.apiConfig.sendRequest(
            HttpMethods.POST,
            `${Endpoints.UPLOADS}/${announcementId}`,
            fileData,
            undefined,
            ContentTypes.MULTIPART
          ),
        options?.maxRetries ?? 3
      );
    } catch (err: any) {
      console.error(`Upload failed for ${fileName}:`, err);
      options?.onError?.(fileName, "Upload failed after multiple attempts.");
      return null;
    }
  }

  async createAnnouncement(data: CreateAnnouncementDto): Promise<any | null> {
    return this.apiConfig.sendRequest(
      HttpMethods.POST,
      Endpoints.ANNOUNCEMENTS,
      data
    );
  }

  async updateAnnouncement(
    id: string,
    data: Partial<CreateAnnouncementDto>
  ): Promise<PropertyAnnouncementModel> {
    const response = await this.apiConfig.sendRequest(
      HttpMethods.PATCH,
      `${Endpoints.ANNOUNCEMENTS}/${id}`,
      data
    );

    if (!response) {
      throw new Error("Announcement not found or update failed");
    }

    return response;
  }

  async getAnnouncementById(id: string) {
    return this.apiConfig.sendRequest(
      HttpMethods.GET,
      `${Endpoints.ANNOUNCEMENTS}/${id}`
    );
  }

  async deleteAnnouncementById(id: string) {
    return this.apiConfig.sendRequest(
      HttpMethods.DELETE,
      `${Endpoints.ANNOUNCEMENTS}/${id}`
    );
  }

  async fetchSavedAnnouncements(userId: string) {
    return this.apiConfig.sendRequest(
      HttpMethods.GET,
      `${Endpoints.FAVORITES}/${userId}`
    );
  }

  async fetchPaginatedAnnouncements(data: FetchAnnouncementsModel) {
    const endpoint = this.buildPaginatedEndpoint(data);
    return this.apiConfig.sendRequest(HttpMethods.GET, endpoint);
  }

  async getAnnouncementImages(announcementId: string) {
    return this.apiConfig.sendRequest(
      HttpMethods.GET,
      `${Endpoints.GET_ANNOUNCEMENT_IMAGES}/${announcementId}`
    );
  }

  async createPaymentSession(paymentData: {
    orderId: string;
    amount: number;
    currency: string;
    packageId: string;
    promotionId?: string;
    originalAmount?: number;
    discountCode?: string;
    promotionDiscountCode?: string;
    invoiceDetails: {
      name: string;
      cif?: string;
      regCom?: string;
      address: string;
      city: string;
      country: string;
      email: string;
      isTaxPayer: boolean;
    };
    products: {
      name: string;
      quantity: number;
      unitOfMeasure: string;
      unitPrice: number;
      currency: string;
      isTaxIncluded: boolean;
      vatPercent: number;
    }[];
  }): Promise<{ checkoutUrl: string } | null> {
    const payload: any = {
      orderId: paymentData.orderId,
      amount: Number(paymentData.amount),
      currency: paymentData.currency,
      packageId: paymentData.packageId,
      invoiceDetails: paymentData.invoiceDetails,
      products: paymentData.products,
    };

    if (paymentData.discountCode) {
      payload.discountCode = paymentData.discountCode;
    }

    if (paymentData.originalAmount) {
      payload.originalAmount = Number(paymentData.originalAmount);
    }

    if (paymentData.promotionId) {
      payload.promotionId = paymentData.promotionId;
    }

    if (paymentData.promotionDiscountCode) {
      payload.promotionDiscountCode = paymentData.promotionDiscountCode;
    }

    return await this.apiConfig.sendRequest(
      HttpMethods.POST,
      Endpoints.PAYMENT_CREATE,
      payload
    );
  }

  private buildPaginatedEndpoint(data: FetchAnnouncementsModel): string {
    const filters = {
      ...this.buildPaginationParams(data),
      ...this.buildFilterParams(data?.filter),
      ...this.buildSearchParam(data?.search),
    };

    const params = Object.entries(filters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return `${Endpoints.PAGINATED_ANNOUNCEMENTS}${
      params ? `?${params}` : ""
    }`;
  }

  private buildPaginationParams(
    data?: FetchAnnouncementsModel
  ): Record<string, string> {
    return {
      [QueryKeys.PAGE]: data?.page?.toString() || "",
      [QueryKeys.LIMIT]: data?.limit?.toString() || "",
    };
  }

  private buildFilterParams(
    filter?: FetchAnnouncementsModel["filter"]
  ): Record<string, string | undefined> {
    if (!filter) return {};

    const {
      minSurface,
      maxSurface,
      price,
      city,
      county,
      rooms,
      type,
      transactionType,
      userId,
      status,
      providerType,
    } = filter;

    return {
      [QueryKeys.FILTER_SURFACE]: this.buildSurfaceFilter(
        typeof minSurface === "number" ? minSurface : undefined,
        typeof maxSurface === "number" ? maxSurface : undefined
      ),
      [QueryKeys.FILTER_PRICE]: price
        ? `${FilterOperators.LESS_THAN_EQUAL}:${price}`
        : undefined,
      [QueryKeys.FILTER_CITY]: city
        ? `${FilterOperators.IN}:${city}`
        : undefined,
      [QueryKeys.FILTER_COUNTY]: county
        ? `${FilterOperators.IN}:${county}`
        : undefined,
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
      [QueryKeys.FILTER_STATUS]: status
        ? `${FilterOperators.IN}:${status}`
        : undefined,
        [QueryKeys.FILTER_PROVIDER_TYPE]: providerType
        ? `${FilterOperators.IN}:${providerType}`
        : undefined,
    };
  }

  private buildSurfaceFilter(
    minSurface?: number,
    maxSurface?: number
  ): string | undefined {
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

  private buildSearchParam(
    search?: string
  ): Record<string, string | undefined> {
    return {
      [QueryKeys.SEARCH]: search?.length ? search : undefined,
    };
  }
}