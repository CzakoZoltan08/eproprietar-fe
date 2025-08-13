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
  landSurface?: number; // Add this line
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
  balconyCount?: number; // Add this line
  parkingCount?: number; // Add this line
  images?: { original: string; thumbnail: string }[];
  videos?: { original: string; format: string }[];
  endDate?: string; // Add this line
  logoUrl?: string;
  developerName?: string;
  phoneContact?: string;
  sketchUrl?: string;
  createdAt: string;
  isPromoted?: boolean;
  apartmentTypeOther?: string;
  streetFront: boolean;
  heightRegime: string[];
  streetFrontLength?: number; // in ml
  landType?: string; // Constructii, Agricol, etc.
  landPlacement?: string; // Intravilan, Extravilan
  urbanismDocuments?: string[]; // PUZ, PUD, etc.
  utilities?: {
    curent: boolean | null;
    apa: boolean | null;
    canalizare: boolean | null;
    gaz: boolean | null;
  };
  commercialSpaceType?: string;
  usableSurface?: number;
  builtSurface?: number;
  spaceHeight?: number;
  hasStreetWindow?: boolean;
  streetWindowLength?: number;
  hasStreetEntrance?: boolean;
  hasLift?: boolean;
  vehicleAccess?: string[];
  stage?: string;
  neighborhood?: string;          // Cartier / zonă
  constructionStart?: string;     // ISO (prima zi a lunii)
  floorsCount?: number;           // Nr. de etaje
  amenities?: string[];           // Facilități (listă)
  developerSite?: string;         // URL site dezvoltator
  frameType?: string;             // Tip chenar pagina de prezentare
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
  balcony?: string;
  parking?: string;
  balconyCount?: number;
  parkingCount?: number;
  floor?: number;
  isNew?: boolean;
  user: { id: string; firebaseId: string } = { id: '', firebaseId: ''};
  imageUrl?: string;
  status: string = 'pending';
  logoUrl?: string;
  phoneContact: string | undefined;
  sketchUrl?: string;
  apartmentTypeOther?: string = '';
  streetFront: boolean = false;
  heightRegime: string[] = [];
  streetFrontLength?: number;
  landType?: string;
  landPlacement?: string;
  urbanismDocuments: string[] = [];
  utilities: {
    curent: boolean | null;
    apa: boolean | null;
    canalizare: boolean | null;
    gaz: boolean | null;
  } = {
    curent: null,
    apa: null,
    canalizare: null,
    gaz: null,
  };
  // ✅ Spatii comerciale
  commercialSpaceType?: string = ''; // Tip spațiu - required
  usableSurface?: number = 0; // Suprafață utilă
  builtSurface?: number = 0; // Suprafață construită
  spaceHeight?: number = 0;  // Înălțime spațiu
  hasStreetWindow?: boolean = false; // Vitrină la stradă
  streetWindowLength?: number = 0; // Front vitrină
  hasStreetEntrance?: boolean = false; // Intrare din stradă
  hasLift?: boolean = false; // Lift
  vehicleAccess: string[] = []; // Acces auto
  stage?: string;
  neighborhood?: string = "";
  constructionStart?: string = "";     // ISO (ex: 2026-08-01T00:00:00.000Z)
  floorsCount?: number = 0;
  amenities?: string[] = [];           // parsezi din textarea (split pe virgulă)
  developerSite?: string = "";
  frameType?: string = "";
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
