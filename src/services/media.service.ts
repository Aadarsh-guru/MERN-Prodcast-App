import mongoose from 'mongoose';
import { Readable } from 'stream';

class MediaService {

    public async uploadFile(file: Express.Multer.File) {
        try {
            const gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'media' });
            const fileName = `${Date.now()}.${file?.originalname.split('.').pop()}`
            const uploadFile = gridFsBucket.openUploadStream(fileName, { contentType: file?.mimetype });
            const readableStream = new Readable();
            readableStream.push(file?.buffer);
            readableStream.push(null);
            readableStream.pipe(uploadFile);
            return fileName;
        } catch (error) {
            throw error;
        }
    }

};

export default new MediaService();