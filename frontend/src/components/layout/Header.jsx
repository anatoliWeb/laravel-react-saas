import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../../app/HeaderContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

/**
 * Header component.
 *
 * Displays global app info, current page title and user actions.
 */
function Header() {
    const navigate = useNavigate();
    const { title, isRefreshing } = useHeader();
    const { t } = useTranslation();

    /**
     * Handle user logout.
     *
     * - clears token from storage
     * - redirects to login page
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">
                    {title || t('dashboard')}
                </h1>

                <p className="header-subtitle">
                    {t('app_subtitle')}
                </p>
            </div>

            <div className="page-header">
                <span
                    className={`refresh-indicator ${
                        isRefreshing ? 'visible' : ''
                    }`}
                >
                  {t('updating')}
                </span>
            </div>

            <div className="header-right">
                <LanguageSwitcher />
                <button type="button" className="btn-logout" onClick={handleLogout}>
                    {t('logout')}
                </button>
            </div>
        </header>
    );
}

export default Header;
