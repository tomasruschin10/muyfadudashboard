export interface Notice{
    "id": number,
    "name": string,
    "image_id": number,
    "date_start": Date,
    "date_end": Date,
    "created_at": Date,
    "updated_at": Date,
    "image": {
        "id": number,
        "url": string,
        "name": string,
        "created_at": Date,
        "updated_at": Date
    }
}