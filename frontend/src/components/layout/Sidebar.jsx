import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMeta } from '../../hooks/useMeta';
import { can } from '../../utils/permissions';

function Sidebar() {
  const { t } = useTranslation();
  const { meta } = useMeta();
  const canViewUsers = can('users.view', meta);
  const canViewTokens = can('tokens.view', meta);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">{t('saas_dashboard')}</div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
          {t('dashboard')}
        </NavLink>

        {/* WHY:
            Navigation items are permission-controlled in UI to avoid exposing
            actions the current user cannot access. */}
        {canViewUsers ? (
          <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
            {t('users')}
          </NavLink>
        ) : null}

        {canViewTokens ? (
          <NavLink to="/tokens" className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
            {t('tokens')}
          </NavLink>
        ) : null}
      </nav>
    </aside>
  );
}

export default Sidebar;
