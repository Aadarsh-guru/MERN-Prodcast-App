import React from 'react';
import EmailImage from '../../assets/email-emoji.png';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setOtp } from '../../store/slices/authSlice';
import { sendOtp } from '../../services/auth.service';
import { useDispatch } from 'react-redux';

interface StepEmailProps {
    onNext: () => void;
};

const StepEmail: React.FC<StepEmailProps> = ({
    onNext
}) => {

    const [email, setEmail] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (!email) {
                return toast.error('Please enter your email.');
            }
            const { data } = await sendOtp({ email });
            if (data?.success) {
                dispatch(setOtp({ hash: data?.hash, email: data?.email }));
                setEmail('');
                toast.success(data?.message);
                return onNext();
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
        <div className="w-full flex flex-col items-center justify-center">
            <Card title='Enter your email address' icon={EmailImage} >
                <input
                    type="email"
                    value={email}
                    placeholder='Enter email address'
                    className='w-full md:w-1/2 px-4 py-3 rounded-lg border-none outline-none bg-[#323232]'
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex flex-col items-center gap-4 justify-center">
                    <div className="mt-8">
                        <Button isLoading={loading} text='Next' onClick={handleSubmit} />
                    </div>
                    <p className='text-sm text-gray-600 text-center' >
                        By entering your email address you agree to our <Link to="#" className='text-blue-500 hover:underline'>Terms of Service</Link> and <Link to="#" className='text-blue-500 hover:underline'>Privacy Policy</Link>.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default StepEmail;