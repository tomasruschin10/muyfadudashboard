import { Image } from "./user.model";

export interface IModal {
    id: number;
    title: string;
    description: string;
    link?: string;
    icon_type?: string;
    is_active: boolean;
    career_id?: number;
    date_start?: Date;
    date_end?: Date;
    display_frequency: number;
    created_at: Date;
    updated_at: Date;
    image?: Image;
    image_id?: number;
}

export type PayloadModal = Pick<IModal, 'title' | 'description' | 'link' | 'icon_type' | 'is_active' | 'career_id' | 'date_start' | 'date_end' | 'display_frequency'>;