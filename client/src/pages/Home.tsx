import React from 'react';
import LogoImage from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

const Home: React.FC = () => {

    const navigate = useNavigate();

    return (
        <div className="w-full min-h-[calc(100vh-80px)] flex justify-center items-center">
            <Card icon={LogoImage} title="Welcome to the Coder's House" >
                <p className='text-lg font-light leading-tight text-[#c4c5c5] mb-7 text-center' >
                    This is a website where you can learn and discuss about
                    various topics related to web development. You can find
                    various programming languages, frameworks, and tools.
                </p>
                <div className="mb-5 flex justify-center">
                    <Button onClick={() => navigate('/authenticate')} text="Let's Go" />
                </div>
            </Card>
        </div>
    );
};

export default Home;