import { Photo } from '../../../models/Photo';

export const upload = async (event: any) => {
    const fileData = event.Records[0].s3.object.key;
    const photo = new Photo(fileData);
    await photo.processFileName();
    await photo.save();
};
