import { Image } from "./user.model";
import { Partner } from 'src/app/shared/models/offer.model';
import { Career } from 'src/app/shared/models/career.model';

export interface Advertisement{
    "id": number,
    "title": string,
    "career_id": number,
    "partner_id": number,
    "image_id": number,
    "url": string,
    "date_start": Date,
    "date_end": Date,
    "created_at": Date,
    "updated_at": Date,
    "image": Image,
    "partner": Partner,
    "career": Career
}