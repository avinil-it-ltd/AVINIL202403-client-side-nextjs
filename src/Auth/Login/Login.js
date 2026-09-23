'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Footer from '../core/Footer';
// import TopMenu from '../core/TopMenu';
import backgroundImage from '../../assets/images/loginbackground/loginbackground.jpg'
import { useAuth } from '../../context/AuthContext'; // Import your Auth context
import TopMenu from '../../core/TopMenu';
import Footer from '../../core/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure login function from Auth context

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        try {
            // Use fetch to send login request to your backend
            const response = await fetch('https://3pcommunicationsserver.vercel.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // If successful, login and navigate to dashboard
            login(data.user, data.token); // Pass user and token to context
            localStorage.setItem('isLoggedIn', true); // Optional: set login state in localStorage
            navigate('/dashboard'); // Redirect to the dashboard
        } catch (error) {
            setErrorMessage(error.message); // Set error message from backend response
        }
    };

    return (
        <div>
            <div
                className="login-container"
                style={{
                    backgroundImage: `url(${backgroundImage?.src || backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: '50px',
                    paddingRight: '50px',
                    paddingLeft: '50px',
                    boxSizing: 'border-box',
                }}
            >
                <div><TopMenu /></div>
                <div
                    className="login-form shadow-lg"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '100%',
                    }}
                >
                    <h2 className="mb-4 h1">Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        {errorMessage && ( // Conditionally render the error message
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder='Email'
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder='Password'
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn dashboard_all_button text-white w-100">Login</button>
                    </form>
                </div>
            </div>
            <div id="contact"><Footer /></div>
        </div>
    );
};

export default Login;
