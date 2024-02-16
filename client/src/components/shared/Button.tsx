import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    isLoading,
}) => {
    return (
        <button disabled={isLoading} onClick={onClick} className={`flex justify-center items-center text-lg font-bold gap-2 border-none outline-none bg-[#0077ff] py-3 px-5 rounded-full transition-all hover:bg-blue-600 active:scale-95 disabled:bg-blue-900 disabled:scale-100 disabled:cursor-not-allowed`} >
            <span className='' >{text}</span>
            {isLoading ? (
                <Loader2 className='animate-spin' size={22} color='#fff' />
            ) : (
                <ArrowRight />
            )}
        </button>
    );
};

export default Button;