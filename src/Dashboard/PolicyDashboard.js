'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import ReactQuill from '../Components/ReactQuillWrapper';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './css/dashboard.css';

const PolicyDashboard = () => {
    const [policies, setPolicies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editPolicy, setEditPolicy] = useState(null);
    const [newPolicy, setNewPolicy] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        const res = await axios.get('https://3pcommunicationsserver.vercel.app/api/policies');
        setPolicies(res.data);
        setLoading(false);
    };

    const handleShowModal = (policy = null) => {
        setEditPolicy(policy);
        setNewPolicy(policy ? policy : { title: '', content: '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (editPolicy) {
            await axios.put(`https://3pcommunicationsserver.vercel.app/api/policies/${editPolicy._id}`, newPolicy);
        } else {
            await axios.post('https://3pcommunicationsserver.vercel.app/api/policies', newPolicy);
        }
        fetchPolicies();
        setShowModal(false);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this policy?');
        if (confirmed) {
            await axios.delete(`https://3pcommunicationsserver.vercel.app/api/policies/${id}`);
            fetchPolicies();
        }
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
            <h2 className='text-center my-3' style={{ fontFamily: "Times New Roman" }}>Privacy Policy Management</h2>

            <div className="text-end">
                <Button variant='' onClick={() => handleShowModal()} className="mb-3 dashboard_all_button px-5">
                    Add New Policy
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map((policy, index) => (
                        <tr key={policy._id}>
                            <td>{index + 1}</td>
                            <td>{policy.title}</td>
                            <td dangerouslySetInnerHTML={{ __html: policy.content }} />
                            <td className='d-flex align-items-center justify-content-center'>
                                <Button variant="warning" onClick={() => handleShowModal(policy)} className="me-2 btn-sm">
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" className='btn-sm' onClick={() => handleDelete(policy._id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
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

