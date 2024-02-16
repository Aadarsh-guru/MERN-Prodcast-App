import api from "./api";


const createRoom = async (data: any) => {
    try {
        return await api.post(`/room/create-room`, data);
    } catch (error) {
        throw error;
    }
};

const fetchAllRooms = async () => {
    try {
        return await api.get(`/room/get-rooms`);
    } catch (error) {
        throw error;
    }
};

const fetchRoom = async (roomId: string) => {
    try {
        return await api.get(`/room/get-room/${roomId}`);
    } catch (error) {
        throw error;
    }
};


const joinRoom = async (data: { roomId: string, userId: string }) => {
    try {
        return await api.post(`/room/join-room`, data);
    } catch (error) {
        throw error;
    }
};


const leaveRoom = async (data: { roomId: string, userId: string }) => {
    try {
        return await api.post(`/room/leave-room`, data);
    } catch (error) {
        throw error;
    }
};


const deleteRoom = async (roomId: string) => {
    try {
        return await api.delete(`/room/delete-room/${roomId}`);
    } catch (error) {
        throw error;
    }
};


export {
    createRoom,
    fetchAllRooms,
    fetchRoom,
    joinRoom,
    leaveRoom,
    deleteRoom,
};