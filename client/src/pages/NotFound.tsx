import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/shared/Card';

const NotFound: React.FC = () => {
    return (
        <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
            <Card>
                <h1 className="text-6xl font-bold text-gray-600">404</h1>
                <p className="text-2xl text-gray-600 mb-4">Page Not Found</p>
                <p className="text-gray-500 text-center">
                    The page you are looking for might be under construction or does not exist.
                </p>
                <div className="mt-8">
                    <Link
                        to="/"
                        className="text-blue-500 hover:underline transition duration-300"
                    >
                        Go to Home
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default NotFound;
