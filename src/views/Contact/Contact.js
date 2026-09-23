'use client';

import React, { useEffect, useState } from "react";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
  FaArrowRight,
  FaClock,
  FaLock,
  FaMapMarkerAlt
} from "react-icons/fa";
import "./contact.css";

const DISCIPLINES = [
  "Residential Interior",
  "Commercial / Office",
  "Building Exterior Facade",
  "Corporate Event Production",
  "Complete Interior Fit-out"
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [spaceSize, setSpaceSize] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("Residential Interior");
  const [submitting, setSubmitting] = useState(false);

  const [contactDetails, setContactDetails] = useState({
    address: "1/3 Asad avenue, Block-A, Asad Gate, Mohammadpur, Dhaka, Bangladesh",
    mobile: "+8801722728272",
    email: "3pcommunication@gmail.com",
    fbLink: "https://web.facebook.com/3PCommunication",
    whatsappLink: "https://wa.me/+8801722728272",
    youtubeLink: "https://www.youtube.com/@3pcommunication569"
  });

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
      }
    };

    fetchContactDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required Information Missing",
        text: "Please provide your full name and contact telephone number.",
        confirmButtonColor: "#141414",
      });
      return;
    }

    setSubmitting(true);

    const sizeNote = spaceSize.trim() ? `\nApproximate Space / Area: ${spaceSize.trim()}` : "";
    const fullMessage = `[Discipline: ${selectedDiscipline}]${sizeNote}\n\nProject Scope & Notes:\n${message}`;

    try {
      const response = await axios.post("https://3pcommunicationsserver.vercel.app/api/contacts", {
        name,
        email: email.trim() || undefined,
        phoneNumber,
        message: fullMessage,
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Message Received",
          text: "Thank you. Our design team will review your project details and contact you within 24 hours.",
          confirmButtonColor: "#141414",
          background: "#ffffff",
        });

        setName("");
        setEmail("");
        setPhoneNumber("");
        setSpaceSize("");
        setMessage("");
      }
    } catch (err) {
      console.error("Contact submission error:", err);
      Swal.fire({
        icon: "error",
        title: "Sending Failed",
        text: "Could not send your message online. Please call us directly at " + contactDetails.mobile,
        confirmButtonColor: "#141414",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <TopMenu />

      {/* Editorial Split Hero */}
      <section className="contact-editorial-hero">
        <div className="container">
          <div className="hero-content-col">
            <div className="contact-micro-tag">
              3P Communication &bull; Design Consultation &bull; Dhaka
            </div>
            <h1 className="contact-editorial-headline">
              Start a Project. Visit Our Office.
            </h1>
            <p className="contact-editorial-subtext">
              Whether you are planning a home renovation, corporate office setup, building exterior facade, or an upcoming event in Dhaka — let's review your floor plans, budget, and timeline together.
            </p>
            <div className="contact-telemetry-strip">
              <div className="contact-telemetry-item">
                <FaMapMarkerAlt className="text-secondary me-2" />
                <span>Coordinates: <strong>23.7528° N, 90.3684° E &bull; Mohammadpur, Dhaka</strong></span>
              </div>
              <div className="contact-telemetry-item">
                <span>Working Days: <strong>Saturday &ndash; Thursday</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <section className="contact-workspace-section">
        <div className="container">
          <div className="row g-5 align-items-start">
            
            {/* Left Column: Studio Information & Direct Channels */}
            <div className="col-12 col-lg-5">
              <div className="contact-sidebar-flow">
                
                {/* The Design Studio Card */}
                <div className="studio-info-card">
                  <span className="studio-card-tag">Principal Design Office</span>
                  <h3 className="studio-card-title">Our Office &amp; Meeting Space</h3>
                  <p className="studio-address-text">
                    {contactDetails.address}
                  </p>
                  <p className="small text-muted mb-3">
                    Walk-ins and scheduled appointments welcome. Bring your floor plans or drawings for an immediate review with our design team.
                  </p>
                  <div className="studio-hours-row">
                    <FaClock className="text-secondary" />
                    <span>Saturday &ndash; Thursday: 10:00 AM &ndash; 8:00 PM</span>
                  </div>
                </div>

                {/* Direct Channels Dual Grid */}
                <div className="direct-channels-grid">
                  <a href={`tel:${contactDetails.mobile}`} className="direct-channel-card">
                    <span className="channel-micro-label">Direct Hotline</span>
                    <span className="channel-lead-val">{contactDetails.mobile}</span>
                  </a>

                  <a href={`mailto:${contactDetails.email}`} className="direct-channel-card">
                    <span className="channel-micro-label">Studio Email</span>
                    <span className="channel-lead-val" style={{ wordBreak: 'break-all' }}>{contactDetails.email}</span>
                  </a>
                </div>

                {/* WhatsApp Architectural Direct Banner */}
                <a
                  href={contactDetails.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-direct-box"
                >
                  <div>
                    <h4 className="whatsapp-box-title">Direct WhatsApp Consultation</h4>
                    <p className="whatsapp-box-sub">Send site photos, dimensions, and floor plans</p>
                  </div>
                  <span className="whatsapp-action-pill">Open Chat ↗</span>
                </a>

                {/* Studio Location Map */}
                <div className="studio-map-frame">
                  <iframe
                    title="3P Communication Office Location in Mohammadpur Dhaka"
                    className="studio-map-iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8488349474744!2d90.3683884!3d23.7527663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b09337b587%3A0xe54d6ec555a1d9a2!2sAsad%20Ave%2C%20Dhaka%201207!5e0!3m2!1sen!2sbd!4v1714500000000!5m2!1sen!2sbd"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Social Networks Connect */}
                <div className="studio-social-box">
                  <div className="social-title-group">
                    <h4>Live Architectural Portfolio</h4>
                    <p>Follow our ongoing construction sites</p>
                  </div>
                  <div className="social-icons-strip">
                    {contactDetails.fbLink && (
                      <a
                        href={contactDetails.fbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-btn"
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
                        className="social-icon-btn"
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
                        className="social-icon-btn"
                        title="YouTube"
                      >
                        <FaYoutube />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Project Consultation Brief */}
            <div className="col-12 col-lg-7">
              <div className="project-brief-sheet">
                <div className="brief-header">
                  <span className="brief-micro-tag">Architectural Intake</span>
                  <h2 className="brief-title">Submit a Project Brief</h2>
                  <p className="brief-desc">
                    Share preliminary project parameters below. An architect will review your square footage, target timeline, and aesthetic objectives before organizing a dedicated consultation.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  {/* Discipline Specification Tabs */}
                  <div className="brief-discipline-group">
                    <label className="brief-discipline-label">Select Project Discipline</label>
                    <div className="brief-discipline-pills">
                      {DISCIPLINES.map((disc) => (
                        <button
                          key={disc}
                          type="button"
                          className={`brief-pill-btn ${selectedDiscipline === disc ? 'active' : ''}`}
                          onClick={() => setSelectedDiscipline(disc)}
                        >
                          {disc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="brief-field-group">
                    <label className="brief-field-label">Your Full Name *</label>
                    <input
                      type="text"
                      className="brief-text-input"
                      placeholder="e.g. Architect / Client Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone & Email 2-Col */}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="brief-field-group">
                        <label className="brief-field-label">Telephone / WhatsApp *</label>
                        <input
                          type="tel"
                          className="brief-text-input"
                          placeholder="+880 17XXXXXXXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="brief-field-group">
                        <label className="brief-field-label">Email Address (Optional)</label>
                        <input
                          type="email"
                          className="brief-text-input"
                          placeholder="client@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Space Size / Area */}
                  <div className="brief-field-group">
                    <label className="brief-field-label">Approximate Area / Site Location (Optional)</label>
                    <input
                      type="text"
                      className="brief-text-input"
                      placeholder="e.g. 2,200 sq ft flat in Dhanmondi, or 4-story commercial building in Banani"
                      value={spaceSize}
                      onChange={(e) => setSpaceSize(e.target.value)}
                    />
                  </div>

                  {/* Project Scope & Requirements */}
                  <div className="brief-field-group">
                    <label className="brief-field-label">Project Details &amp; Requirements *</label>
                    <textarea
                      className="brief-textarea"
                      placeholder="Tell us about your project, number of rooms or workstations, target start date, material preferences, or ideas..."
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="brief-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Send Inquiry</span>
                        <FaArrowRight />
                      </>
                    )}
                  </button>

                  <div className="brief-privacy-note">
                    <FaLock className="text-secondary" />
                    <span>Confidentiality guaranteed. Project drawings, site specs, and contact details are kept strictly private.</span>
                  </div>

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
