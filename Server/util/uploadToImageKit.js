// util/uploadToImageKit.js
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export async function uploadToImageKit(filePath, fileName) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('fileName', fileName);
    form.append('useUniqueFileName', 'true');
    form.append('folder', '/uploads');

    const headers = {
        ...form.getHeaders(),
        Authorization:
            'Basic ' +
            Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64'),
    };

    const response = await axios.post(
        'https://upload.imagekit.io/api/v1/files/upload',
        form,
        { headers }
    );

    return response.data;
}
