import React from 'react';
import MonkeyIcon from '../../assets/monkey-emoji.png';
import MonkeyImage from '../../assets/monkey-avatar.png';
import Button from '../shared/Button';
import Card from '../shared/Card';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { activateAccount } from '../../services/auth.service';
import { setAuth } from '../../store/slices/authSlice';

const StepAvatar: React.FC = () => {

    const dispatch = useDispatch();
    const { name } = useSelector((state: RootState) => state.activate);
    const [profile, setProfile] = React.useState<File | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        if (profile) {
            formData.append('profile', profile);
        }
        setLoading(true);
        try {
            if (profile?.size! > 1000000) {
                return toast.error('Image size must be less than 1MB');
            }
            const { data } = await activateAccount(formData);
            if (data?.success) {
                dispatch(setAuth(data));
            } else {
                return toast.error(data?.message || 'Something went wrong.');
            }
        } catch (error: any) {
            console.log(error);
            return toast.error(error.response.data.message || error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card
            title={`Hey! ${name}`}
            icon={MonkeyIcon}
        >
            <p className='text-[#c4c5c5] text-center mb-5'>How's this photo?</p>
            <div className="w-28 h-28 rounded-full border-4 border-[#0077ff] flex items-center justify-center mb-5 overflow-hidden">
                <img className='h-[90%] w-[90%] object-cover rounded-full' src={profile ? URL.createObjectURL(profile) : MonkeyImage} alt="avatar" />
            </div>
            <div className="">
                <input id='profile' type="file" accept='image/*' className='hidden' onChange={(e) => setProfile(e.target.files![0])} />
                <label className='text-blue-500 hover:text-blue-600 cursor-pointer' htmlFor="profile">
                    Choose a diffrent avatar
                </label>
            </div>
            <div className="mt-5">
                <Button isLoading={loading} text='Next' onClick={handleSubmit} />
            </div>
        </Card>
    );
};

export default StepAvatar;