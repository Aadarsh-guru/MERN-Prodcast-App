import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        enum: ['open', 'private'],
        default: 'open'
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    speakers: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ],
        required: true,
    },
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);

export default Room;