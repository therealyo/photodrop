import { BucketParams } from '../@types/BucketParams';
import bucket from '../connectors/s3.connector';

export async function getPresignedUrl(
    method: string,
    params: BucketParams
): Promise<string> {
    return await bucket.getSignedUrlPromise(method, params);
}
