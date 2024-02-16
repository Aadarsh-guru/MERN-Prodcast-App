import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LogoImage from '../../assets/logo.png';
import { logoutUser } from '../../services/auth.service';
import { clearAuth } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import { baseUrl } from '../../services/api';
import MonkeyImage from '../../assets/monkey-avatar.png';
import { LogOut } from 'lucide-react';

const Navigation: React.FC = () => {

    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        try {
            if (!window.confirm('Are you sure you want to logout?')) {
                return;
            };
            const { data } = await logoutUser();
            if (data.success) {
                dispatch(clearAuth());
                return toast.success(data.message);
            } else {
                return toast.error(data.message);
            }
        } catch (error: any) {
            console.log(error);
            return toast.error(error.response.data.message || error.message || 'Something went wrong');
        }
    };

    return (
        <nav className={`container mx-auto py-5 flex justify-between`} >
            <Link className={`ml-4 md:ml-0 flex items-center gap-2 transition-colors hover:text-gray-300`} to={'/'} >
                <img
                    className='h-6 object-cover rounded-full'
                    src={LogoImage}
                    alt="logo"
                />
                <span className='text-xl font-bold' >Coder's House</span>
            </Link>
            {isAuth && (
                <div className="mr-4 md:mr-0 flex gap-4 items-center transition-colors">
                    <h3 className='text-lg font-bold hidden md:block' >{user?.name}</h3>
                    <Link to={'#'} className='text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors' >
                        <img src={user?.avatar ? `${baseUrl}/media/get-media/${user?.avatar}` : MonkeyImage} className='w-10 border-2 border-green-700 h-10 rounded-full' alt="avatar" />
                    </Link>
                    <button className='text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors' onClick={handleLogout} >
                        <LogOut className='text-rose-400 hover:text-red-500' />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navigation;