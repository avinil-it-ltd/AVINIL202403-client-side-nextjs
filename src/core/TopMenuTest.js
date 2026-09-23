import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from '../assets/images/logo.png';

import './top.css';

const TopMenuTest = () => {
    const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login state from localStorage on component mount
    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn'); // Remove login state from localStorage
        setIsLoggedIn(false); // Update the state
        navigate('/'); // Redirect to the login page
    };

    return (
        <div>
            <Navbar expand="lg" variant="dark" fixed="top" className="shadow-lg py-3 nav_bar p-0">
                <Container fluid className="px-4">
                    {/* Logo Section */}
                    <Navbar.Brand href="/" className="d-flex align-items-center">
                        <div className="d-flex align-items-center logo-container">
                            <img src={logo} alt="Logo" width="50px" height="40px" />
                            <p className="fs-5 ms-3 navbar_text_color mb-0">3P Communication</p>
                        </div>
                    </Navbar.Brand>

                    {/* Toggle for Mobile View */}
                    <Navbar.Toggle aria-controls="navbarScroll" className="me-3 bg-warning border-0" />

                    {/* Collapsible Links */}
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                        <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
                            <Nav.Link href="/" className="text-warning">
                                <p className="navbar_text_color mb-0">Home</p>
                            </Nav.Link>
                            <Nav.Link href="/interior">
                                <p className="navbar_text_color mb-0">Interior</p>
                            </Nav.Link>
                            <Nav.Link href="/exterior">
                                <p className="navbar_text_color mb-0">Exterior</p>
                            </Nav.Link>
                            <Nav.Link href="/aboutUs">
                                <p className="navbar_text_color mb-0">About Us</p>
                            </Nav.Link>
                            <Nav.Link href="/contactus" className="text-warning">
                                <p className="navbar_text_color mb-0">Contact Us</p>
                            </Nav.Link>
                            <Nav.Link href="/careers">
                                <p className="navbar_text_color mb-0">Career</p>
                            </Nav.Link>

                            {/* Conditional Links if User is Logged In */}
                            {isLoggedIn && (
                                <>
                                    <Nav.Link href="/dashboard">
                                        <p className="navbar_text_color mb-0">Dashboard</p>
                                    </Nav.Link>
                                    <Nav.Link onClick={handleLogout}>
                                        <p className="navbar_text_color mb-0">Logout</p>
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Spacer to avoid content overlap with fixed navbar */}
            <br /><br /><br />
        </div>
    );
};

export default TopMenuTest;
