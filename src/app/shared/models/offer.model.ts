import { Image } from './user.model';
export interface Offer{
    "id": number,
    "title": string,
    "offer_category_id": number,
    "career_id": number,
    "partner_id": number,
    "description": string,
    "email"?: string
    "point": number,
    "url": string,
    "image_id": number,
    "created_at": Date,
    "updated_at": Date,
    "offerCategory": OfferCategory,
    "career": Career,
    "image": Image,
    "partner": Partner,
    "approved": boolean,
    start_date?: string,
    end_date?: string
}
export interface OfferCategory{
    "id": number,
    "name": string,
    "created_at": Date,
    "updated_at": Date
}
export interface Career{
    "id": number,
    "name": string,
    "created_at": Date,
    "updated_at": Date
    "image_id": number,
    "description_url": string;
}
export interface Partner{
    "id": number,
    "name": string,
    "created_at": Date,
    "updated_at": Date
}