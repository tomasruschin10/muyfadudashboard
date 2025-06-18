import { Career } from "./career.model"

export interface User{
  "id": number,
  "username": string,
  "email": string,
  "password": string,
  "name": string,
  "lastname": string,
  "phone": string,
  "instagram": string,
  "web": string,
  "uid": string,
  "active": boolean,
  "career_id": number,
  "image_id": number,
  "remember_token": string,
  "device_token": string,
  "created_at": Date,
  "updated_at": Date,
  "userRole": UserRole[],
  "career": Career,
  "image": Image
}
export interface UserRole{
  "id": number,
  "user_id": number,
  "role_id": number,
  "created_at": Date,
  "updated_at": Date,
  "role": Role
}
export interface Role{
  "id": number,
  "name": string,
  "created_at": Date,
  "updated_at": Date
}
export interface Image{
  "id": number,
  "url": string,
  "name": string,
  "created_at": Date,
  "updated_at": Date
}

export type UserWithcounters = User & {
  opinionCount: number;
  rewardRequestsCount: number;
  actionPoints: number;
  referralCount: number;
  totalPoints: number;
}