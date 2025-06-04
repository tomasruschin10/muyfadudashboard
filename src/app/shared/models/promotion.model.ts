import { Image } from "./user.model";

export interface Promotion {
    id: number;
    title: string;
    description: string;
    discount_percentage: number;
    coupon_code?: string;
    featured_until?: Date;
    start_date: Date;
    end_date: Date;
    url?: string;
    business_name: string;
    image_id?: number;
    order: number;
    terms_conditions?: string;
    is_featured: boolean;
    created_at: Date;
    updated_at?: Date;
    image?: Image;
}