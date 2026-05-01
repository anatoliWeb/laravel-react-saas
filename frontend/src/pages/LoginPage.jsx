import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage component
 *
 * Handles user authentication:
 * - collects credentials
 * - sends login request
 * - stores token (handled in service)
 * - redirects to dashboard
 */
function LoginPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Form state
    const [email, setEmail] = useState('admin@test.com');
    const [password, setPassword] = useState('password');

    // UI state
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    /**
     * Handle form submit
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // reset UI state
        setError(null);
        setLoading(true);

        try {
            await login(email, password);

            // redirect to dashboard after successful login
            navigate('/');
        } catch (err) {
            // display error message from API
            setError(err.message || t('login_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>{t('login')}</h2>

                {/* Error message */}
                {error && <div className="auth-error">{error}</div>}

                {/* Email */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email')}
                    required
                />

                {/* Password */}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password')}
                    required
                />

                {/* Submit */}
                <button type="submit" disabled={loading}>
                    {loading ? t('signing_in') : t('login')}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
