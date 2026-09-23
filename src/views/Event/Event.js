'use client';

import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom'; // To navigate between pages
import '../../App.css';
import bioImg from "../../../src/assets/images/event/Picture1.jpg";
import TopMenu from '../../core/TopMenu';
import Footer from '../../core/Footer';
import axios from 'axios';

const Event = () => {
    const [projects, setProjects] = useState([]);

    // State to hold contact details, loading, and error
    const [contactDetails, setContactDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch projects from the backend
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/projects'); // Assuming your API route is '/api/projects'
                const exteriorProjects = response.data.projects.filter(project => project.category.toLowerCase() === 'Event Management')?.reverse();

                setProjects(exteriorProjects);
                console.log(exteriorProjects.filter(project => project.category.toLowerCase() === 'exterior design'));
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchProjects();
    }, []);


    const handleMoreDetails = (id) => {
        Navigate(`/details/${id}`); // Navigate to the project details page
    };



    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                const response = await fetch("https://3pcommunicationsserver.vercel.app/api/myContact"); // Adjust the URL as needed
                if (!response.ok) {
                    throw new Error("Failed to fetch contact details");
                }
                const data = await response.json();
                setContactDetails(data); // Set contact details
            } catch (error) {
                console.error("Error fetching contact details:", error);
                setError("Failed to load contact details.");
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchContactDetails();
    }, []); // Empty dependency array to run only once





    // Custom Loader JSX
    const Loader = () => (
        <div className="loader-container">
            <div className="custom-loader"></div>
        </div>
    );

    if (loading) {
        return <Loader />; // Use your custom loader here
    }





    const BioSection = () => (
        <Container className="my-5 px-2 py-5">
            <Row>
                <Col md={6}>
                    <img src={bioImg} alt="Example" className="img-fluid" />
                </Col>
                <Col className="ps-5 d-flex align-items-center " md={6}>
                    <div>

                        <h2
                            className="text-start heading_color"
                            style={{ fontFamily: "'Aref Ruqaa', serif" }}
                        >
                            Our Events
                        </h2>
                        <p style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                            Transforming Your Outdoor Spaces
                        </p>
                        <p className="my-5" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                            At{" "}
                            <span style={{ color: "#FFB300", fontWeight: "bold" }}>
                                3P Communication
                            </span>
                            , we understand that the exterior of your property is just as
                            important as the interior. Our exterior design projects are focused
                            on enhancing curb appeal, functionality, and outdoor living
                            experiences. Whether it's a residential garden, commercial facade,
                            or a complete landscape overhaul, we are dedicated to bringing your
                            vision to life.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );






    const callNow = () => (
        <div className="w-100 bg-dark my-5 py-5">
            <div className="d-flex flex-column flex-md-row justify-content-around align-items-center text-center text-md-start text-black fw-bolder px-3 px-md-5 callNow_font">

                {/* Column 1 - Text */}
                <div className="col-md-4 mb-3 mb-md-0 text-white">
                    <h3>CONTACT NOW FOR YOUR DREAM INTO REALITY</h3>
                </div>

                {/* Column 2 - Phone Number with Icon */}
                <div className="col-md-4  d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="icon-circle ">
                            <i className="bi bi-telephone-fill"></i> {/* Bootstrap phone icon */}
                        </div>
                        <div className="px-3 pt-5">
                            <p className="text-warning"> CALL US<br />
                                <span className="text-white"> {contactDetails ? contactDetails?.mobile : "+880000000000"}</span>
                            </p>
                            <p className="ms-2 fw-bold"></p>
                        </div>
                    </div>
                </div>

                {/* Column 3 - Email with Icon */}
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <div>
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="icon-circle">
                                <i className="bi bi-envelope-fill"></i> {/* Bootstrap envelope icon */}
                            </div>
                            <div className="px-3 pt-3">
                                <p className="text-warning">PLEASE SEND EMAIL<br />
                                    <span className="fw-bold text-white">{contactDetails ? contactDetails?.email : "info@example.com"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );




    const ProjectSection = () => (
        <div className="container mb-5 px-3 pb-5">
            <h1 className="my-5 py-5"><span className="bigText">Event</span> <span className="smallText">Projects</span></h1>

            <div className="row g-4">
                {projects.map((project) => (
                    <div key={project._id} className="col-lg-4 col-md-6">
                        <div className="image-item">
                            <img src={project.mainImage} alt={project.title} className="img-fluid" />

                            <div className="overlay">
                                <div className="overlay-text">
                                    <button onClick={() => handleMoreDetails(project._id)} className="more-details-btn">
                                        More Details
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="imageTitle">
                            <h3 className="text-capitalize fs-5 fw-bold">{project.title}</h3>
                            <p>{project.subcategory}, {project.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="g-0 " style={{ maxWidth: "100vw" }}>
            <div><TopMenu /></div>
            <div className="body_background">
                <div className="container-fluid">
                    <div>{BioSection()}</div>
                    <div>{callNow()}</div>
                    <div>{ProjectSection()}</div>

                </div>
            </div>
            <div id="contact"><Footer /></div>
        </div>
    );
};

export default Event;