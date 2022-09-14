export interface BucketParams {
    Bucket: string;
    Key: string;
    expiresIn?: number;
    ACL?: string;
    Body?: string;
}
