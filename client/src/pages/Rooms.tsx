import React from 'react';
import { AudioLines, Loader, Search } from 'lucide-react';
import RoomCard from '../components/rooms/RoomCard';
import AddRoomModel from '../components/rooms/AddRoomModel';
import { fetchAllRooms } from '../services/room.service';
import { Room } from '../types';
import toast from 'react-hot-toast';

const Rooms: React.FC = () => {

    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [rooms, setRooms] = React.useState<Room[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isModelOpen, setIsModelOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                const { data } = await fetchAllRooms();
                if (data?.success) {
                    setRooms(data?.rooms);
                }
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Something went wrong!');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const filteredRooms = React.useMemo(() => {
        if (!searchQuery) {
            return rooms;
        }
        return rooms.filter(room => room?.topic.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, rooms]);

    return (
        <>
            <div className="container mx-auto min-h-[calc(100vh-80px)] flex flex-col">
                {/* options box start here */}
                <div className="flex flex-col gap-3 md:gap-4 md:flex-row items-center justify-between">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                        <span className='text-xl font-bold' >All voice rooms</span>
                        <div className="flex justify-center items-center gap-1 px-2 py-1 w-[250px] sm:w-[300px]  bg-[#262626] rounded-full">
                            <Search className='cursor-pointer' size={18} />
                            <input
                                required
                                placeholder='Search rooms here..'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text"
                                className='flex-1 bg-transparent border-none outline-none px-2 py-1'
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                        <button onClick={() => setIsModelOpen(true)} className='px-4 py-2 flex gap-2 justify-center items-center bg-green-600 font-bold rounded-full transition-all hover:bg-green-700 active:scale-95 disabled:bg-green-700 disabled:cursor-not-allowed disabled:scale-100 text-white'>
                            <AudioLines />
                            Create room
                        </button>
                    </div>
                </div>
                {/* room list start here */}
                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader size={32} className='animate-spin' />
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="flex-1 flex justify-center items-center">
                        <h4 className='font-bold text-gray-400' >No Public Rooms are available.</h4>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 py-5 px-5 flex-1 overflow-y-auto">
                        {filteredRooms.map((room, index) => (
                            <RoomCard key={index} room={room} />
                        ))}
                    </div>
                )}
            </div>
            <AddRoomModel isOpen={isModelOpen} onClose={() => setIsModelOpen(false)} />
        </>
    );
};

export default Rooms;
