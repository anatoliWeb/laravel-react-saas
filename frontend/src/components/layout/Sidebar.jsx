import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">SaaS Dashboard</div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
          Dashboard
        </NavLink>

        <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
          Users
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
