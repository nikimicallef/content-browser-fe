export interface Content {
    id: string;
    mediaType: string;
    source: string;
    title: string;
    contentUrl: string;
    previewUrl: string;
    votes: number;
    description: string | null;
    length: number | null;
    aspectRatio: string | null;
    topic: string | null;
}