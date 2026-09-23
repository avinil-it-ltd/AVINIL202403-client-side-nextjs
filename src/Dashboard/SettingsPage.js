'use client';

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';

const SettingsPage = () => {
    // States for updating credentials
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // States for changing password
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        // Fetch current user data
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://3pcommunicationsserver.vercel.app/api/auth/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }

                // Set state with fetched user data
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user details');
            }
        };

        fetchUserData();
    }, []);

    const handleModalOpen = (type) => {
        setActionType(type);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentPassword('');
    };

    const handleConfirmAction = async () => {
        if (actionType === 'updateCredentials') {
            await handleUpdateCredentials();
        } else if (actionType === 'changePassword') {
            await handleChangePassword();
        }
        handleModalClose();
    };

    const handleUpdateCredentials = async () => {
        try {
            const response = await fetch('https://3pcommunicationsserver.vercel.app/api/auth/update-credentials', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name, email, phone, currentPassword }),
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

    const handleChangePassword = async () => {
        try {
            const response = await fetch('https://3pcommunicationsserver.vercel.app/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setPasswordMessage('Password changed successfully!');
            setPasswordError('');
            setNewPassword('');
        } catch (err) {
            setPasswordError(err.message);
            setPasswordMessage('');
        }
    };

    return (
        <Container className="settings-page mt-4">
            <h2 className="text-center mb-4">Settings</h2>

            {/* Update Credentials Form */}
            <Form onSubmit={(e) => { e.preventDefault(); handleModalOpen('updateCredentials'); }} className="mb-5">
                <h3>Update Credentials</h3>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group controlId="name" className="mt-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="email" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="phone" className="mt-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4">Update Credentials</Button>
            </Form>

            {/* Change Password Form */}
            <Form onSubmit={(e) => { e.preventDefault(); handleModalOpen('changePassword'); }} className="mb-5">
                <h3>Change Password</h3>
                {passwordMessage && <Alert variant="success">{passwordMessage}</Alert>}
                {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                <Form.Group controlId="newPassword" className="mt-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4">Change Password</Button>
            </Form>

            {/* Confirmation/Password Modal */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{actionType === 'updateCredentials' ? 'Current Password Required' : 'Confirm Action'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {actionType === 'updateCredentials' ? (
                        <Form.Group controlId="modalCurrentPassword">
                            <Form.Label>Please enter your current password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                    ) : (
                        <p>Are you sure you want to change your password?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmAction}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default SettingsPage;

