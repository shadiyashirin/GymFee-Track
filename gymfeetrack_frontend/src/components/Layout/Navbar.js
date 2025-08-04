// src/components/Layout/Navbar.js
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Access auth context

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth(); // Get auth state and logout function

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.logo}>GymFeeTrack</Link>
            <div style={styles.navLinks}>
                {isAuthenticated ? (
                    <>
                        <Link to="/plans" style={styles.navLink}>Plans</Link>
                        {user && <span style={styles.welcomeText}>Welcome, {user.username}!</span>}
                        <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                        {isAdmin && (
                            <Link to="/admin" style={styles.navLink}>Admin Panel</Link>
                        )}
                        <button onClick={logout} style={styles.logoutButton}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/plans" style={styles.navLink}>Plans</Link>
                        <Link to="/login" style={styles.navLink}>Login</Link>
                        <Link to="/register" style={styles.navLink}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

// Basic inline styles for demonstration. You'd typically use a CSS file.
const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: 'white',
    },
    logo: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        marginLeft: '20px',
        fontSize: '16px',
        transition: 'color 0.3s ease',
    },
    navLinkHover: { // Not directly used in inline style but good for CSS
        color: '#ddd',
    },
    welcomeText: {
        marginLeft: '20px',
        marginRight: '20px', // ✅ add this
        fontSize: '16px',
        color: '#eee',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '20px',
        fontSize: '16px',
    },
};


export default Navbar;