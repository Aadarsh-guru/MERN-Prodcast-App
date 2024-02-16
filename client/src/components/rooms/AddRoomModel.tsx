import React from 'react';
import Model from '../shared/Model';
import { Globe, Loader2, Lock, PartyPopper } from 'lucide-react';
import toast from 'react-hot-toast';
import { createRoom } from '../../services/room.service';
import { useNavigate } from 'react-router-dom';

interface AddRoomModelProps {
    onClose: () => void;
    isOpen: boolean;
};

const AddRoomModel: React.FC<AddRoomModelProps> = ({
    isOpen,
    onClose
}) => {

    const navigate = useNavigate();
    const [roomType, setRoomType] = React.useState<'open' | 'private'>('open');
    const [topic, setTopic] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await createRoom({ roomType, topic });
            if (data?.success) {
                setRoomType('open');
                setTopic('');
                onClose();
                toast.success(data.message);
                return navigate(`/room/${data.room._id}`);
            };
        } catch (error: any) {
            console.log(error);
            return toast.error(error.response.data.message || error.message || 'something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Model isOpen={isOpen} onClose={onClose} >
            <form onSubmit={handleSubmit} className="py-4 md:py-1">
                <div className="flex flex-col gap-2 justify-center items-center">
                    <h3 className="text-xl py-1 md:text-2xl text-center">Enter the topic to be disscussed.</h3>
                    <input
                        type="text"
                        value={topic}
                        required
                        onChange={(e) => setTopic(e.target.value)}
                        className='w-full px-4 py-2 rounded-lg border-none outline-none bg-gray-800'
                        placeholder='Enter the topic here..'
                    />
                    <h2 className='text-center text-gray-400 py-1 text-xl' >Room Types</h2>
                    <div className="w-full flex gap-4 flex-wrap items-center justify-center">
                        <div onClick={() => setRoomType('open')} className={`py-2 px-4 md:py-4 md:px-8 rounded-xl cursor-pointer transition-all hover:bg-gray-600 flex flex-col justify-center items-center gap-1 ${roomType === 'open' ? 'bg-gray-600' : ''}`}>
                            <Globe size={48} />
                            <span className='' >Open</span>
                        </div>
                        <div onClick={() => setRoomType('private')} className={`py-2 px-4 md:py-4 md:px-8 rounded-xl cursor-pointer transition-all hover:bg-gray-600 flex flex-col justify-center items-center gap-1 ${roomType === 'private' ? 'bg-gray-600' : ''}`}>
                            <Lock size={48} className='' />
                            <span className='' >Private</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center pt-4 items-center gap-2">
                    <h2 className='text-sm text-gray-200'>Start a room open to everyone.</h2>
                    <button disabled={loading} type='submit' className='px-4 py-2 flex gap-2 justify-center items-center bg-green-600 font-bold rounded-full transition-all hover:bg-green-700 active:scale-95 disabled:bg-green-700 disabled:cursor-not-allowed disabled:scale-100 text-white'>
                        {
                            loading ?
                                <Loader2 className='animate-spin' />
                                :
                                <PartyPopper />
                        }
                        Create room
                    </button>
                </div>
            </form>
        </Model>
    );
};

export default AddRoomModel;