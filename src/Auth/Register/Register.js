'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Footer from '../core/Footer';
// import TopMenu from '../core/TopMenu';
import backgroundImage from '../../assets/images/loginbackground/loginbackground.jpg';
import TopMenu from '../../core/TopMenu';
import Footer from '../../core/Footer';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        try {
            // Use fetch to send registration request to your backend
            const response = await fetch('https://3pcommunicationsserver.vercel.app/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, phone, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // If successful, redirect to login or dashboard
            navigate('/login'); // Redirect to login after successful registration
        } catch (error) {
            setErrorMessage(error.message); // Set error message from backend response
        }
    };

    return (
        <div>
            <div
                className="register-container"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
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
                    className="register-form shadow-lg"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '100%',
                    }}
                >
                    <h2 className="mb-4 h1">User Registration</h2>
                    <form onSubmit={handleRegister}>
                        {errorMessage && ( // Conditionally render the error message
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Name'
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Phone'
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role</label>
                            <select
                                className="form-select"
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <button type="submit" className="btn dashboard_all_button text-white w-100">Register</button>
                    </form>
                </div>
            </div>
            <div id="contact"><Footer /></div>
        </div>
    );
};

export default Register;
