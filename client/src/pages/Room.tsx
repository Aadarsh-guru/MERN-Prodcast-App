import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWebRTC } from '../hooks/useWebRTC';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { baseUrl } from '../services/api';
import MonkeyImage from '../assets/monkey-avatar.png';
import { Copy, Hand, Loader2, Mic, MicOff, Trash } from 'lucide-react';
import { Room as RoomType } from '../types';
import { deleteRoom, fetchRoom, joinRoom, leaveRoom } from '../services/room.service';
import toast from 'react-hot-toast';

const Room: React.FC = () => {

    const navigate = useNavigate();
    const { roomId } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
    const [room, setRoom] = React.useState<RoomType>();
    const [isMuted, setIsMuted] = React.useState<boolean>(true);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        handleMute(isMuted, user?.id!);
    }, [isMuted]);

    React.useEffect(() => {
        (async () => {
            const { data } = await fetchRoom(roomId!);
            if (data?.success) {
                setRoom(data?.room);
            }
        })();
    }, [roomId]);

    React.useEffect(() => {
        const handleJoinRoom = async () => {
            await joinRoom({ roomId: roomId!, userId: user?.id! });
        };
        (room?.ownerId && room.ownerId !== user?.id) && handleJoinRoom();
    }, [room?.ownerId, user?.id]);

    const handleLeaveRoom = async () => {
        try {
            setLoading(true);
            if (room?.ownerId !== user?.id) {
                await leaveRoom({ roomId: roomId!, userId: user?.id! });
            } else {
                await deleteRoom(roomId!);
            }
            navigate('/rooms');
        } catch (error: any) {
            console.log(error);
            toast.error(error.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    const handleMuteClick = (clientId: string) => {
        if (clientId === user?.id) {
            setIsMuted(!isMuted);
        }
    };

    const handleCopyRoomLink = () => {
        const link = `${window.location.href}`;
        navigator.clipboard.writeText(link);
        toast.success('Room link copied to clipboard');
    };

    return (
        <div className='w-full min-h-[calc(100vh-80px)] flex flex-col gap-4 md:gap-8 lg:gap-16'>
            <div className="flex-1 flex flex-col gap-10 bg-gray-800 p-4 lg:p-8 rounded-tl-2xl rounded-tr-2xl overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <h2 className='text-lg md:text-xl font-bold text-wrap' >{room?.topic}</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={handleCopyRoomLink} className='bg-blue-500 hover:bg-blue-600 outline-none flex gap-2 items-center py-2 px-4 rounded-[20px] text-white transition-all duration-300 ease-in-out active:scale-95' >
                            <Copy />
                            <span className='font-bold' >Copy link</span>
                        </button>
                        <button onClick={handleLeaveRoom} className='bg-rose-500 hover:bg-red-600 outline-none flex gap-2 items-center py-2 px-4 rounded-[20px] text-white transition-all duration-300 ease-in-out active:scale-95' >
                            {loading ? <Loader2 className='animate-spin' /> : room?.ownerId === user?.id ? <Trash /> : <Hand />}
                            <span className='font-bold' >
                                {room?.ownerId === user?.id ? 'Delete room' : 'Leave room'}
                            </span>
                        </button>
                    </div>
                </div>
                <div className="flex justify-center md:justify-start flex-wrap gap-8">
                    {clients?.map((client: any) => (
                        <div className="flex flex-col items-center justify-center gap-1" key={client?.id}>
                            <div className='relative bg-pink-400 w-24 h-24 rounded-full'>
                                <audio
                                    ref={(instance) => provideRef(instance, client?.id)}
                                    controls
                                    autoPlay
                                    className='hidden'
                                />
                                <img
                                    src={client?.avatar ? `${baseUrl}/media/get-media/${client?.avatar}` : MonkeyImage}
                                    className='w-full border-2 border-blue-500 h-full rounded-full'
                                    alt="avatar"
                                />
                                <button className={client?.id === user?.id ? 'cursor-pointer' : 'cursor-not-allowed'} onClick={() => handleMuteClick(client?.id)} >
                                    {
                                        client?.muted ?
                                            <MicOff className='absolute bg-gray-600 text-rose-500 bottom-2 right-2 w-8 h-8 rounded-full p-1' />
                                            :
                                            <Mic className='absolute bg-gray-600 text-green-500 bottom-2 right-2 w-8 h-8 rounded-full p-1' />
                                    }
                                </button>
                            </div>
                            <h4 className='font-bold' >{client?.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Room;
