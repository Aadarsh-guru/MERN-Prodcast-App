import React from 'react';
import { Room } from '../../types';
import MonkeyAvatar from '../../assets/monkey-avatar.png';
import { User } from 'lucide-react';
import { baseUrl } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface RoomCardProps {
    room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/room/${room._id}`)
    };

    return (
        <div onClick={handleClick} className="h-48 bg-gradient-to-br from-[#1d1d1d] to-[#2c2c2c] p-5 flex flex-col rounded-xl transition-transform cursor-pointer lg:hover:scale-105 overflow-hidden" >
            <h3 className={`text-white font-bold text-lg truncate`}>
                {room?.topic}
            </h3>
            <div className="flex-1 flex items-center justify-center gap-4">
                <div className="w-1/2 h-full flex flex-col justify-around items-center">
                    <img
                        className={`w-20 h-20 rounded-full object-cover border-2 border-green-500`}
                        src={room.speakers[0]?.avatar ? `${baseUrl}/media/get-media/${room.speakers[0]?.avatar}` : MonkeyAvatar}
                        alt={`Speaker`}
                    />
                    <span className="text-lg font-bold truncate text-gray-300">{room.speakers[0]?.name}</span>
                </div>
                <div className="w-1/2 h-full flex flex-col justify-around items-center">
                    <User size={80} className="text-green-700" />
                    <span className="text-lg font-bold truncate text-gray-300">{room.speakers?.length} People</span>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
