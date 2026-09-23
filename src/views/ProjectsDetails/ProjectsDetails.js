'use client';

import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import Footer from '../../core/Footer';
import TopMenu from '../../core/TopMenu';
import ContactInfo from '../Home/ContactInfo/ContactInfo';
import '../Exterior/Exterior.css';
import axios from 'axios';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import ModalImage from 'react-modal-image'; // Import the ModalImage component
import Modal from 'react-bootstrap/Modal'; // Import Modal from react-bootstrap









import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
function ProjectsDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track current image index


    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await axios.get(`https://3pcommunicationsserver.vercel.app/api/projects/${id}`); // Replace with your actual API endpoint
                console.log(response.data.project);
                setProject(response.data.project);
            } catch (error) {
                console.error('Error fetching project details:', error);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);




    const handleShow = (index) => {
        setCurrentImageIndex(index);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === project.additionalImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? project.additionalImages.length - 1 : prevIndex - 1
        );
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading project details...</p>
            </Container>
        );
    }

    if (!project) {
        return (
            <Container className="text-center my-5">
                <h3>Project not found</h3>
                <p>We're sorry, but the project you're looking for does not exist.</p>
            </Container>
        );
    }

    return (
        <div>
            <TopMenu />
            <Container className="project-details">
                <div className=''>
                    {/* Project Title */}
                    <Row className="mb-4 detailsTitle rounded-pill ">
                        <Col>
                            <h2 className="heading_color text-center  py-5">{project.title || "Untitled Project"}</h2>
                        </Col>
                    </Row>

                    {/* Client Information */}
                    <Row className="align-items-center mb-4">
                        <Col md={3} className="text-center">
                            <Card.Img
                                src={project.mainImage || "https://via.placeholder.com/150.png?text=No+Image"}
                                alt="Project Main Image"
                                className="img-fluid rounded"
                            />
                        </Col>
                        <Col md={9}>
                            {/* <h4 className="heading_color">Client: {project?.client?.name || "Unknown Client"}</h4> */}
                            {/* <p><strong>Email:</strong> {project?.client?.email || "N/A"}</p> */}
                            {/* <p><strong>Phone:</strong> {project?.client?.phone || "N/A"}</p> */}
                            <p><strong>Adress:</strong> {project?.address || "N/A"}</p>
                            <p><strong>Budget:</strong> {project?.budget || "N/A"}</p>
                            <p><strong>Area Size:</strong> {project?.areaSize || "N/A"}</p>
                            <p><strong>Category:</strong> {project?.category || "N/A"}</p>
                            <p><strong>Sub Category:</strong> {project?.subcategory || "N/A"}</p>
                            <p><strong>Status:</strong> {project?.status || "N/A"}</p>
                        </Col>
                    </Row>
                </div>

                {/* Project Images - Thumbnails with Zoom Option */}
                <Row className="mb-5">
                    {project?.additionalImages?.length > 0 ? (
                        project.additionalImages.map((image, index) => (
                            <Col md={4} key={index} className="mb-3">
                                <Card className="border-0">
                                    <ModalImage
                                        small={image} // Thumbnail image
                                        large={image} // Full-sized image for zooming
                                        alt={`Project Image ${index + 1}`} // Alt text for the image
                                        className="img-fluid rounded shadow-sm" // Class for styling
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No additional images available</p>
                    )}
                </Row>
                {/* Relevant Project Images
                <Row className="mb-5">
                    {project?.additionalImages?.length > 0 ? project.additionalImages.map((image, index) => (
                        <Col md={4} key={index} className="mb-3">
                            <Card className="border-0">
                                <Card.Img
                                    src={image}
                                    alt={`Project Image ${index + 1}`}
                                    className="img-fluid rounded shadow-sm"
                                />
                            </Card>
                        </Col>
                    )) : <p>No additional images available</p>}
                </Row>

                {/* Project Images - Thumbnails with Viewer Option */}
                {/* <Row className="mb-5">
                    {project?.additionalImages?.length > 0 ? (
                        project.additionalImages.map((image, index) => (
                            <Col md={4} key={index} className="mb-3">
                                <Card className="border-0">
                                    <Card.Img
                                        src={image}
                                        alt={`Project Image ${index + 1}`}
                                        className="img-fluid rounded shadow-sm"
                                        onClick={() => handleShow(index)} // Open viewer on click
                                        style={{ cursor: 'pointer' }} // Change cursor to pointer
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No additional images available</p>
                    )}
                </Row> */}


                {/* Project Images - Thumbnails with Zoom Option */}
                {/* Project Images - Thumbnails with Zoom Option */}
                {/* <Row className="mb-5">
                    {project?.additionalImages?.length > 0 ? (
                        project.additionalImages.map((image, index) => (
                            <Col md={4} key={index} className="mb-3">
                                <Card className="border-0">
                                    <ModalImage
                                        small={image} // Thumbnail image
                                        large={image} // Full-sized image for zooming
                                        alt={`Project Image ${index + 1}`} // Alt text for the image
                                        className="img-fluid rounded shadow-sm" // Class for styling
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No additional images available</p>
                    )}
                </Row> */}


                <ContactInfo />





                {/* Project Description */}
                <Row className="my-5 py-5">
                    <Col>
                        <h4 className="pt-5 heading_color mb-3">Project Description</h4>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: project?.description || "No description available",
                            }}
                        />

                        {/* <p>{project?.description || "No description available"}</p> */}
                    </Col>
                </Row>



                {/* Client Review */}
                {/* Client Review */}
                <Row className="mb-5 detailsTitle py-5 shadow-md">
                    <Col md={12}>
                        <h4 className="text-center heading_color mb-3">KIND WORDS FROM OUR CLIENT</h4>
                        <hr className="divider text-dark" />
                        <div className="p-4 text-left text-dark">
                            
                            <p>
                                Rating:  <span >
                                    {project?.review?.rating
                                        ? Array.from({ length: project.review.rating }).map((_, index) => (
                                            <FaStar key={index} className='heading_color' />
                                        ))
                                        : "N/A"}
                                </span>
                            </p>
                            <p>{project?.review?.comment || "No feedback available"}</p>

                            <p className="heading_color">Client: <span className='text-dark'>{project?.client?.name || "Unknown Client"}</span></p>
                        </div>
                    </Col>
                </Row>
                {/* Contact Information
                <Row className="mb-5">
                    <Col md={4} className="text-center">
                        <Card className="p-4 shadow-sm detailsPageReview heading_color shadow-lg h-100">
                            <div className="d-flex justify-content-center">
                                <FaPhoneAlt size={50} className="mb-3" />
                            </div>
                            <Card.Text>
                                <strong>Phone:</strong><br />
                                {project?.client?.phone || "N/A"}
                            </Card.Text>
                        </Card>
                    </Col>
                    <Col md={4} className="text-center">
                        <Card className="p-4 shadow-sm detailsPageReview heading_color shadow-lg h-100">
                            <div className="d-flex justify-content-center">
                                <FaEnvelope size={50} className="mb-3" />
                            </div>
                            <Card.Text>
                                <strong>Email:</strong><br />
                                {project?.client?.email || "N/A"}
                            </Card.Text>
                        </Card>
                    </Col>
                    <Col md={4} className="text-center">
                        <Card className="p-4 shadow-sm detailsPageReview heading_color shadow-lg h-100">
                            <div className="d-flex justify-content-center">
                                <FaMapMarkerAlt size={50} className="mb-3" />
                            </div>
                            <Card.Text>
                                <strong>Address:</strong><br />
                                {project?.client?.address || "N/A"}
                            </Card.Text>
                        </Card>
                    </Col>
                </Row> */}
            </Container>

            {/* Modal for Image Viewing */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Body className="text-center">
                    <img
                        src={project?.additionalImages[currentImageIndex]}
                        alt={`Project Image ${currentImageIndex + 1}`}
                        className="img-fluid rounded"
                    />
                    <div className="d-flex justify-content-between my-3">
                        <Button variant="light" onClick={handlePrevImage}>&lt; Prev</Button>
                        <Button variant="light" onClick={handleNextImage}>Next &gt;</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Footer />
        </div>
    );
}

export default ProjectsDetails;
