import { AgencyModel } from "@/models/agencyModel";
import { UserModel } from "@/models/userModels";

export interface PropertyAnnouncementModel {
  announcementType: string;
  providerType: string;
  transactionType: string;
  title: string;
  city: string;
  county: string;
  street?: string;
  price: number;
  rooms: number;
  surface: number;
  currency: string;
  schema?: string;
  description: string;
  partitioning?: string;
  number?: number;
  floor: number;
  isNew?: boolean;
  user: UserModel | null;
  imageUrl?: string;
  id: string;
  agency?: AgencyModel;
  baths?: number;
  comfortLevel?: number;
  numberOfKitchens?: number;
  balcony?: string;
  parking?: string;
  images?: { original: string; thumbnail: string }[];
  videos?: { original: string; format: string }[];
  endDate?: string; // Add this line
  logoUrl?: string;
  developerName?: string;
  phoneContact?: string;
  sketchUrl?: string;
}

export class CreateAnnouncementDto {
  announcementType?: string = '';
  providerType?: string = '';
  transactionType?: string = '';
  title: string = '';
  city?: string = '';
  street?: string = '';
  price?: number = 0;
  rooms?: number = 0;
  baths?: number = 0;
  surface?: number = 0;
  schema?: string = '';
  description?: string = '';
  partitioning?: string;
  numberOfKitchens?: number;
  floor?: number;
  isNew?: boolean;
  user: { id: string; firebaseId: string } = { id: '', firebaseId: ''};
  imageUrl?: string;
  status: string = 'pending';
  logoUrl?: string;
  phoneContact: string | undefined;
  sketchUrl?: string;
}

export interface FetchAnnouncementsModel {
  page?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: {
    [column: string]: number | string | string[];
  };
  select?: string[];
  path?: string;
}
