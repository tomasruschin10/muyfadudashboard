import { Career } from "./career.model";
import { Image } from "./user.model";

export interface Faculty {
  id: number;
  title: string;
  description: string;
  image: Image;
  created_at: Date;
  updated_at: Date;
  careers?: Career[];
}