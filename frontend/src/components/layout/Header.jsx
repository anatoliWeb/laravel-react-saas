import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * Header component
 *
 * Displays page title and global actions (logout).
 */
function Header() {
    const navigate = useNavigate();

    /**
     * Handle user logout
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
                <h1 className="header-title">Admin Frontend</h1>
                <p className="header-subtitle">
                    React foundation for Laravel API integration
                </p>
            </div>

            <div className="header-right">
                <button className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Header;