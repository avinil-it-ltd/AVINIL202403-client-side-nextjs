'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './css/dashboard.css';

const FAQDashboard = () => {
    const [faqs, setFaqs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editFaq, setEditFaq] = useState(null);
    const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const res = await axios.get('https://3pcommunicationsserver.vercel.app/api/faqs');
            setFaqs(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Error fetching FAQs:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (faq = null) => {
        setEditFaq(faq);
        setNewFaq(faq ? faq : { question: '', answer: '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (editFaq) {
                await axios.put(`https://3pcommunicationsserver.vercel.app/api/faqs/${editFaq._id}`, newFaq);
            } else {
                await axios.post('https://3pcommunicationsserver.vercel.app/api/faqs', newFaq);
            }
            fetchFAQs();
            setShowModal(false);
            Swal.fire({
                icon: 'success',
                title: editFaq ? 'FAQ Updated' : 'FAQ Added',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (e) {
            console.error('Error saving FAQ:', e);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save FAQ' });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete FAQ?',
            text: 'Are you sure you want to delete this FAQ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            customClass: { popup: 'rounded-4' },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://3pcommunicationsserver.vercel.app/api/faqs/${id}`);
                    setFaqs(prev => prev.filter(f => f._id !== id));
                    setSelectedIds(prev => prev.filter(itemId => itemId !== id));
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted',
                        text: 'FAQ removed successfully.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (e) {
                    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete FAQ.' });
                }
            }
        });
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const isAllSelected = faqs.length > 0 && selectedIds.length === faqs.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(faqs.map(f => f._id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        Swal.fire({
            title: `Delete ${selectedIds.length} FAQs?`,
            text: 'Are you sure you want to permanently delete all selected FAQ entries?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Yes, delete ${selectedIds.length} FAQs`,
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            customClass: { popup: 'rounded-4' },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deleting...',
                    text: `Deleting ${selectedIds.length} FAQs...`,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                try {
                    await Promise.allSettled(
                        selectedIds.map(id =>
                            axios.delete(`https://3pcommunicationsserver.vercel.app/api/faqs/${id}`)
                        )
                    );
                    setFaqs(prev => prev.filter(f => !selectedIds.includes(f._id)));
                    setSelectedIds([]);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Selected FAQs have been removed.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (err) {
                    console.error('Bulk delete error:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete some FAQs.',
                    });
                }
            }
        });
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

            {/* Bulk Action Toolbar */}
            {selectedIds.length > 0 && (
                <div className="alert alert-primary d-flex justify-content-between align-items-center mb-3 shadow-sm rounded-3 py-2 px-3 border-0 bg-primary text-white">
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-primary rounded-pill px-2 py-1 fw-bold">
                            {selectedIds.length}
                        </span>
                        <span className="fw-semibold">
                            {selectedIds.length} {selectedIds.length === 1 ? 'FAQ' : 'FAQs'} selected
                        </span>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1 rounded-2 shadow-sm"
                            onClick={handleBulkDelete}
                        >
                            <FaTrash /> Delete Selected ({selectedIds.length})
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-light rounded-2"
                            onClick={() => setSelectedIds([])}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            <Table striped bordered hover responsive className="align-middle">
                <thead>
                    <tr>
                        <th style={{ width: '4%' }} className="text-center">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={isAllSelected}
                                ref={(el) => {
                                    if (el) el.indeterminate = selectedIds.length > 0 && !isAllSelected;
                                }}
                                onChange={handleSelectAll}
                                title="Select all FAQs"
                            />
                        </th>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '35%' }}>Question</th>
                        <th style={{ width: '44%' }}>Answer</th>
                        <th style={{ width: '12%' }} className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {faqs.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-4 text-muted">
                                No FAQs found.
                            </td>
                        </tr>
                    ) : (
                        faqs.map((faq, index) => {
                            const isSelected = selectedIds.includes(faq._id);
                            return (
                            <tr key={faq._id} className={isSelected ? 'table-active' : ''}>
                                <td className="text-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={isSelected}
                                        onChange={() => handleToggleSelect(faq._id)}
                                    />
                                </td>
                                <td>{index + 1}</td>
                                <td className="fw-semibold">{faq.question}</td>
                                <td>{faq.answer}</td>
                                <td className="text-center">
                                    <div className="d-inline-flex gap-2">
                                        <Button variant="outline-warning" onClick={() => handleShowModal(faq)} className="btn-sm rounded-2">
                                            <FaEdit />
                                        </Button>
                                        <Button variant="outline-danger" className="btn-sm rounded-2" onClick={() => handleDelete(faq._id)}>
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            );
                        })
                    )}
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

