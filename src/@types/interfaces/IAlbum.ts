export interface IAlbum {
    readonly albumId?: number;
    readonly name: string;
    readonly userId: number;
    readonly location: string;
    readonly date: string | Date;
    readonly key?: string;
    photos?: { url: string; watermark: boolean }[];
}
