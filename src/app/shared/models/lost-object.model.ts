import { User, Image } from './user.model';

export interface LostObject{
    "id": number,
    "user_id": number,
    "title": string,
    "description": string,
    "image_id": number,
    "created_at": Date,
    "updated_at": Date,
    "image": Image,
    "user": User
}