export interface AlbumInterface {
    readonly albumId?: number;
    readonly albumName: string;
    readonly userId: number;
    readonly location: string;
    readonly date: string | Date;
    readonly key?: string;
    photos?: { url: string; watermark: boolean }[];
}
