import { BannerLocation } from "../enums/action-type.enum";
import { Career } from "./career.model";
import { Faculty } from "./faculty.model";
import { Image } from "./user.model";

export interface PaidBanner {
  id: number;
  title: string;
  url: string;
  location: BannerLocation;
  date_start: Date;
  date_end: Date;
  order: number;
  faculty_id: number | null;
  career_id: number | null;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  image: Image;
  faculty?: Faculty;
  career?: Career;
}