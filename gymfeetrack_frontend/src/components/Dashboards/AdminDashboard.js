// src/components/Dashboards/AdminDashboard.js
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth(); // Get user info from context

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {user ? (
                <p>Welcome, Admin {user.username}! Manage members, plans, and payments here.</p>
            ) : (
                <p>Loading admin data...</p>
            )}
            <p>
                <Link to="/plans" style={{ color: '#007bff' }}>
                    Go to Membership Plan Management
                </Link>
            </p>
            {/* Future: List all members, view member details, add/edit plans, record payments */}
            <p>This is where you'll list all gym members, manage their subscriptions and payments, and handle membership plans.</p>
        </div>
    );
};

export default AdminDashboard;