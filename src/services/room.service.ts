import Room from "../models/room.model";

class RoomService {

    async create(paylod: { roomType: string, topic: string, ownerId: string }) {
        try {
            const { roomType, topic, ownerId } = paylod;
            return await Room.create({ roomType, topic, ownerId, speakers: [ownerId] });
        } catch (error) {
            throw error;
        }
    };

    async getAll(roomTypes: ['open' | 'private']) {
        try {
            return await Room.find({ roomType: { $in: roomTypes } })
                .populate({
                    path: 'speakers',
                    select: '-refreshToken -email -activated -updatedAt -createdAt -__v'
                })
                .sort({ createdAt: 'descending' })
                .exec();
        } catch (error) {
            throw error;
        }
    };

    async getRoom(roomId: string) {
        try {
            return await Room.findById(roomId);
        } catch (error) {
            throw error;
        }
    };

    async joinRoom(roomId: string, userId: string) {
        try {
            return await Room.findOneAndUpdate({ _id: roomId }, { $push: { speakers: userId } }, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async leaveRoom(roomId: string, userId: string) {
        try {
            return await Room.findOneAndUpdate({ _id: roomId }, { $pull: { speakers: userId } }, { new: true });
        } catch (error) {
            throw error;
        }
    };

    async deleteRoom(roomId: string) {
        try {
            return await Room.findByIdAndDelete(roomId);
        } catch (error) {
            throw error;
        }
    };

};

export default new RoomService();