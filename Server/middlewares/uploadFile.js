import multer from 'multer'
import fs from 'fs'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';

export const uploadFile = (folderName) => {

    // const folderName = `${folderName}` || "upload";

    // if (!fs.existsSync(folderName)) {

    //     fs.mkdirSync('./upload')
    // }

    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, '/tmp/my-uploads')
    //     },
    //     filename: function (req, file, cb) {
    //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //         cb(null, file.fieldname + '-' + uniqueSuffix)
    //     }
    // })

    // const upload = multer({ storage: storage })
    // return upload
    const folder = folderName || 'default'

    const storage = new CloudinaryStorage({

        cloudinary: cloudinary,
        params: async (req, file) => {
            return {
                folder: folder,
                public_id: Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname,
                allowed_format: "auto",
                resource_type: 'auto',
            };
        },
    });

    const upload = multer({ storage: storage });
    // console.log(upload)
    return upload

}