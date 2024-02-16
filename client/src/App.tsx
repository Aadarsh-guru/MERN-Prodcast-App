import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import Navigation from './components/shared/Navigation';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GuestsRoutes from './protected-routes/GuestsRoutes';
import SemiProtectedRoutes from './protected-routes/SemiProtectedRoutes';
import Activate from './pages/Activate';
import ProtectedRoutes from './protected-routes/ProtectedRoutes';
import Rooms from './pages/Rooms';
import Room from './pages/Room';
import Authenticate from './pages/Authenticate';
import { useRefreshLoading } from './hooks/useRefreshLoading';

const App: React.FC = () => {

  const loading = useRefreshLoading();

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] flex justify-center items-center">
        <Loader2 size={32} className='mb-4 animate-spin' />
      </div>
    )
  };

  return (
    <>
      <Navigation />
      <Toaster />
      <Routes>
        <Route path='/' element={<GuestsRoutes />} >
          <Route index element={<Home />} />
          <Route path='/authenticate' element={<Authenticate />} />
        </Route>
        <Route path='/activate' element={<SemiProtectedRoutes />}>
          <Route index element={<Activate />} />
        </Route>
        <Route path='/rooms' element={<ProtectedRoutes />}>
          <Route index element={<Rooms />} />
        </Route>
        <Route path='/room/:roomId' element={<ProtectedRoutes />}>
          <Route index element={<Room />} />
        </Route>
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </>
  );
};


export default App;