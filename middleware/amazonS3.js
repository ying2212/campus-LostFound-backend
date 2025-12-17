import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from 'dotenv';

dotenv.config();

// S3 client from env file
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configure multer to upload to S3
export const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // item name
            const itemName = req.body.title || "item"; 
            
            // Sanitize item name
            const safeItemName = itemName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
            
            // Today date
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateString = `${yyyy}${mm}${dd}`;
        
            //suffix
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        
            //S3 uniquefilename
            const filename = `${safeItemName}_${dateString}_${uniqueSuffix}-${file.originalname}`;
        
            cb(null, `uploads/${filename}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});