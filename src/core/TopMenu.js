'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from '../assets/images/logo.png';

import '../custom.css';
import './top.css';

const TopMenu = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        router.push('/');
    };

    const isActiveLink = (path) => {
        return pathname === path ? 'active' : '';
    };

    const topNav = () => (
        <div>
            <Navbar expand="lg" variant="dark" fixed="top" className="shadow-lg py-3 nav_bar p-0">
                <Container fluid className="px-sm-2 px-md-5">
                    <Navbar.Brand as={Link} href="/" className="d-flex align-items-center">
                        <div className="d-flex align-items-center logo-container">
                            <img src={logo.src || logo} alt="Logo" width="50px" height="40px" />
                            <p className="fs-5 ms-3 navbar_text_color mb-0">3P Communication</p>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" className="me-3 bg-warning border-0" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                        <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
                            <Nav.Link as={Link} href="/" className={`text-warning ${isActiveLink('/')}`}>
                                <p className="navbar_text_color">Home</p>
                            </Nav.Link>
                            <Nav.Link as={Link} href="/interior" className={isActiveLink('/interior')}>
                                <p className="navbar_text_color">Interior</p>
                            </Nav.Link>
                            <Nav.Link as={Link} href="/exterior" className={isActiveLink('/exterior')}>
                                <p className="navbar_text_color">Exterior</p>
                            </Nav.Link>
                            <Nav.Link as={Link} href="/event" className={isActiveLink('/event')}>
                                <p className="navbar_text_color">Event</p>
                            </Nav.Link>
                            <Nav.Link as={Link} href="/aboutUs" className={isActiveLink('/aboutUs')}>
                                <p className="navbar_text_color">About Us</p>
                            </Nav.Link>
                            <Nav.Link as={Link} href="/contactus" className={`text-warning ${isActiveLink('/contactus')}`}>
                                <p className="navbar_text_color">Contact Us</p>
                            </Nav.Link>
                            <Nav.Link as={Link} href="/careers" className={isActiveLink('/careers')}>
                                <p className="navbar_text_color">Career</p>
                            </Nav.Link>

                            {isLoggedIn && (
                                <>
                                    <Nav.Link as={Link} href="/dashboard" className={isActiveLink('/dashboard')}>
                                        <p className="navbar_text_color">Dashboard</p>
                                    </Nav.Link>
                                    <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                        <p className="navbar_text_color">Logout</p>
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );

    return (
        <div>
            {topNav()}
            <br /><br /><br />
        </div>
    );
};

export default TopMenu;
