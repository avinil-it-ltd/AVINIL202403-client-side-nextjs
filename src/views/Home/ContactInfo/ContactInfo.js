'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import ContactModal from "../../Contact/ContactModal";
import './ContactInfo.css';

function ContactInfo() {
  const [contactDetails, setContactDetails] = useState({
    mobile: "+8801722728272",
    email: "3pcommunication@gmail.com",
    address: "1/3 Asad Avenue, Block-A, Asad Gate, Mohammadpur, Dhaka",
    whatsappLink: "https://wa.me/+8801722728272"
  });
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch("https://3pcommunicationsserver.vercel.app/api/myContact");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setContactDetails(prev => ({
              mobile: data.mobile || prev.mobile,
              email: data.email || prev.email,
              address: data.address || prev.address,
              whatsappLink: data.whatsappLink || prev.whatsappLink
            }));
          }
        }
      } catch (err) {
        console.warn("Using fallback studio contact info:", err.message);
      }
    };

    fetchContactDetails();
  }, []);

  return (
    <section className="atelier-contact-strip py-5">
      <Container className="py-2">
        <div className="contact-strip-inner">
          <Row className="align-items-center g-4">
            {/* Header / Intro Column */}
            <Col lg={4} md={12}>
              <div className="contact-strip-header">
                <span className="contact-strip-eyebrow">DIRECT STUDIO LINE</span>
                <h3 className="contact-strip-title">
                  Initiate a Project Consultation
                </h3>
                <p className="contact-strip-desc">
                  Have architectural drawings or an upcoming commercial fitout? Connect with our project directors directly.
                </p>
                <button 
                  type="button" 
                  className="contact-brief-btn mt-2"
                  onClick={() => setModalShow(true)}
                >
                  <span>Book Free Consultation</span>
                  <FaArrowRight />
                </button>
              </div>
            </Col>

            {/* Clickable Touchpoint Cards */}
            <Col lg={8} md={12}>
              <Row className="g-3">
                {/* 1. Phone Card */}
                <Col sm={6} className="d-flex">
                  <a 
                    href={`tel:${contactDetails.mobile}`} 
                    className="contact-touch-card w-100"
                    title="Click to dial studio phone"
                  >
                    <div className="touch-card-icon-box">
                      <FaPhoneAlt />
                    </div>
                    <div className="touch-card-info">
                      <div className="touch-card-label">DIRECT PHONE</div>
                      <div className="touch-card-value">{contactDetails.mobile}</div>
                      <div className="touch-card-sub">Sat – Thu: 10:00 AM – 7:00 PM</div>
                    </div>
                    <FaArrowRight className="touch-card-arrow" />
                  </a>
                </Col>

                {/* 2. Email Card */}
                <Col sm={6} className="d-flex">
                  <a 
                    href={`mailto:${contactDetails.email}`} 
                    className="contact-touch-card w-100"
                    title="Click to send project brief"
                  >
                    <div className="touch-card-icon-box">
                      <FaEnvelope />
                    </div>
                    <div className="touch-card-info">
                      <div className="touch-card-label">EMAIL DESK</div>
                      <div className="touch-card-value text-truncate">{contactDetails.email}</div>
                      <div className="touch-card-sub">Send drawings & tender inquiries</div>
                    </div>
                    <FaArrowRight className="touch-card-arrow" />
                  </a>
                </Col>

                {/* 3. WhatsApp Card */}
                <Col sm={6} className="d-flex">
                  <a 
                    href={contactDetails.whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-touch-card w-100"
                    title="Chat on WhatsApp"
                  >
                    <div className="touch-card-icon-box whatsapp-box">
                      <FaWhatsapp />
                    </div>
                    <div className="touch-card-info">
                      <div className="touch-card-label">INSTANT WHATSAPP</div>
                      <div className="touch-card-value">Start Chat</div>
                      <div className="touch-card-sub">Fast estimates & photo sharing</div>
                    </div>
                    <FaArrowRight className="touch-card-arrow" />
                  </a>
                </Col>

                {/* 4. Studio Address Card */}
                <Col sm={6} className="d-flex">
                  <Link 
                    href="/contactus" 
                    className="contact-touch-card w-100"
                    title="Visit Studio in Mohammadpur"
                  >
                    <div className="touch-card-icon-box">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="touch-card-info">
                      <div className="touch-card-label">VISIT OUR ATELIER</div>
                      <div className="touch-card-value">Asad Gate, Dhaka</div>
                      <div className="touch-card-sub">CAD review & material library</div>
                    </div>
                    <FaArrowRight className="touch-card-arrow" />
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Reusable Contact Modal */}
      <ContactModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </section>
  );
}

export default ContactInfo;
