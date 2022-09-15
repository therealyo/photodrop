export interface AlbumInterface {
    readonly albumId?: number;
    readonly albumName: string;
    readonly userId: number;
    readonly location: string;
    readonly date: string;
    readonly key?: string;
    photos?: string[];
}
