import { User, Image } from './user.model';
export interface Resource {
    "id": number,
    "name": string,
    "user_id": number,
    "image_id": number,
    "subject_id": number,
    "resource_category_id": number,
    "active"?: boolean,
    "created_at": Date,
    "updated_at": Date,
    "user": User,
    "image": Image,
    "resourceCategory": ResourceCategory
}
export interface ResourceCategory{
    "id": number,
    "name": string,
    "created_at": Date,
    "updated_at": Date
}