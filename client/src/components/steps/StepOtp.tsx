import React from 'react';
import Card from '../shared/Card';
import LockIcon from '../../assets/lock-emoji.png';
import Button from '../shared/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { verifyOtp } from '../../services/auth.service';
import { setAuth } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';

const StepOtp: React.FC = () => {

    const [otp, setOtp] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const { hash, email } = useSelector((state: RootState) => state.auth.otp)
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (!otp) {
                return toast.error('Please enter OTP.');
            }
            if (otp.length < 4) {
                return toast.error('Please enter a valid OTP.');
            };
            const { data } = await verifyOtp({ hash, otp, email });
            if (data?.success) {
                toast.success(data?.message);
                dispatch(setAuth(data));
                setOtp('');
                return;
            } else {
                return toast.error(data?.message || 'Something went wrong');
            }
        } catch (error: any) {
            console.log(error);
            return toast.error(error.response.data.message || error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        };
    };

    return (
        <div className="flex items-center justify-center">
            <Card
                title='Enter the OTP.'
                icon={LockIcon}
            >
                <input
                    type="number"
                    value={otp}
                    placeholder='Enter the OTP.'
                    className='w-full md:w-1/2 px-4 py-3 rounded-lg border-none outline-none bg-[#323232]'
                    onChange={(e) => setOtp(e.target.value)}
                />
                <div className="mt-5">
                    <Button isLoading={loading} text='Next' onClick={handleSubmit} />
                </div>
                <p className='text-sm text-gray-600 text-center mt-5' >
                    By entering the OTP you agree to our <Link to="#" className='text-blue-500 hover:underline'>Terms of Service</Link> and <Link to="#" className='text-blue-500 hover:underline'>Privacy Policy</Link>.
                </p>
            </Card>
        </div>
    );
};

export default StepOtp;