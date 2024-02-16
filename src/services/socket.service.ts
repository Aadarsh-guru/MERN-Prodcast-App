import { Server } from "socket.io";
import { ACTIONS } from "../constants/socket.actions";

const users = new Map();

const initializeSocketIo = (io: Server) => {

    return io.on('connection', async (socket) => {

        socket.on(ACTIONS.JOIN, ({ roomId, user }: { roomId: string, user: any }) => {
            users.set(socket.id, user);
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.ADD_PEER, {
                    peerId: socket.id,
                    createOffer: false,
                    user,
                });
                socket.emit(ACTIONS.ADD_PEER, {
                    peerId: clientId,
                    createOffer: true,
                    user: users.get(clientId),
                });
            });
            socket.join(roomId);
        });

        // handle relay ice
        socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
            io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, { peerId: socket.id, icecandidate });
        });

        //  handle relay SDP
        socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
            io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, { peerId: socket.id, sessionDescription });
        });

        // hanlde mute
        socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.MUTE, {
                    peerId: socket.id,
                    userId
                });
            });
        });

        // handle unmute
        socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.UN_MUTE, {
                    peerId: socket.id,
                    userId
                });
            });
        });

        // handle leave room
        socket.on(ACTIONS.LEAVE, ({ roomId }) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: users.get(socket.id)?.id
                });
                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: users.get(clientId)?.id
                });
            });
            socket.leave(roomId);
            users.delete(socket.id);
        });

        // remove from all romms on close of browser
        socket.on('disconnecting', () => {
            Array.from(socket.rooms).forEach((roomId) => {
                const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
                clients.forEach((clientId) => {
                    io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                        peerId: socket.id,
                        userId: users.get(socket.id)?.id
                    });
                    socket.emit(ACTIONS.REMOVE_PEER, {
                        peerId: clientId,
                        userId: users.get(clientId)?.id
                    });
                });
                socket.leave(roomId);
            });
            users.delete(socket.id);
        });
    });

};


export default initializeSocketIo;
