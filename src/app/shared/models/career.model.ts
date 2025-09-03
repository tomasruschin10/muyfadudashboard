import { Image } from "./user.model";

export interface Career{
    "id": number,
    "name": string,
    "image_id": number,
    "faculty_id": number | null
    description_url?: string
    "created_at": Date,
    "updated_at": Date,
    "image": Image
}

export interface Subject{
    "id": number,
    "name": string,
    "subject_category_id": number,
    "created_at": Date,
    "updated_at": Date,
    "subjectCategory": SubjectCategory,
    "userSubject": UserSubject[]
}
export interface UserSubject{
    "id": number,
    "user_id": number,
    "subject_id": number,
    "score": number,
    "finish": boolean,
    "created_at": Date,
    "updated_at": Date
}
export interface SubjectCategory{
    "id": number,
    "name": string,
    "career_id": number,
    "created_at": Date,
    "updated_at": Date
}