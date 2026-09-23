'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './css/dashboard.css';

const FAQDashboard = () => {
    const [faqs, setFaqs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editFaq, setEditFaq] = useState(null);
    const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        const res = await axios.get('https://3pcommunicationsserver.vercel.app/api/faqs'); // Replace with your backend API
        setFaqs(res.data);
        setLoading(false);
    };

    const handleShowModal = (faq = null) => {
        setEditFaq(faq);
        setNewFaq(faq ? faq : { question: '', answer: '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (editFaq) {
            await axios.put(`https://3pcommunicationsserver.vercel.app/api/faqs/${editFaq._id}`, newFaq); // Update FAQ
        } else {
            await axios.post('https://3pcommunicationsserver.vercel.app/api/faqs', newFaq); // Create new FAQ
        }
        fetchFAQs();
        setShowModal(false);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this FAQ?');
        if (confirmed) {
            await axios.delete(`https://3pcommunicationsserver.vercel.app/api/faqs/${id}`);
            fetchFAQs();
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
            <h2 className='text-center my-3 fw-bold'>FAQ Management</h2>

            <div className="text-end">
                <Button variant='' onClick={() => handleShowModal()} className="mb-3 dashboard_all_button px-5">
                    Add New FAQ
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {faqs.map((faq, index) => (
                        <tr key={faq._id}>
                            <td>{index + 1}</td>
                            <td>{faq.question}</td>
                            <td>{faq.answer}</td>
                            <td className='d-flex align-item-center justify-content-center'>
                                <Button variant="warning" onClick={() => handleShowModal(faq)} className="me-2 btn-sm">
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" className='btn-sm' onClick={() => handleDelete(faq._id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Adding/Editing FAQ */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editFaq ? 'Edit FAQ' : 'Add New FAQ'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formQuestion">
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                                type="text"
                                value={newFaq.question}
                                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAnswer" className="mt-3">
                            <Form.Label>Answer</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newFaq.answer}
                                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>{editFaq ? 'Save Changes' : 'Add FAQ'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FAQDashboard;

