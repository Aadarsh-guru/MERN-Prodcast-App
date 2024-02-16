import { Request, Response } from 'express';
import roomService from '../services/room.service';

// created a class for handling all auth controllers
class RoomController {

    // Create Room Controller.
    public async createRoom(request: Request, response: Response) {
        try {
            const { topic, roomType } = request.body;
            if (!topic || !roomType) {
                return response.status(400).json({
                    success: false,
                    message: 'Topic and room type are required.'
                });
            }
            // @ts-expect-error
            const userId = request.userId
            const room = await roomService.create({ roomType, topic, ownerId: userId });
            return response.status(200).json({
                message: 'Room created successfully',
                success: true,
                room
            });
        } catch (error: any) {
            return response.status(500).json({
                message: error.message,
                success: false,
            });
        }
    };

    // Get all rooms controller.
    public async getAllRooms(request: Request, response: Response) {
        try {
            const rooms = await roomService.getAll(['open']);
            return response.status(200).json({
                message: 'Rooms fetched successfully',
                success: true,
                rooms
            });
        } catch (error: any) {
            return response.status(500).json({
                message: error.message,
                success: false
            });
        }
    };

    // Get signle room  by roomId
    public async getRoom(request: Request, response: Response) {
        try {
            const room = await roomService.getRoom(request.params.id);
            return response.status(200).json({
                message: 'Room fetched successfully',
                success: true,
                room
            });
        } catch (error: any) {
            return response.status(500).json({
                message: error.message,
                success: false
            });
        }
    };

    // to update the speaker count on user joined
    public joinRoom = async (request: Request, response: Response) => {
        try {
            const { roomId, userId } = request.body;
            if (!roomId || !userId) {
                return response.status(400).json({
                    success: false,
                    message: 'RoomId and userId are required.'
                });
            }
            const room = await roomService.joinRoom(roomId, userId);
            return response.status(200).json({
                message: 'Room joined successfully',
                success: true,
                room
            });
        } catch (error: any) {
            return response.status(500).json({
                message: error.message,
                success: false
            });
        }
    };

    // to update the speaker count on user left
    public leaveRoom = async (request: Request, response: Response) => {
        try {
            const { roomId, userId } = request.body;
            if (!roomId || !userId) {
                return response.status(400).json({
                    success: false,
                    message: 'RoomId and userId are required.'
                });
            }
            const room = await roomService.leaveRoom(roomId, userId);
            return response.status(200).json({
                message: 'Room leaved successfully',
                success: true,
                room
            });
        } catch (error: any) {
            return response.status(500).json({
                message: error.message,
                success: false
            });
        }
    };

    // to delete the room
    public deleteRoom = async (request: Request, response: Response) => {
        try {
            const room = await roomService.deleteRoom(request.params.id);
            return response.status(200).json({
                message: 'Room deleted successfully',
                sucess: true,
                room
            });
        } catch (error: any) {
            return response.status(500).json({
                message: error.message,
                success: false
            });
        }
    };

};

export default new RoomController();