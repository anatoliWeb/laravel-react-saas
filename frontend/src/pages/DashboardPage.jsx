import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import { fetchStats } from '../services/statsService';
import { formatDate } from '../utils/date';
import { getCache, setCache } from '../utils/cache';
import { useHeader } from '../app/HeaderContext';

/**
 * Dashboard page.
 *
 * WHY:
 * Demonstrates real API integration, cached data,
 * loading states and clean UI rendering.
 */
function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { setTitle, setIsRefreshing } = useHeader();
    const { t } = useTranslation();

    /**
     * Configure page header.
     */
    useEffect(() => {
        setTitle(t('dashboard'));
    }, [setTitle, t]);

    /**
     * Load dashboard stats.
     *
     * WHY:
     * We use stale-while-revalidate:
     * - show cached data immediately
     * - refresh data silently in the background
     */
    useEffect(() => {
        async function refreshStats() {
            try {
                setIsRefreshing(true);

                const response = await fetchStats();

                setStats(response.data);
                setCache('dashboard_stats', response.data, 60000);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setIsRefreshing(false);
            }
        }

        async function loadStats() {
            const cached = getCache('dashboard_stats');

            if (cached) {
                setStats(cached);
                setLoading(false);

                await refreshStats();
                return;
            }

            await refreshStats();
        }

        loadStats();
    }, [setIsRefreshing]);

    if (loading) {
        return <p>{t('loading_dashboard')}</p>;
    }

    if (error && !stats) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return (
        <section>
            {error && (
                <p style={{ color: 'orange' }}>
                    {t('showing_cached_data')} {error}
                </p>
            )}

            <div className="card-grid">
                <Card title={t('users')}>
                    <h3>{stats.users}</h3>
                    <p>{t('admins')}: {stats.admins}</p>
                    <p>{t('managers')}: {stats.managers}</p>
                </Card>

                <Card title={t('access_control')}>
                    <h3>{stats.roles} {t('roles')}</h3>
                    <p>{stats.permissions} {t('permissions')}</p>
                    <p>{t('users_with_direct_permissions')}: {stats.users_with_direct_permissions}</p>
                </Card>

                <Card title={t('system')}>
                    <h3>{stats.tokens} {t('tokens')}</h3>
                    <p>{t('activity_logs')}: {stats.activity_logs}</p>
                </Card>

                <Card title={t('recent_activity')}>
                    {stats.recent_activity?.length ? (
                        <ul className="activity-list">
                            {stats.recent_activity.map((item, index) => (
                                <li key={item.id || index} className="activity-item">
                                    <div className="activity-description">
                                        {item.description || t('activity_event')}
                                    </div>

                                    <div className="activity-meta">
                                        <span className="activity-user">
                                            {item.user?.name || t('system_user')}
                                        </span>

                                        <span className="activity-time">
                                            {formatDate(item.created_at)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>{t('no_recent_activity')}</p>
                    )}
                </Card>
            </div>
        </section>
    );
}

export default DashboardPage;
