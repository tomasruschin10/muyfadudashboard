import { Subject } from './career.model';
import { User } from './user.model';
export interface Opinion{
    "id": number,
    "title": string,
    "description": string,
    "student_id": number,
    "subject_id": number,
    "professor": string,
    "created_at": Date,
    "updated_at": Date,
    "answersCount": number,
    "opinionTags": OpinionTags[]
    "subject": Subject,
    "student": User
}
export interface OpinionTags{
    "id": number,
    "opinion_id": number,
    "tag_id": number,
    "created_at": Date,
    "updated_at": Date,
    "tag": Tag
}
export interface Tag{
    "id": number,
    "name": string,
    "created_at": Date,
    "updated_at": Date
}
export interface OpinionAnswer{
    "id": number,
    "description": string,
    "opinion_id": number,
    "student_id": number,
    "created_at": Date,
    "updated_at": Date,
    "student": User
}