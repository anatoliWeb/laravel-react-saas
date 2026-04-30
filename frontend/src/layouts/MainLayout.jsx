import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Header />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
