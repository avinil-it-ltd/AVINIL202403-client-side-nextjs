'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './css/dashboard.css';

const HeadlineDashboard = () => {
    const [headlines, setHeadlines] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editHeadline, setEditHeadline] = useState(null);
    const [newHeadline, setNewHeadline] = useState({
        title: '',
        content: '',
        type: '',
        startDate: '',
        endDate: '',
        isActive: false,
    });
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        fetchHeadlines();
    }, []);

    const fetchHeadlines = async () => {
        const res = await axios.get('https://3pcommunicationsserver.vercel.app/api/headlines/active'); // Replace with your backend API
        setHeadlines(res.data);
        setLoading(false);
    };

    const handleShowModal = (headline = null) => {
        setEditHeadline(headline);
        setNewHeadline(headline ? headline : {
            title: '',
            content: '',
            type: '',
            startDate: '',
            endDate: '',
            isActive: false,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (editHeadline) {
            await axios.put(`https://3pcommunicationsserver.vercel.app/api/headlines/${editHeadline._id}`, newHeadline); // Update headline
        } else {
            await axios.post('https://3pcommunicationsserver.vercel.app/api/headlines', newHeadline); // Create new headline
        }
        fetchHeadlines();
        setShowModal(false);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this headline?');
        if (confirmed) {
            await axios.delete(`https://3pcommunicationsserver.vercel.app/api/headlines/${id}`);
            fetchHeadlines();
        }
    };

    // Custom Loader Component
    const Loader = () => (
        <div className="loader-container text-center mt-5">
            <div className="custom-loader"></div>
        </div>
    );

    if (loading) {
        return <Loader />;
    }

    return (
        <div className='card shadow-lg p-4 m-3 '>
            <h2 className='text-center my-3' style={{ fontFamily: "Times New Roman" }}>Headline Management</h2>

            <div className="text-end">
                <Button variant='' onClick={() => handleShowModal()} className="mb-3 dashboard_all_button px-5">
                    Add New Headline
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {headlines.map((headline, index) => (
                        <tr key={headline._id}>
                            <td>{index + 1}</td>
                            <td>{headline.title}</td>
                            <td>{headline.content}</td>
                            <td>{new Date(headline.startDate).toLocaleDateString()}</td>
                            <td>{new Date(headline.endDate).toLocaleDateString()}</td>
                            <td>{headline.isActive ? 'Active' : 'Inactive'}</td>
                            <td className='d-flex align-item-center justify-content-center'>
                                <Button variant="warning" onClick={() => handleShowModal(headline)} className="me-2 btn-sm">
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" className='btn-sm' onClick={() => handleDelete(headline._id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Adding/Editing Headline */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editHeadline ? 'Edit Headline' : 'Add New Headline'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newHeadline.title}
                                onChange={(e) => setNewHeadline({ ...newHeadline, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContent" className="mt-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newHeadline.content}
                                onChange={(e) => setNewHeadline({ ...newHeadline, content: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formType" className="mt-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={newHeadline.type}
                                onChange={(e) => setNewHeadline({ ...newHeadline, type: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                <option value="offer">Offer</option>
                                <option value="news">News</option>
                                <option value="announcement">Announcement</option>
                                <option value="other">Other</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formStartDate" className="mt-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newHeadline.startDate}
                                onChange={(e) => setNewHeadline({ ...newHeadline, startDate: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate" className="mt-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newHeadline.endDate}
                                onChange={(e) => setNewHeadline({ ...newHeadline, endDate: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formIsActive" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="Is Active"
                                checked={newHeadline.isActive}
                                onChange={(e) => setNewHeadline({ ...newHeadline, isActive: e.target.checked })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>{editHeadline ? 'Save Changes' : 'Add Headline'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HeadlineDashboard;

