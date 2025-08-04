// src/App.js (FINAL CORE LOGIC VERSION)
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import MemberDashboard from './components/Dashboards/MemberDashboard';
import Navbar from './components/Layout/Navbar';
import MembershipPlans from './components/plans/MembershipPlans';


// A component that will be rendered inside the Router
const AuthWrapper = ({ children }) => {
    const navigate = useNavigate();
    return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

// The PrivateRoute component to protect our routes
const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && roles.includes('admin') && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthWrapper>
                <Navbar />
                <div style={{ padding: '20px' }}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/plans" element={<MembershipPlans />} />

                        {/* Private Routes - Now wrapped with the PrivateRoute component */}
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute roles={['member', 'admin']}>
                                    <MemberDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute roles={['admin']}>
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />

                        {/* Catch-all for unknown routes */}
                        <Route path="*" element={<div>404 - Page Not Found</div>} />
                    </Routes>
                </div>
            </AuthWrapper>
        </Router>
    );
}

export default App;