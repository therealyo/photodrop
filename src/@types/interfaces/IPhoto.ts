export interface IPhoto {
    readonly name?: string;
    readonly albumId?: number;
    readonly link?: string;
    readonly userId?: number;
    readonly waterMark: boolean;
    numbers?: string[];
}
