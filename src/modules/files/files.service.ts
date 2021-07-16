import { BadRequestException, Injectable, HttpException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as config from 'config';

@Injectable()
export class FilesService {
    defaultBucket;
    constructor() {
        this.defaultBucket = config.has('s3.defaultBucket') ? config.get('s3.defaultBucket') : process.env.DEFAULT_BUCKET;
    }


    async upload(file, user) {
        const { originalname } = file;
        const bucketS3 = this.defaultBucket + '/' + user.id;
        return await this.uploadS3(file.buffer, bucketS3, originalname);
    }

    async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: uuid() + String(name),
            Body: file,
        };
        return new Promise((resolve, reject) => {

            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err.message);
                }
                console.log(data)
                resolve(data);
            });
        });
    }

    getS3() {
        return new S3({
            accessKeyId: config.has("s3.accessKeyId") ? config.get("s3.accessKeyId") : process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.has("s3.secretAccessKey") ? config.get("s3.secretAccessKey") : process.env.AWS_SECRET_ACCESS_KEY,
            endpoint: config.has("s3.endpointUrl") ? config.get("s3.endpointUrl") : process.env.AWS_ENDPOINT_URL,
            s3ForcePathStyle: true, // needed with minio?
            signatureVersion: 'v4'
        });
    }


    /******************* */

    async generatePublicGetSignedURL(body, user) {
        const s3 = this.getS3();
        if (body.key.startsWith('public/')) {
            const params = {
                Bucket: this.defaultBucket,
                Key: body.key,
                Expires: 120 // 2 minutes
            };
            return await s3.getSignedUrl('getObject', params);
        }
        else {
            throw new HttpException("Invalid URL", 400)
        }
    }

    async generatePutSignedURL(body, user) {
        const s3 = this.getS3();
        const type = body.type ?? 'private';
        if (["public", "private"].includes(type)
        ) {

            const key = type + "/" + user.id + "/" + uuid() + body.filename;
            const params = {
                Bucket: this.defaultBucket,
                Key: key,
                ContentType: body.ContentType,
                Expires: 120 // 2 minutes
            };
            const signedUrl = await s3.getSignedUrl('putObject', params);
            return {
                signedUrl: signedUrl,
                key: key
            }
        }
        else {
            throw new HttpException("Invalid URL", 400)
        }

    }
}
