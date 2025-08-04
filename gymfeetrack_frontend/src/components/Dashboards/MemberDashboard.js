// src/components/Dashboards/MemberDashboard.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const MemberDashboard = () => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMemberData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch the user's subscriptions. The backend will filter it for us.
            const subscriptionsResponse = await api.get('subscriptions/');

            // Fetch the user's payments. The backend will also filter this.
            const paymentsResponse = await api.get('payments/');

            // Assuming a user has only one active subscription for display purposes
            if (subscriptionsResponse.data.length > 0 && subscriptionsResponse.data[0].plan) {
                setSubscription(subscriptionsResponse.data[0]); // Get the first subscription
            } else {
                setSubscription(null);
            }

            setPayments(paymentsResponse.data);

        } catch (err) {
            console.error('Failed to fetch member data:', err.response ? err.response.data : err.message);
            setError('Failed to load your data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMemberData();
        }
    }, [user]);

    if (loading) {
        return <div>Loading your dashboard data...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Member Dashboard</h2>
            {user ? (
                <p style={styles.welcomeText}>Welcome, {user.username}!</p>
            ) : (
                <p style={styles.welcomeText}>Welcome!</p>
            )}

            {/* Display Subscription Status */}
            <div style={styles.card}>
                <h3 style={styles.cardHeading}>Current Subscription</h3>
                {subscription ? (
                    <div>
                        <p><strong>Plan:</strong> {subscription.plan ? subscription.plan.name : 'N/A'}</p>
                        <p><strong>Status:</strong> {subscription.status}</p>
                        <p><strong>Expires On:</strong> {subscription.end_date}</p>
                    </div>
                ) : (
                    <p>You do not have an active subscription. <Link to="/plans" style={styles.link}>Click here to view plans</Link>.</p>
                )}
            </div>

            {/* Display Payment History */}
            <div style={styles.card}>
                <h3 style={styles.cardHeading}>Payment History</h3>
                {payments.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Amount</th>
                                <th style={styles.th}>Method</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id}>
                                    <td style={styles.td}>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                    <td style={styles.td}>₹{payment.amount}</td>
                                    <td style={styles.td}>{payment.payment_method}</td>
                                    <td style={styles.td}>{payment.status}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>You have no payment history.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '10px',
    },
    welcomeText: {
        textAlign: 'center',
        fontSize: '1.2em',
        marginBottom: '20px',
        color: '#555',
    },
    card: {
        backgroundColor: '#f9f9f9',
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    cardHeading: {
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        marginBottom: '15px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    th: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #ddd',
    },
};

export default MemberDashboard;