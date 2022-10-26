import AWS from 'aws-sdk';
// import { createWriteStream } from 'fs';
// import sharp from 'sharp';
import { Photo } from '../../../models/Photo';
import photoService from '../../../services/photo.service';

export const saveUpload = async (event: any) => {
    const fileData = event.Records[0].s3.object.key;

    console.log(event)
    console.log(event.Records[0].s3);
    console.log(fileData);
    const photo = new Photo(fileData);
    await photoService.processFileName(photo);

    const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    console.log("replaced key: ", fileData.replace("%40", "@"))
    const params = {Bucket: 'therealyo-photopass', Key: fileData.replace("%40", "@")};
    const data = await s3.getObject(params).promise()
    console.log(data);

    if (photo.albumId) {
        await photo.saveAlbumPhoto()
    }
    
    await photo.saveSelfie();
};
