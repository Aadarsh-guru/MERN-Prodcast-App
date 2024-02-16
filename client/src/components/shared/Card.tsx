import React from 'react';

interface CardProps {
    children?: React.ReactNode;
    icon?: string;
    title?: string
};

const Card: React.FC<CardProps> = ({
    children, icon, title
}) => {
    return (
        <div className="md:w-[500px] max-w-[90%] min-h-[300px] bg-[#1D1D1D] rounded-2xl p-8 flex flex-col justify-center items-center">
            <div className="flex items-center justify-center gap-2 mb-7">
                {icon && <img src={icon} className='h-6' alt="emoji" />}
                <h1 className='text-2xl' >{title}</h1>
            </div>
            {children}
        </div>
    );
};

export default Card;