import {
    Route,
    Routes,
    BrowserRouter,
    Navigate
} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import { isAuthenticated } from '../services/authService';

/**
 * Protect routes that require authentication
 */
function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="users" element={<UsersPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;