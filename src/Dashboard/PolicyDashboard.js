'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import ReactQuill from '../Components/ReactQuillWrapper';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './css/dashboard.css';

const PolicyDashboard = () => {
    const [policies, setPolicies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editPolicy, setEditPolicy] = useState(null);
    const [newPolicy, setNewPolicy] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await axios.get('https://3pcommunicationsserver.vercel.app/api/policies');
            setPolicies(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Error fetching policies:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (policy = null) => {
        setEditPolicy(policy);
        setNewPolicy(policy ? policy : { title: '', content: '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (editPolicy) {
                await axios.put(`https://3pcommunicationsserver.vercel.app/api/policies/${editPolicy._id}`, newPolicy);
            } else {
                await axios.post('https://3pcommunicationsserver.vercel.app/api/policies', newPolicy);
            }
            fetchPolicies();
            setShowModal(false);
            Swal.fire({
                icon: 'success',
                title: editPolicy ? 'Policy Updated' : 'Policy Added',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (e) {
            console.error('Error saving policy:', e);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save policy.' });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Policy?',
            text: 'Are you sure you want to delete this policy section?',
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
                    await axios.delete(`https://3pcommunicationsserver.vercel.app/api/policies/${id}`);
                    setPolicies(prev => prev.filter(p => p._id !== id));
                    setSelectedIds(prev => prev.filter(itemId => itemId !== id));
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Policy removed.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (e) {
                    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete policy.' });
                }
            }
        });
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const isAllSelected = policies.length > 0 && selectedIds.length === policies.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(policies.map(p => p._id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        Swal.fire({
            title: `Delete ${selectedIds.length} policies?`,
            text: 'Are you sure you want to permanently delete all selected policy sections?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Yes, delete ${selectedIds.length} policies`,
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            customClass: { popup: 'rounded-4' },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deleting...',
                    text: `Deleting ${selectedIds.length} policies...`,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                try {
                    await Promise.allSettled(
                        selectedIds.map(id =>
                            axios.delete(`https://3pcommunicationsserver.vercel.app/api/policies/${id}`)
                        )
                    );
                    setPolicies(prev => prev.filter(p => !selectedIds.includes(p._id)));
                    setSelectedIds([]);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Selected policies have been removed.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (err) {
                    console.error('Bulk delete error:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete some policies.',
                    });
                }
            }
        });
    };

    const Loader = () => (
        <div className="loader-container text-center mt-5">
            <div className="custom-loader"></div>
        </div>
    );

    if (loading) {
        return <Loader />;
    }

    return (
        <div className='card shadow-lg p-4 m-3'>
            <h2 className='text-center my-3 fw-bold'>Privacy Policy Management</h2>

            <div className="text-end">
                <Button variant='' onClick={() => handleShowModal()} className="mb-3 dashboard_all_button px-5">
                    Add New Policy
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
                            {selectedIds.length} {selectedIds.length === 1 ? 'policy' : 'policies'} selected
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
                                title="Select all policies"
                            />
                        </th>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '30%' }}>Title</th>
                        <th style={{ width: '49%' }}>Content</th>
                        <th style={{ width: '12%' }} className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-4 text-muted">
                                No privacy policies found.
                            </td>
                        </tr>
                    ) : (
                        policies.map((policy, index) => {
                            const isSelected = selectedIds.includes(policy._id);
                            return (
                            <tr key={policy._id} className={isSelected ? 'table-active' : ''}>
                                <td className="text-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={isSelected}
                                        onChange={() => handleToggleSelect(policy._id)}
                                    />
                                </td>
                                <td>{index + 1}</td>
                                <td className="fw-semibold">{policy.title}</td>
                                <td dangerouslySetInnerHTML={{ __html: policy.content }} />
                                <td className="text-center">
                                    <div className="d-inline-flex gap-2">
                                        <Button variant="outline-warning" onClick={() => handleShowModal(policy)} className="btn-sm rounded-2">
                                            <FaEdit />
                                        </Button>
                                        <Button variant="outline-danger" className="btn-sm rounded-2" onClick={() => handleDelete(policy._id)}>
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

            {/* Modal for Adding/Editing Policy */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editPolicy ? 'Edit Policy' : 'Add New Policy'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPolicy.title}
                                onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContent" className="mt-3">
                            <Form.Label>Content</Form.Label>
                            <ReactQuill
                                theme="snow"
                                value={newPolicy.content}
                                onChange={(content) => setNewPolicy({ ...newPolicy, content })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>{editPolicy ? 'Save Changes' : 'Add Policy'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PolicyDashboard;

