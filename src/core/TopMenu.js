'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar, Container, Nav, Offcanvas } from "react-bootstrap";
import { 
  FaPhoneAlt, 
  FaArrowRight, 
  FaBars, 
  FaTimes, 
  FaCouch, 
  FaBuilding, 
  FaGlassCheers, 
  FaInfoCircle, 
  FaBriefcase, 
  FaEnvelope, 
  FaWhatsapp,
  FaThLarge 
} from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import ContactModal from '../views/Contact/ContactModal';

import '../custom.css';
import './top.css';

const TopMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [contactData, setContactData] = useState({
    mobile: "+8801722728272",
    whatsappLink: "https://wa.me/+8801722728272",
    email: "3pcommunication@gmail.com"
  });

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');

    // Fetch live hotline & contact details
    fetch('https://3pcommunicationsserver.vercel.app/api/myContact')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setContactData(prev => ({
            mobile: data.mobile || prev.mobile,
            whatsappLink: data.whatsappLink || prev.whatsappLink,
            email: data.email || prev.email
          }));
        }
      })
      .catch(() => {});

    // Scroll listener for compact glassmorphism
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/');
  };

  const isActiveLink = (path) => {
    return pathname === path ? 'active-nav-link' : '';
  };

  const closeOffcanvas = () => setShowOffcanvas(false);

  return (
    <>
      <Navbar 
        expand="xl" 
        sticky="top" 
        className={`nav_bar ${isScrolled ? 'nav_scrolled' : ''}`}
      >
        <Container fluid className="px-3 px-lg-5">
          {/* Brand Identity */}
          <Navbar.Brand as={Link} href="/" className="navbar-brand-wrapper">
            <div className="navbar-brand-content">
              <img 
                src={logo.src || logo} 
                alt="3P Communication Logo" 
                className="navbar-brand-logo" 
              />
              <div className="navbar-brand-text-group">
                <span className="navbar-brand-name">3P Communication</span>
                <span className="navbar-brand-tagline">Interior • Exterior • Events</span>
              </div>
            </div>
          </Navbar.Brand>

          {/* Desktop Center Navigation */}
          <Nav className="mx-auto navbar-center-nav d-none d-xl-flex align-items-center">
            <Nav.Link as={Link} href="/" className={`nav-link-item ${isActiveLink('/')}`}>
              Home
            </Nav.Link>

            {/* Creative Disciplines Group */}
            <div className="nav-discipline-wrapper">
              <Nav.Link 
                as={Link} 
                href="/interior" 
                className={`nav-link-item nav-discipline-link ${isActiveLink('/interior')}`}
              >
                <span className="discipline-dot"></span> Interior
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                href="/exterior" 
                className={`nav-link-item nav-discipline-link ${isActiveLink('/exterior')}`}
              >
                <span className="discipline-dot"></span> Exterior
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                href="/event" 
                className={`nav-link-item nav-discipline-link ${isActiveLink('/event')}`}
              >
                <span className="discipline-dot"></span> Events
              </Nav.Link>
            </div>

            <Nav.Link as={Link} href="/aboutUs" className={`nav-link-item ${isActiveLink('/aboutUs')}`}>
              About Us
            </Nav.Link>
            <Nav.Link as={Link} href="/careers" className={`nav-link-item ${isActiveLink('/careers')}`}>
              Careers
            </Nav.Link>
            <Nav.Link as={Link} href="/contactus" className={`nav-link-item ${isActiveLink('/contactus')}`}>
              Contact
            </Nav.Link>

            {isLoggedIn && (
              <Nav.Link as={Link} href="/dashboard" className={`nav-link-item ${isActiveLink('/dashboard')}`}>
                Dashboard
              </Nav.Link>
            )}
          </Nav>

          {/* Desktop Right Action Hub */}
          <div className="navbar-action-hub d-none d-xl-flex align-items-center">
            <a 
              href={`tel:${contactData.mobile}`} 
              className="nav-hotline-btn" 
              title="Call Studio Hotline"
            >
              <div className="hotline-icon-circle">
                <FaPhoneAlt />
              </div>
              <div className="nav-hotline-text">
                <span className="hotline-label">Direct Hotline</span>
                <span className="hotline-number">{contactData.mobile}</span>
              </div>
            </a>

            <button 
              type="button" 
              className="nav-consultation-cta" 
              onClick={() => setModalShow(true)}
            >
              <span>Book Consultation</span>
              <FaArrowRight className="cta-arrow-icon" />
            </button>

            {isLoggedIn && (
              <button 
                onClick={handleLogout} 
                className="nav-logout-btn" 
                title="Sign Out"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Actions & Toggle */}
          <div className="d-flex d-xl-none align-items-center gap-2">
            <button 
              type="button" 
              className="nav-mobile-cta-sm" 
              onClick={() => setModalShow(true)}
              aria-label="Book Consultation"
            >
              <span>Consult</span>
            </button>

            <button 
              className="navbar-mobile-toggle-btn" 
              onClick={() => setShowOffcanvas(true)} 
              aria-label="Open mobile menu"
            >
              <FaBars />
            </button>
          </div>
        </Container>
      </Navbar>


      {/* Luxury Mobile Offcanvas Drawer */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={closeOffcanvas} 
        placement="end" 
        className="luxury-mobile-drawer"
      >
        <Offcanvas.Header className="drawer-header">
          <div className="d-flex align-items-center gap-2">
            <img src={logo.src || logo} alt="3P Logo" width="38px" height="30px" />
            <div>
              <div className="drawer-brand-title">3P Communication</div>
              <div className="drawer-brand-sub">Architectural Studio</div>
            </div>
          </div>
          <button 
            type="button" 
            className="drawer-close-btn" 
            onClick={closeOffcanvas}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </Offcanvas.Header>

        <Offcanvas.Body className="drawer-body">
          {/* Creative Disciplines Segment */}
          <div className="drawer-section-label">CREATIVE DISCIPLINES</div>
          <div className="drawer-nav-group">
            <Link 
              href="/interior" 
              className={`drawer-nav-link ${isActiveLink('/interior')}`} 
              onClick={closeOffcanvas}
            >
              <div className="drawer-link-icon-box"><FaCouch /></div>
              <div className="drawer-link-text">
                <span className="drawer-link-main">Interior Architecture</span>
                <span className="drawer-link-desc">Luxury Residential & Commercial</span>
              </div>
            </Link>

            <Link 
              href="/exterior" 
              className={`drawer-nav-link ${isActiveLink('/exterior')}`} 
              onClick={closeOffcanvas}
            >
              <div className="drawer-link-icon-box"><FaBuilding /></div>
              <div className="drawer-link-text">
                <span className="drawer-link-main">Exterior & Facades</span>
                <span className="drawer-link-desc">Modern Structural Architecture</span>
              </div>
            </Link>

            <Link 
              href="/event" 
              className={`drawer-nav-link ${isActiveLink('/event')}`} 
              onClick={closeOffcanvas}
            >
              <div className="drawer-link-icon-box"><FaGlassCheers /></div>
              <div className="drawer-link-text">
                <span className="drawer-link-main">Event & Stage Design</span>
                <span className="drawer-link-desc">Experiential Corporate Productions</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="drawer-section-label mt-4">STUDIO & COMPANY</div>
          <div className="drawer-nav-group">
            <Link href="/" className={`drawer-nav-link-simple ${isActiveLink('/')}`} onClick={closeOffcanvas}>
              Home
            </Link>
            <Link href="/aboutUs" className={`drawer-nav-link-simple ${isActiveLink('/aboutUs')}`} onClick={closeOffcanvas}>
              About Us
            </Link>
            <Link href="/careers" className={`drawer-nav-link-simple ${isActiveLink('/careers')}`} onClick={closeOffcanvas}>
              Careers
            </Link>
            <Link href="/contactus" className={`drawer-nav-link-simple ${isActiveLink('/contactus')}`} onClick={closeOffcanvas}>
              Contact Us
            </Link>
            {isLoggedIn && (
              <Link href="/dashboard" className={`drawer-nav-link-simple ${isActiveLink('/dashboard')}`} onClick={closeOffcanvas}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Action Hub */}
          <div className="drawer-footer-actions mt-4 pt-3">
            <button 
              type="button" 
              className="drawer-consult-btn w-100" 
              onClick={() => {
                closeOffcanvas();
                setModalShow(true);
              }}
            >
              <span>Book Design Consultation</span>
              <FaArrowRight />
            </button>

            <div className="d-flex gap-2 mt-3">
              <a 
                href={`tel:${contactData.mobile}`} 
                className="drawer-contact-pill flex-grow-1"
              >
                <FaPhoneAlt /> Call Hotline
              </a>
              <a 
                href={contactData.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="drawer-contact-pill drawer-whatsapp-pill flex-grow-1"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>

            {isLoggedIn && (
              <button 
                onClick={() => {
                  closeOffcanvas();
                  handleLogout();
                }} 
                className="btn btn-outline-danger btn-sm w-100 mt-3"
              >
                Sign Out
              </button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Global Consultation Modal */}
      <ContactModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default TopMenu;
