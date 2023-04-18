import { Offer } from "./offer.model";

export interface Balance{
    "id": number,
    "description": string,
    "amount": number,
    "offer_id": number,
    "created_at": Date,
    "updated_at": Date,
    "offer": Offer
}