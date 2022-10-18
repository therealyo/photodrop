import { Photo } from '../../../models/Photo';

export const saveUpload = async (event: any) => {
    const fileData = event.Records[0].s3.object.key;
    const photo = new Photo(fileData);
    await photo.processFileName();

    // console.log(photo);
    if (photo.albumId) {
        // console.log(photo.albumId);
        await photo.saveAlbumPhoto()
    }
    
    // console.log(`UPDATE clients SET selfieLink=${photo.photoId} WHERE clienId=${photo.userId}`);
    await photo.saveSelfie();
};
