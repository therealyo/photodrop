import { Photo } from '../../../models/Photo';

export const saveUpload = async (event: any) => {
    const fileData = event.Records[0].s3.object.key;
    console.log(fileData);
    const photo = new Photo(fileData);
    await photo.processFileName();
    await photo.save();
};
