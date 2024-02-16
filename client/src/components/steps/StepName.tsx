import React from 'react';
import GoggleIcon from '../../assets/goggle-emoji.png';
import Button from '../shared/Button';
import Card from '../shared/Card';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from '../../store/slices/activateSlice';
import { RootState } from '../../store/store';

interface StepNameProps {
    onNext: () => void;
};

const StepName: React.FC<StepNameProps> = ({
    onNext
}) => {

    const dispatch = useDispatch();
    const { name } = useSelector((state: RootState) => state.activate);
    const [fullName, setFullName] = React.useState(name);

    const handleSubmit = async () => {
        if (!fullName || fullName.length < 3) {
            return toast.error('Name must be at least 3 characters');
        }
        dispatch(setName(fullName));
        return onNext();
    };


    return (
        <Card
            title="Whats's your full name?"
            icon={GoggleIcon}
        >
            <input
                type="text"
                value={fullName}
                placeholder='Enter your full name'
                className='w-full md:w-1/2 px-4 py-3 rounded-lg border-none outline-none bg-[#323232]'
                onChange={(e) => setFullName(e.target.value)}
            />
            <p className='text-sm text-gray-600 text-center mt-5' >
                People use their real name at Coder's House {': )'}.
            </p>
            <div className="mt-5">
                <Button text='Next' onClick={handleSubmit} />
            </div>
        </Card>
    );
};

export default StepName;