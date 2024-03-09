export class Space {
    name: string;
    description: string;
    imageUrl: string;
    locationUrl: string;
    rating: number;
    type: SpaceType;
    latitude: number;
    longitude: number;

    constructor(name: string, description: string, imageUrl: string, locationUrl: string, rating: number, type: SpaceType) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.locationUrl = locationUrl;
        this.rating = rating;
        this.type = type;
        this.latitude = 0;
        this.longitude = 0;
    }
}

export enum SpaceType {
    Silent = "Silent",
    Busy = "Busy",
    Meeting = "Meeting"
}