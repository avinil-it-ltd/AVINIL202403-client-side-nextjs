'use client';

// src/components/UpdateCredentials.js
import React, { useState } from 'react';

const UpdateCredentials = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdateCredentials = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/update-credentials', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use the stored token
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setMessage('Credentials updated successfully!');
            setError('');
        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleUpdateCredentials}>
            <h2>Update Credentials</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">Update Credentials</button>
        </form>
    );
};

export default UpdateCredentials;

