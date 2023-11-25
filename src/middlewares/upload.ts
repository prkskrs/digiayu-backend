import AWS from 'aws-sdk';
import multer, { MulterError } from 'multer';
import multerS3 from 'multer-s3';
import { Request, Response, NextFunction } from 'express';
import { Multer } from 'multer';
import { Database } from "../database/Database";
import { User } from '../interfaces/db';
import path from 'path';

const database = new Database();

const s3 = new AWS.S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});


s3.listBuckets((err: AWS.AWSError, data: AWS.S3.ListBucketsOutput) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('S3 Client Bucket Using:', data.Buckets[0].Name);
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        endpoint: process.env.S3_ENDPOINT,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        key: async function (req: Request, file: Multer.File, cb: (error: Error | null, key: string) => void) {
            const userId = req.params.userId;
            const user: User | null = await database.getById('user', userId)
            // console.log(user);

            const userRole = user?.role;
            const fieldName = req.params.fieldName;

            let folderName = '';
            if (userRole === 'patient') {
                folderName = `patient/${userId}/`;
            } else if (userRole === 'doctor') {
                folderName = `doctor/${userId}/`;
            }
            // console.log(file);
            const fileExtension = path.extname(file.originalname);
            const s3Key = folderName + fieldName + fileExtension;
            // console.log(s3Key);
            cb(null, s3Key);
        }
    })
});

function customUploadMiddleware(key: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        console.log('Additional parameter:', key);
        upload.single(key)(req, res, function (error: Error | MulterError) {
            if (error instanceof MulterError) {
                return res.status(400).json({ error: error.message });
            } else if (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
            next();
        });
    };
}

export default customUploadMiddleware;
