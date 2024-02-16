import { Request, Response } from "express";
import mongoose from "mongoose";

class MediaController {

    public async getMedia(request: Request, response: Response) {
        try {
            const filename = request.params.filename;
            const file = await mongoose.connection.db.collection('media.files').findOne({ filename });
            if (!file) {
                return response.status(404).json({
                    success: false,
                    message: 'File not found',
                });
            };
            const gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'media' });
            const stream = gridFsBucket.openDownloadStream(new mongoose.Types.ObjectId(file?._id));
            response.set('Content-Type', file?.contentType);
            stream.pipe(response);
        } catch (error: any) {
            return response.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

};

export default new MediaController();