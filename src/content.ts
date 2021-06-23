export interface Content {
    id: string;
    mediaType: MediaType;
    source: string;
    title: string;
    contentUrl: string;
    previewUrl: string;
    votes: number;
    description: string;
    length: number;
    aspectRatio: string;
    topic: string;
}

enum MediaType {
    VIDEO,
    IMAGE
}