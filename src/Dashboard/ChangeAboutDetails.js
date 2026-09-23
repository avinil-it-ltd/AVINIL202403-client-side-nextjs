'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import './css/dashboard.css';

const ChangeAboutDetails = () => {
    const [formData, setFormData] = useState({
        profile: {
            name: "",
            position: "",
            introduction: "",
            profilePicture: ""
        },
        centralImage: "",
        statistics: {
            projectsCompleted: 0,
            awardsReceived: 0,
            happyCustomers: 0,
            yearsInService: 0
        },
        whyChooseUs: Array.from({ length: 6 }, () => ({ title: "", description: "", imageUrl: "" }))
    });

    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/about');
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching About Us data:", error);
            }
        };
        fetchAboutData();
    }, []);

    const handleInputChange = (e, section, field) => {
        const { value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: section === 'statistics' ? parseInt(value) || 0 : value
            }
        }));
    };

    const handleWhyChooseUsChange = (index, field, value) => {
        const updatedWhyChooseUs = formData.whyChooseUs.map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item
        );
        setFormData(prevData => ({ ...prevData, whyChooseUs: updatedWhyChooseUs }));
    };

    const handleImageUpload = async (e, index, type) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const imageFormData = new FormData();
                imageFormData.append('file', file);
                imageFormData.append('upload_preset', '3pcommunications');

                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/avinilit/image/upload',
                    imageFormData
                );

                const imageUrl = response.data.secure_url;

                if (type === 'profile') {
                    setFormData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, profilePicture: imageUrl }
                    }));
                } else if (type === 'centralImage') {
                    console.log(imageUrl);

                    setFormData(prev => {
                        const updatedData = { ...prev, centralImage: imageUrl };
                        console.log("Updated central image URL:", updatedData.centralImage);
                        return updatedData;
                    });
                    console.log(formData);


                } else {
                    const updatedWhyChooseUs = [...formData.whyChooseUs];
                    updatedWhyChooseUs[index].imageUrl = imageUrl;
                    setFormData({ ...formData, whyChooseUs: updatedWhyChooseUs });
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Image uploaded successfully!',
                    text: 'Preview updated with the uploaded image.',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.error("Error uploading image:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Image upload failed',
                    text: 'Please try again later.',
                });
            }
        }
    };


    const handleDeleteImage = (index) => {
        const updatedWhyChooseUs = formData.whyChooseUs.map((item, idx) =>
            idx === index ? { ...item, imageUrl: "" } : item
        );
        setFormData(prevData => ({ ...prevData, whyChooseUs: updatedWhyChooseUs }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.whyChooseUs.length !== 6) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Why Choose Us section must have exactly 6 titles and descriptions.",
                showConfirmButton: true,
                confirmButtonColor: "#d33",
            });
            return;
        }
        setShowModal(true);
    };

    const handleConfirmUpdate = async () => {
        setShowModal(false);
        setUploading(true);
        console.log(formData);

        try {
            await axios.put('https://3pcommunicationsserver.vercel.app/api/about', formData);
            Swal.fire({
                icon: "success",
                title: "Updated successfully!",
                text: "Your changes have been saved.",
                confirmButtonColor: "#28a745",
            });
        } catch (error) {
            console.error("Error updating About Us data:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to update About Us page",
                text: error.response ? error.response.data.message : "Something went wrong!",
                confirmButtonColor: "#d33",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container card w-75 shadow-sm p-5">
            <h2 className="my-4 text-center " style={{ fontFamily: "Times New Roman" }}>Update About Us Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label className='fw-bold'>CEO Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.profile.name}
                        onChange={(e) => handleInputChange(e, 'profile', 'name')}
                    />
                </div>
                <div className="form-group mb-3">
                    <label className='fw-bold'>Position</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.profile.position}
                        onChange={(e) => handleInputChange(e, 'profile', 'position')}
                    />
                </div>
                <div className="form-group mb-3">
                    <label className='fw-bold'>Introduction</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={formData.profile.introduction}
                        onChange={(e) => handleInputChange(e, 'profile', 'introduction')}
                    />
                </div>
                <div className="form-group mb-3">
                    <label className='fw-bold'>Upload CEO Picture</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => handleImageUpload(e, null, 'profile')}
                    />
                    {formData.profile.profilePicture && (
                        <div className="mt-2" style={{ width: "75px", height: "75px" }}>
                            <img
                                src={formData.profile.profilePicture}
                                alt="CEO"
                                className="img-fluid"
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }}
                            />
                        </div>
                    )}

                </div>
                <h4 className="my-5 text-center ">Project Statistics</h4>
                {Object.keys(formData.statistics).map((key) => (
                    <div className="form-group mb-3" key={key}>
                        <label className='fw-bold'>{key.replace(/([A-Z])/g, " $1")}</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.statistics[key]}
                            onChange={(e) => handleInputChange(e, 'statistics', key)}
                        />
                    </div>
                ))}
                <div className="form-group mb-3">
                    <label className='fw-bold'>Upload Central Image</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => handleImageUpload(e, null, 'centralImage')}
                    />
                    {formData?.centralImage && (
                        <div className="mt-2" style={{ width: "75px", height: "75px" }}>
                            <img
                                src={formData?.centralImage}
                                alt="Central"
                                className="img-fluid"
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }}
                            />
                        </div>
                    )}

                </div>

                <h4 className="my-5 text-center ">Why Choose Us</h4>
                {formData.whyChooseUs.map((item, index) => (
                    <div key={index} className="mb-3">
                        <label className='fw-bold'>Title {index + 1}   </label>
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={item.title}
                            onChange={(e) => handleWhyChooseUsChange(index, "title", e.target.value)}
                        />
                        <label className='fw-bold'>Description {index + 1} (In 12 words) </label>
                        <textarea
                            className="form-control mb-2"
                            rows="3"
                            value={item.description}
                            onChange={(e) => handleWhyChooseUsChange(index, "description", e.target.value)}
                        />
                        <label className='fw-bold'>Upload Image {index + 1}</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => handleImageUpload(e, index, 'whyChooseUs')}
                        />
                        {item.imageUrl && (
                            <div className='w-25 mt-2'>
                                <img src={item.imageUrl} alt={`Why Choose Us ${index + 1}`} className="img-fluid" />
                                <Button variant="danger" onClick={() => handleDeleteImage(index)} className="mt-2">
                                    <FaTrash />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                <div className='d-flex justify-content-center'>
                    <Button className='dashboard_all_button px-5  w-50' type="submit" variant="" disabled={uploading}>
                        {uploading ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            </form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Update</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to update the About Us page?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmUpdate}>
                        Yes, Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ChangeAboutDetails;

