import {
  CreateAnnouncementDto,
  FetchAnnouncementsModel,
  PropertyAnnouncementModel,
} from "@/models/announcementModels";

import { ApiConfig } from "./ApiConfig";

export class AnnouncementApi {
  apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  async createAnnouncement(data: CreateAnnouncementDto) {
    return await this.apiConfig.sendRequest("POST", "/announcements", data);
  }

  async updateAnnouncement(
    id: string,
    data: Partial<CreateAnnouncementDto>,
  ): Promise<PropertyAnnouncementModel> {
    const response = await this.apiConfig.sendRequest(
      "PATCH",
      `/announcements/${id}`,
      data,
    );
    
    if (response === null) {
      throw new Error("Announcement not found or update failed");
    }
  
    return response;
  }

  async getAnnouncementById(id: string) {
    return await this.apiConfig.sendRequest("GET", `/announcements/${id}`);
  }

  async fetchSavedAnnouncements(userId: string) {
    return await this.apiConfig.sendRequest(
      "GET",
      `/users/get-favourites/${userId}`,
    );
  }

  async fetchPaginatedAnnouncements(data: FetchAnnouncementsModel) {
    let endpoint = "/announcements";
    // if (data?.page) {
    //   endpoint += `?page=${data?.page}`;

    //   if (data?.limit) {
    //     endpoint += `&limit=${data?.limit}`;
    //   }

    //   if (data?.filter?.minSurface && data?.filter?.maxSurface) {
    //     endpoint += `&filter.surface=$btw:${data?.filter?.minSurface},${data?.filter?.maxSurface}`;
    //   } else if (data?.filter?.minSurface) {
    //     endpoint += `&filter.surface=$gte:${data?.filter?.minSurface}`;
    //   } else if (data?.filter?.maxSurface) {
    //     endpoint += `&filter.surface=$lte:${data?.filter?.maxSurface}`;
    //   }

    //   if (data?.filter?.price) {
    //     endpoint += `&filter.price=$lte:${data?.filter?.price}`;
    //   }

    //   if (data?.filter?.city) {
    //     endpoint += `&filter.city=$in:${data?.filter?.city}`;
    //   }

    //   if (data?.filter?.rooms) {
    //     endpoint += `&filter.rooms=$eq:${data?.filter?.rooms}`;
    //   }

    //   if (data?.filter?.type) {
    //     endpoint += `&filter.announcementType=$in:${data?.filter?.type}`;
    //   }

    //   if (data?.filter?.transactionType) {
    //     endpoint += `&filter.transactionType=$in:${data?.filter?.transactionType}`;
    //   }

    //   if (data?.filter?.userId) {
    //     endpoint += `&filter.user=$eq:${data?.filter?.userId}`;
    //   }

    //   if (data?.search?.length) {
    //     endpoint += `&search=${data?.search}`;
    //   }
    // }
    return await this.apiConfig.sendRequest("GET", endpoint);
  }
}
