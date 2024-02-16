import React from 'react';
import { Socket, io } from 'socket.io-client';

const SocketContext = React.createContext<Socket | null>(null);

export const useSocket = () => React.useContext(SocketContext);

const SocketProvider: React.FC<React.PropsWithChildren> = ({
    children
}) => {

    const [socket, setSocket] = React.useState<Socket | null>(null);

    const socketUrl = `${import.meta.env.VITE_API_URL as string || window.location.origin}`

    React.useEffect(() => {
        setSocket(io(socketUrl.replace('http', 'ws'), {
            withCredentials: true
        }))
        return () => {
            socket?.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;