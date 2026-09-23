'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaFacebookF, 
  FaYoutube, 
  FaWhatsapp, 
  FaArrowUp, 
  FaPaperPlane 
} from "react-icons/fa";
import logo from '../assets/images/logo.png';
import './footer.css';

const Footer = () => {
  const [contactDetails, setContactDetails] = useState({
    address: "1/3 Asad avenue, Block-A, Asad Gate, Mohammadpur, Dhaka, Bangladesh",
    mobile: "+8801722728272",
    email: "3pcommunication@gmail.com",
    fbLink: "https://web.facebook.com/3PCommunication",
    whatsappLink: "https://wa.me/+8801722728272",
    youtubeLink: "https://www.youtube.com/@3pcommunication569"
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch('https://3pcommunicationsserver.vercel.app/api/myContact');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setContactDetails(prev => ({
              address: data.address || prev.address,
              mobile: data.mobile || prev.mobile,
              email: data.email || prev.email,
              fbLink: data.fbLink || prev.fbLink,
              whatsappLink: data.whatsappLink || prev.whatsappLink,
              youtubeLink: data.youtubeLink || prev.youtubeLink
            }));
          }
        }
      } catch (error) {
        console.warn('Using default contact info:', error.message);
      }
    };

    fetchContactDetails();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      Swal.fire({
        icon: 'warning',
        title: 'Valid Email Required',
        text: 'Please enter a valid email address to subscribe.',
        confirmButtonColor: '#ff6600'
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Subscribed Successfully!',
      text: 'Thank you for subscribing to 3P Communication design newsletters.',
      confirmButtonColor: '#ff6600'
    });

    setNewsletterEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="luxury-footer">
      <Container className="footer-main-content">
        <Row className="g-4">
          {/* Column 1: Brand Profile & Social Channels */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="footer-brand-header">
              <div className="footer-brand-logo-frame">
                <img 
                  src={logo.src || logo} 
                  alt="3P Communication Logo" 
                  className="footer-brand-logo" 
                />
              </div>
              <div className="footer-brand-text">
                <div className="footer-brand-title">3P Communication</div>
                <div className="footer-brand-tagline">Interior • Exterior • Events</div>
              </div>
            </div>

            <p className="footer-brand-bio">
              Pioneering luxury interior architecture, bespoke exterior facades, and experiential event production across Bangladesh. Transforming vision into iconic spaces.
            </p>

            <a 
              href={contactDetails.whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-whatsapp-cta"
            >
              <FaWhatsapp /> <span>Chat on WhatsApp</span>
            </a>

            <div className="footer-social-cluster">
              <a 
                href={contactDetails.fbLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn" 
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href={contactDetails.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn" 
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a 
                href={contactDetails.youtubeLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn" 
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </Col>

          {/* Column 2: Creative Disciplines Directory */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-heading">Disciplines</h5>
            <ul className="footer-link-list">
              <li>
                <Link href="/interior" className="footer-nav-link">
                  Residential Interiors
                </Link>
              </li>
              <li>
                <Link href="/interior" className="footer-nav-link">
                  Commercial Offices
                </Link>
              </li>
              <li>
                <Link href="/exterior" className="footer-nav-link">
                  Exterior Facades
                </Link>
              </li>
              <li>
                <Link href="/event" className="footer-nav-link">
                  Event & Stage Design
                </Link>
              </li>
              <li>
                <Link href="/interior" className="footer-nav-link">
                  Turnkey Execution
                </Link>
              </li>
            </ul>
          </Col>

          {/* Column 3: Studio & Governance */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-heading">Studio</h5>
            <ul className="footer-link-list">
              <li>
                <Link href="/aboutUs" className="footer-nav-link">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link href="/careers" className="footer-nav-link">
                  Careers <span className="footer-hiring-pill">HIRING</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-nav-link">
                  Consultation FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacyPolicy" className="footer-nav-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="footer-nav-link">
                  Contact Studio
                </Link>
              </li>
            </ul>
          </Col>

          {/* Column 4: Studio Headquarters & Newsletter */}
          <Col lg={4} md={6}>
            <h5 className="footer-heading">Headquarters</h5>
            <div className="footer-contact-items">
              <div className="footer-contact-row">
                <FaMapMarkerAlt className="footer-contact-icon" />
                <span>{contactDetails.address}</span>
              </div>
              <div className="footer-contact-row">
                <FaPhoneAlt className="footer-contact-icon" />
                <a href={`tel:${contactDetails.mobile}`}>{contactDetails.mobile}</a>
              </div>
              <div className="footer-contact-row">
                <FaEnvelope className="footer-contact-icon" />
                <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
              </div>
              <div className="footer-contact-row">
                <FaClock className="footer-contact-icon" />
                <span>Sat – Thu: 10:00 AM – 7:00 PM</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="footer-newsletter-box">
              <label htmlFor="footer-subscribe" className="footer-newsletter-label">
                Subscribe for Design Insights
              </label>
              <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
                <input 
                  type="email" 
                  id="footer-subscribe"
                  className="footer-newsletter-input" 
                  placeholder="Enter your email..." 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className="footer-newsletter-btn" aria-label="Subscribe">
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <Container>
          <div className="footer-bottom-flex">
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} 3P Communication. All Rights Reserved.
            </p>

            <p className="footer-attribution">
              System Engineered & Developed by{' '}
              <a 
                href="https://avinil.com/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Avinil IT LTD
              </a>
            </p>

            <button 
              type="button" 
              className="footer-back-to-top" 
              onClick={scrollToTop} 
              aria-label="Back to top"
              title="Back to Top"
            >
              <FaArrowUp />
            </button>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
