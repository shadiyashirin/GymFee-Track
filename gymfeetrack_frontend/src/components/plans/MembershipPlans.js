// src/components/Plans/MembershipPlans.js
import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const MembershipPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAdmin } = useAuth();
    const [newPlan, setNewPlan] = useState({ name: '', price: '', duration_days: '' });
    const [formError, setFormError] = useState(null);

    const fetchPlans = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('plans/');
            setPlans(response.data);
        } catch (err) {
            console.error('Failed to fetch plans:', err);
            setError('Failed to load membership plans.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleAddPlan = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            if (!newPlan.name || !newPlan.price || !newPlan.duration_days) {
                setFormError('All fields are required.');
                return;
            }
            if (isNaN(newPlan.price) || isNaN(newPlan.duration_days)) {
                setFormError('Price and duration must be numbers.');
                return;
            }
            await api.post('plans/', newPlan);
            setNewPlan({ name: '', price: '', duration_days: '' });
            fetchPlans();
        } catch (err) {
            console.error('Failed to add plan:', err);
            setFormError('Failed to add plan. Check the data and try again.');
        }
    };

    const handleDeletePlan = async (planId) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await api.delete(`plans/${planId}/`);
                fetchPlans();
            } catch (err) {
                console.error('Failed to delete plan:', err);
                setError('Failed to delete plan. It might be in use.');
            }
        }
    };

    if (loading) {
        return <div>Loading membership plans...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Membership Plans</h2>
            <ul style={styles.planList}>
                {plans.length > 0 ? (
                    plans.map(plan => (
                        <li key={plan.id} style={styles.planItem}>
                            <div style={styles.planDetails}>
                                <h3 style={styles.planName}>{plan.name}</h3>
                                <p style={styles.planInfo}>
                                    <span style={styles.planPrice}>₹{plan.price}</span> for {plan.duration_days} days
                                </p>
                                <p style={styles.planDescription}>{plan.description}</p>
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeletePlan(plan.id)}
                                    style={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No membership plans found.</p>
                )}
            </ul>
            {isAdmin && (
                <div style={styles.adminSection}>
                    <h3 style={styles.formHeading}>Add New Plan</h3>
                    <form onSubmit={handleAddPlan} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Name:</label>
                            <input
                                type="text"
                                value={newPlan.name}
                                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Price:</label>
                            <input
                                type="text"
                                value={newPlan.price}
                                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Duration (days):</label>
                            <input
                                type="text"
                                value={newPlan.duration_days}
                                onChange={(e) => setNewPlan({ ...newPlan, duration_days: e.target.value })}
                                style={styles.input}
                            />
                        </div>
                        {formError && <p style={styles.errorText}>{formError}</p>}
                        <button type="submit" style={styles.formButton}>Add Plan</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '20px', },
    heading: { textAlign: 'center', marginBottom: '30px', },
    planList: { listStyle: 'none', padding: 0, },
    planItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', },
    planDetails: { flex: 1, },
    planName: { margin: 0, fontSize: '1.2em', },
    planInfo: { margin: '5px 0', color: '#555', },
    planPrice: { fontWeight: 'bold', color: '#007bff', },
    planDescription: { margin: '0', color: '#777', fontSize: '0.9em', },
    deleteButton: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', },
    adminSection: { marginTop: '40px', borderTop: '2px solid #007bff', paddingTop: '20px', },
    formHeading: { textAlign: 'center', marginBottom: '20px', },
    form: { display: 'flex', flexDirection: 'column', },
    formGroup: { marginBottom: '15px', },
    label: { marginBottom: '5px', fontWeight: 'bold', },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', },
    formButton: { backgroundColor: '#007bff', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginTop: '10px', },
    errorText: { color: 'red', marginBottom: '10px', textAlign: 'center', },
};

export default MembershipPlans;