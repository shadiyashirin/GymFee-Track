// src/components/Auth/Register.js
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState(''); // For password confirmation
    const [error, setError] = useState(null);
    const { register, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== password2) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await register(username, email, password);
            // AuthContext already handles navigation to /login on success
        } catch (err) {
            // Handle specific errors from Django (e.g., username already exists)
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.username) setError(`Username: ${data.username[0]}`);
                else if (data.email) setError(`Email: ${data.email[0]}`);
                else if (data.password) setError(`Password: ${data.password[0]}`);
                else if (data.non_field_errors) setError(data.non_field_errors[0]);
                else setError('Registration failed. Please try again.');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Register</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="reg-username" style={styles.label}>Username:</label>
                    <input
                        type="text"
                        id="reg-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="reg-email" style={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="reg-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="reg-password" style={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="reg-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="reg-password2" style={styles.label}>Confirm Password:</label>
                    <input
                        type="password"
                        id="reg-password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                {error && <p style={styles.errorText}>{error}</p>}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

// Use the same styles as Login.js or import them from a shared CSS file
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#555',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    button: {
        backgroundColor: '#28a745', // Green for register
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
    },
    buttonHover: {
        backgroundColor: '#218838',
    },
    errorText: {
        color: 'red',
        marginBottom: '10px',
        textAlign: 'center',
    },
};

export default Register;