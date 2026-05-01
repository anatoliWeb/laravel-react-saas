import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">{t('saas_dashboard')}</div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
          {t('dashboard')}
        </NavLink>

        <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
          {t('users')}
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
