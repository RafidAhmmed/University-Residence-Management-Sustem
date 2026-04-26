import { Outlet } from 'react-router-dom';
import Navbar from '../Navigations/Navbar';
import Footer from '../Navigations/Footer';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
