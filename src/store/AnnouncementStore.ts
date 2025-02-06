import {
  CreateAnnouncementDto,
  FetchAnnouncementsModel,
  PropertyAnnouncementModel,
} from "@/models/announcementModels";
import { makeAutoObservable, runInAction } from "mobx";

import { AnnouncementApi } from "@/api/AnnouncementApi";
import autoBind from "auto-bind";

export class AnnouncementStore {
  announcementApi: AnnouncementApi;
  currentAnnouncement: PropertyAnnouncementModel | null;
  announcements: PropertyAnnouncementModel[] | [];
  meta: any;

  constructor(announcementApi: AnnouncementApi) {
    this.announcementApi = announcementApi;
    this.currentAnnouncement = null;
    this.announcements = [];

    makeAutoObservable(this);
    autoBind(this);
  }

  setCurrentAnnouncement(currentAnnouncement: PropertyAnnouncementModel) {
    runInAction(() => {
      this.currentAnnouncement = currentAnnouncement;
    });
  }

  setEmptyCurrentAnnouncement() {
    runInAction(() => {
      this.currentAnnouncement = null;
    });
  }

  setMeta(meta: any) {
    runInAction(() => {
      this.meta = meta;
    });
  }

  setAnnouncements(announcements: PropertyAnnouncementModel[]) {
    runInAction(() => {
      this.announcements = announcements;
    });
  }

  async createAnnouncement(data: CreateAnnouncementDto): Promise<any | null> {
    return await this.announcementApi.createAnnouncement(data);
  }

  async createImageOrVideo(data: FormData, userId: string, announcementId: string): Promise<any | null> {
    return await this.announcementApi.createImageOrVideo(data, userId, announcementId);
  }

  async updateAnnouncement(id: string, data: Partial<CreateAnnouncementDto>) {
    const updated = await this.announcementApi.updateAnnouncement(id, data);

    this.setCurrentAnnouncement(updated);
  }

  async getAnnouncementById(id: string) {
    const announcement = await this.announcementApi.getAnnouncementById(id);
    
    this.setCurrentAnnouncement(announcement);
  
    // Fetch images separately
    if (announcement?.user?.id) {
      this.fetchAnnouncementImages(announcement.user.id, announcement.id);
    }
  }
  

  async fetchPaginatedAnnouncements(data: FetchAnnouncementsModel) {
    try {
      const resp = await this.announcementApi.fetchPaginatedAnnouncements(data);
  
      // Set default values if data is missing
      const announcements = resp?.data ?? [];
      const meta = resp?.meta ?? {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        pageSize: 10, // Default page size
      };
  
      this.setAnnouncements(announcements);
      this.setMeta(meta);
    } catch (error) {
      console.error("Error fetching announcements:", error);
  
      // Fallback to empty defaults
      this.setAnnouncements([]);
      this.setMeta({
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        pageSize: 10,
      });
    }
  }

  async fetchSavedAnnouncements(userId: string) {
    const resp = await this.announcementApi.fetchSavedAnnouncements(userId);

    this.setAnnouncements(resp);
  }

  async fetchAnnouncementImages(userId: string, announcementId: string) {
    try {
      const response = await this.announcementApi.getAnnouncementImages(userId, announcementId);
      
      // Ensure valid response
      const images = response?.resources?.map((resource: any) => ({
        original: resource.optimized_url,
        thumbnail: resource.optimized_url,
      })) ?? [];
  
      // Update current announcement with images
      runInAction(() => {
        if (this.currentAnnouncement) {
          this.currentAnnouncement = {
            ...this.currentAnnouncement,
            images, // Add images to the announcement object
          };
        }
      });
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }  
}
