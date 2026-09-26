'use client';

// src/components/TestimonialDashboard.js

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './css/dashboard.css';

const TestimonialDashboard = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editTestimonial, setEditTestimonial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [newTestimonial, setNewTestimonial] = useState({
        name: '',
        content: '',
        designation: '',
        imageUrl: ''
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        const res = await axios.get('https://3pcommunicationsserver.vercel.app/api/testimonials');
        setTestimonials(res.data);
        setLoading(false);
    };

    const handleShowModal = (testimonial = null) => {
        setEditTestimonial(testimonial);
        setNewTestimonial(testimonial ? testimonial : { name: '', content: '', designation: '', imageUrl: '' });
        setImagePreview(testimonial ? testimonial.imageUrl : null);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (newTestimonial.imageUrl && typeof newTestimonial.imageUrl !== 'string') {
                const uploadedImageUrl = await uploadImageToCloudinary(newTestimonial.imageUrl);
                newTestimonial.imageUrl = uploadedImageUrl;
            }

            if (editTestimonial) {
                await axios.put(`https://3pcommunicationsserver.vercel.app/api/testimonials/${editTestimonial._id}`, newTestimonial);
            } else {
                await axios.post('https://3pcommunicationsserver.vercel.app/api/testimonials', newTestimonial);
            }

            fetchTestimonials();
            setShowModal(false);
            setImagePreview(null);
        } catch (error) {
            console.error("Error saving testimonial:", error);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Testimonial?',
            text: 'Are you sure you want to delete this testimonial?',
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
                    await axios.delete(`https://3pcommunicationsserver.vercel.app/api/testimonials/${id}`);
                    setTestimonials(prev => prev.filter(t => t._id !== id));
                    setSelectedIds(prev => prev.filter(itemId => itemId !== id));
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Testimonial removed.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (e) {
                    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete testimonial.' });
                }
            }
        });
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const isAllSelected =
        testimonials.length > 0 && selectedIds.length === testimonials.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(testimonials.map(t => t._id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        Swal.fire({
            title: `Delete ${selectedIds.length} testimonials?`,
            text: 'Are you sure you want to permanently delete all selected testimonials?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Yes, delete ${selectedIds.length} testimonials`,
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            customClass: { popup: 'rounded-4' },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deleting...',
                    text: `Deleting ${selectedIds.length} testimonials...`,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                try {
                    await Promise.allSettled(
                        selectedIds.map(id =>
                            axios.delete(`https://3pcommunicationsserver.vercel.app/api/testimonials/${id}`)
                        )
                    );
                    setTestimonials(prev => prev.filter(t => !selectedIds.includes(t._id)));
                    setSelectedIds([]);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Selected testimonials have been removed.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (err) {
                    console.error('Bulk delete error:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete some testimonials.',
                    });
                }
            }
        });
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "3pcommunications");

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/avinilit/image/upload`,
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            throw error;
        }
    };

    // const uploadImageToCloudinary = async (file) => {
    //     const formData = new FormData();
    //     formData.append("file", file);
    //     formData.append("upload_preset", "3pcommunications"); // Replace with your Cloudinary upload preset
      
    //     try {
    //       const response = await axios.post(
    //         `https://api.cloudinary.com/v1_1/avinilit/image/upload?transformation=h_1080,c_scale,q_80`,
    //         formData
    //       );
    //       return response.data.secure_url; // Return the uploaded, resized image URL with 80% quality
    //     } catch (error) {
    //       console.error("Error uploading image to Cloudinary:", error);
    //       throw error;
    //     }
    //   };
      
    // Handle image selection and preview display
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewTestimonial({ ...newTestimonial, imageUrl: file });
        setImagePreview(URL.createObjectURL(file));
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setNewTestimonial({ ...newTestimonial, imageUrl: '' });
        setImagePreview(null);
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
        <div className='card shadow-lg m-3 p-3 '>
            <h2 className='text-center my-2 fw-bold'>Testimonial Management</h2>
            <div className='text-end'>
                <Button variant='' onClick={() => handleShowModal()} className="mb-3 dashboard_all_button">
                    Add New Testimonial
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
                            {selectedIds.length} {selectedIds.length === 1 ? 'testimonial' : 'testimonials'} selected
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
                                title="Select all testimonials"
                            />
                        </th>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '22%' }}>Name</th>
                        <th style={{ width: '45%' }}>Content</th>
                        <th style={{ width: '14%' }}>Designation</th>
                        <th style={{ width: '10%' }} className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {testimonials.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                                No testimonials found.
                            </td>
                        </tr>
                    ) : (
                        testimonials.map((testimonial, index) => {
                            const isSelected = selectedIds.includes(testimonial._id);
                            return (
                            <tr key={testimonial._id} className={isSelected ? 'table-active' : ''}>
                                <td className="text-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={isSelected}
                                        onChange={() => handleToggleSelect(testimonial._id)}
                                    />
                                </td>
                                <td>{index + 1}</td>
                                <td className="fw-semibold">{testimonial.name}</td>
                                <td>{testimonial.content}</td>
                                <td>{testimonial.designation}</td>
                                <td className="text-center">
                                    <div className="d-inline-flex gap-2">
                                        <Button variant="outline-warning" onClick={() => handleShowModal(testimonial)} className="btn-sm rounded-2">
                                            <FaEdit />
                                        </Button>
                                        <Button className="btn-sm rounded-2" variant="outline-danger" onClick={() => handleDelete(testimonial._id)}>
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

            {/* Modal for Adding/Editing Testimonial */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTestimonial.name}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContent" className="mt-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newTestimonial.content}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDesignation" className="mt-3">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTestimonial.designation}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, designation: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage" className="mt-3">
                            <Form.Label>Image </Form.Label>
                            {imagePreview ? (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <Button variant="danger" onClick={handleRemoveImage} className="remove-image-btn">
                                        <FaTrash />
                                    </Button>
                                </div>
                            ) : (
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>{editTestimonial ? 'Save Changes' : 'Add Testimonial'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TestimonialDashboard;

