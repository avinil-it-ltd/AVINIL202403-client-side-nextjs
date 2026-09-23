'use client';

import React, { useEffect, useState } from "react";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
  FaPaperPlane,
  FaClock,
  FaSparkles,
  FaCheckCircle
} from "react-icons/fa";
import "./contact.css";

const DISCIPLINES = [
  "Interior Design",
  "Exterior & Facade",
  "Event Management",
  "Complete Turnkey",
  "Custom Fabrication"
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("Interior Design");
  const [submitting, setSubmitting] = useState(false);

  // State to hold contact details
  const [contactDetails, setContactDetails] = useState({
    address: "1/3 Asad avenue, Block-A, Asad Gate, Mohammadpur, Dhaka, Bangladesh",
    mobile: "+8801722728272",
    email: "3pcommunication@gmail.com",
    fbLink: "https://web.facebook.com/3PCommunication",
    whatsappLink: "https://wa.me/+8801722728272",
    youtubeLink: "https://www.youtube.com/@3pcommunication569"
  });
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch("https://3pcommunicationsserver.vercel.app/api/myContact");
        if (response.ok) {
          const data = await response.json();
          if (data && data.address) {
            setContactDetails(data);
          }
        }
      } catch (error) {
        console.error("Error fetching contact details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchContactDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please provide your name and contact phone number.",
        confirmButtonColor: "#ff6600",
      });
      return;
    }

    setSubmitting(true);

    const fullMessage = `[Project Discipline: ${selectedDiscipline}]\n\n${message}`;

    try {
      const response = await axios.post("https://3pcommunicationsserver.vercel.app/api/contacts", {
        name,
        email,
        phoneNumber,
        message: fullMessage,
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Inquiry Received",
          text: "Thank you for reaching out. An architectural lead will connect with you within 24 hours.",
          confirmButtonColor: "#ff6600",
          background: "#ffffff",
        });

        // Reset form fields
        setName("");
        setEmail("");
        setPhoneNumber("");
        setMessage("");
      }
    } catch (err) {
      console.error("Backend contact submission error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "We could not transmit your inquiry right now. Please call or WhatsApp us directly.",
        confirmButtonColor: "#ff6600",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <TopMenu />

      {/* Hero Header */}
      <section className="contact-hero-banner">
        <div className="container">
          <div className="contact-hero-tag">
            <span>✦</span> CONNECT &amp; COLLABORATE
          </div>
          <h1 className="contact-hero-title">
            Let's Bring Your Spatial Vision <span>To Reality</span>
          </h1>
          <p className="contact-hero-subtitle">
            Whether it's bespoke residential interiors, commercial exterior elevations, or premium brand event productions, our multidisciplinary team is here to engineer perfection.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="contact-main-section">
        <div className="container">
          <div className="row g-4 align-items-start">
            {/* Left Column: Studio Telemetry */}
            <div className="col-12 col-lg-5">
              <div className="contact-info-column">
                
                {/* Headquarters Card */}
                <div className="contact-card">
                  <div className="contact-card-header">
                    <div className="contact-card-icon-box">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h3 className="contact-card-title">Studio Headquarters</h3>
                      <p className="contact-card-subtitle">Principal Design Office</p>
                    </div>
                  </div>
                  <div className="contact-card-body">
                    <p className="mb-3 text-secondary">{contactDetails.address}</p>
                    <div className="d-flex align-items-center gap-2 text-muted pt-2 border-top border-light-subtle">
                      <FaClock className="text-warning" />
                      <span>Sat &ndash; Thu: 10:00 AM &ndash; 8:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Quick Channels Row */}
                <div className="contact-quick-channels">
                  <a href={`tel:${contactDetails.mobile}`} className="contact-mini-channel">
                    <div className="channel-icon">
                      <FaPhoneAlt />
                    </div>
                    <div className="channel-text-group">
                      <span className="channel-label">Direct Hotline</span>
                      <span className="channel-val">{contactDetails.mobile}</span>
                    </div>
                  </a>

                  <a href={`mailto:${contactDetails.email}`} className="contact-mini-channel">
                    <div className="channel-icon">
                      <FaEnvelope />
                    </div>
                    <div className="channel-text-group">
                      <span className="channel-label">Email Inquiries</span>
                      <span className="channel-val" style={{ wordBreak: 'break-all' }}>{contactDetails.email}</span>
                    </div>
                  </a>
                </div>

                {/* WhatsApp Banner Card */}
                <a
                  href={contactDetails.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-whatsapp-banner"
                >
                  <div className="whatsapp-banner-left">
                    <FaWhatsapp className="whatsapp-banner-icon" />
                    <div>
                      <h4 className="whatsapp-banner-title">Instant WhatsApp Consultation</h4>
                      <p className="whatsapp-banner-sub">Chat directly with a project consultant</p>
                    </div>
                  </div>
                  <span className="whatsapp-banner-btn">Chat Now ↗</span>
                </a>

                {/* Google Maps Card */}
                <div className="contact-map-card">
                  <iframe
                    title="3P Communication Office Location"
                    className="contact-map-iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8488349474744!2d90.3683884!3d23.7527663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b09337b587%3A0xe54d6ec555a1d9a2!2sAsad%20Ave%2C%20Dhaka%201207!5e0!3m2!1sen!2sbd!4v1714500000000!5m2!1sen!2sbd"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Social Networks Connect */}
                <div className="contact-card">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="contact-card-title mb-1" style={{ fontSize: '1rem' }}>Studio Socials</h4>
                      <p className="contact-card-subtitle">Follow our live architectural portfolio</p>
                    </div>
                    <div className="contact-social-row">
                      {contactDetails.fbLink && (
                        <a
                          href={contactDetails.fbLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social-btn"
                          title="Facebook"
                        >
                          <FaFacebookF />
                        </a>
                      )}
                      {contactDetails.whatsappLink && (
                        <a
                          href={contactDetails.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social-btn"
                          title="WhatsApp"
                        >
                          <FaWhatsapp />
                        </a>
                      )}
                      {contactDetails.youtubeLink && (
                        <a
                          href={contactDetails.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social-btn"
                          title="YouTube"
                        >
                          <FaYoutube />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Inquiry Studio Form */}
            <div className="col-12 col-lg-7">
              <div className="contact-form-card">
                <div className="contact-form-header">
                  <h2 className="contact-form-title">Consultation &amp; Project Inquiry</h2>
                  <p className="contact-form-desc">
                    Tell us about your residential, commercial, or event ambitions. Our senior architects and coordinators will review your requirements and provide tailored spatial guidance.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Discipline Pill Selector */}
                  <div className="discipline-selector-group">
                    <label className="discipline-selector-label">Select Project Discipline</label>
                    <div className="discipline-pills-row">
                      {DISCIPLINES.map((disc) => (
                        <button
                          key={disc}
                          type="button"
                          className={`discipline-pill-btn ${selectedDiscipline === disc ? 'active' : ''}`}
                          onClick={() => setSelectedDiscipline(disc)}
                        >
                          {disc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="contact-field-group">
                    <label className="contact-field-label">Full Name *</label>
                    <div className="contact-input-wrapper">
                      <input
                        type="text"
                        className="contact-input-field"
                        placeholder="e.g. Architect Abrar Ahmed"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone 2-Col */}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="contact-field-group">
                        <label className="contact-field-label">Email Address</label>
                        <div className="contact-input-wrapper">
                          <input
                            type="email"
                            className="contact-input-field"
                            placeholder="abrar@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="contact-field-group">
                        <label className="contact-field-label">Phone / WhatsApp *</label>
                        <div className="contact-input-wrapper">
                          <input
                            type="tel"
                            className="contact-input-field"
                            placeholder="+880 17..."
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="contact-field-group">
                    <label className="contact-field-label">Project Scope &amp; Vision *</label>
                    <textarea
                      className="contact-textarea-field"
                      placeholder="Share details about your space, dimensions/sqft, site location, target timelines, or specific design preferences..."
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="contact-submit-cta"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>Transmitting Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <FaPaperPlane />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
