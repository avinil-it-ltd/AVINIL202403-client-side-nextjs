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
  FaCheckCircle,
  FaLock
} from "react-icons/fa";
import "./contact.css";

const SERVICES = [
  "Home & Apartment Interior",
  "Office & Commercial Interior",
  "Exterior & Building Facade",
  "Corporate Event Management",
  "Complete Turnkey Renovation"
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [spaceSize, setSpaceSize] = useState("");
  const [message, setMessage] = useState("");
  const [selectedService, setSelectedService] = useState("Home & Apartment Interior");
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
        title: "Please Fill Required Fields",
        text: "Please provide your name and phone number so we can reach you.",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    setSubmitting(true);

    const sizeNote = spaceSize.trim() ? `\nApproximate Size / Area: ${spaceSize.trim()}` : "";
    const fullMessage = `[Service: ${selectedService}]${sizeNote}\n\nClient Note:\n${message}`;

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
          title: "Thank You!",
          text: "We have received your request. One of our design coordinators will call or WhatsApp you within 24 hours.",
          confirmButtonColor: "#ea580c",
          background: "#ffffff",
        });

        // Reset form fields
        setName("");
        setEmail("");
        setPhoneNumber("");
        setSpaceSize("");
        setMessage("");
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      Swal.fire({
        icon: "error",
        title: "Message Not Sent",
        text: "We could not submit your request online. Please call or WhatsApp us directly at " + contactDetails.mobile,
        confirmButtonColor: "#ea580c",
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
            Get In Touch
          </div>
          <h1 className="contact-hero-title">
            Let's Talk About Your <span>Next Project</span>
          </h1>
          <p className="contact-hero-subtitle">
            Planning a home interior, modern office renovation, building exterior, or corporate event in Dhaka? Visit our studio, call our team, or send a quick message for a free consultation and project estimate.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="contact-main-section">
        <div className="container">
          <div className="row g-4 align-items-start">
            
            {/* Left Column: Direct Studio Information */}
            <div className="col-12 col-lg-5">
              <div className="contact-info-column">
                
                {/* Design Studio Address */}
                <div className="contact-card">
                  <div className="contact-card-header">
                    <div className="contact-card-icon-box">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h3 className="contact-card-title">Our Design Studio</h3>
                      <p className="contact-card-subtitle">Head Office &amp; Meeting Space</p>
                    </div>
                  </div>
                  <div className="contact-card-body">
                    <p className="mb-3 text-dark">{contactDetails.address}</p>
                    <div className="d-flex align-items-center gap-2 text-muted pt-2 border-top border-light-subtle">
                      <FaClock className="text-warning" />
                      <span>Saturday &ndash; Thursday: 10:00 AM &ndash; 8:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Direct Phone & Email Cards */}
                <div className="contact-quick-channels">
                  <a href={`tel:${contactDetails.mobile}`} className="contact-mini-channel">
                    <div className="channel-icon">
                      <FaPhoneAlt />
                    </div>
                    <div className="channel-text-group">
                      <span className="channel-label">Call Directly</span>
                      <span className="channel-val">{contactDetails.mobile}</span>
                    </div>
                  </a>

                  <a href={`mailto:${contactDetails.email}`} className="contact-mini-channel">
                    <div className="channel-icon">
                      <FaEnvelope />
                    </div>
                    <div className="channel-text-group">
                      <span className="channel-label">Send Email</span>
                      <span className="channel-val" style={{ wordBreak: 'break-all' }}>{contactDetails.email}</span>
                    </div>
                  </a>
                </div>

                {/* WhatsApp Direct Chat Banner */}
                <a
                  href={contactDetails.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-whatsapp-banner"
                >
                  <div className="whatsapp-banner-left">
                    <FaWhatsapp className="whatsapp-banner-icon" />
                    <div>
                      <h4 className="whatsapp-banner-title">Chat with Us on WhatsApp</h4>
                      <p className="whatsapp-banner-sub">Quick answers &amp; instant photo sharing</p>
                    </div>
                  </div>
                  <span className="whatsapp-banner-btn">Chat Now ↗</span>
                </a>

                {/* Studio Location Map */}
                <div className="contact-map-card">
                  <iframe
                    title="3P Communication Office Location in Mohammadpur Dhaka"
                    className="contact-map-iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8488349474744!2d90.3683884!3d23.7527663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b09337b587%3A0xe54d6ec555a1d9a2!2sAsad%20Ave%2C%20Dhaka%201207!5e0!3m2!1sen!2sbd!4v1714500000000!5m2!1sen!2sbd"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Social Networks Connect */}
                <div className="contact-card">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                      <h4 className="contact-card-title mb-1" style={{ fontSize: '1rem' }}>See Our Latest Projects</h4>
                      <p className="contact-card-subtitle">Follow our work on social media</p>
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

            {/* Right Column: Inquiry Form */}
            <div className="col-12 col-lg-7">
              <div className="contact-form-card">
                <div className="contact-form-header">
                  <h2 className="contact-form-title">Request a Free Consultation &amp; Estimate</h2>
                  <p className="contact-form-desc">
                    Tell us what you are looking to build or renovate. We will review your ideas, guide you on materials and layout, and share an initial estimate with no obligation.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  {/* Service Selector Pills */}
                  <div className="discipline-selector-group">
                    <label className="discipline-selector-label">What service are you looking for?</label>
                    <div className="discipline-pills-row">
                      {SERVICES.map((srv) => (
                        <button
                          key={srv}
                          type="button"
                          className={`discipline-pill-btn ${selectedService === srv ? 'active' : ''}`}
                          onClick={() => setSelectedService(srv)}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="contact-field-group">
                    <label className="contact-field-label">Your Full Name *</label>
                    <div className="contact-input-wrapper">
                      <input
                        type="text"
                        className="contact-input-field"
                        placeholder="e.g. Tanvir Hossain"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Email 2-Col */}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="contact-field-group">
                        <label className="contact-field-label">Phone / WhatsApp Number *</label>
                        <div className="contact-input-wrapper">
                          <input
                            type="tel"
                            className="contact-input-field"
                            placeholder="017XXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="contact-field-group">
                        <label className="contact-field-label">Email Address (Optional)</label>
                        <div className="contact-input-wrapper">
                          <input
                            type="email"
                            className="contact-input-field"
                            placeholder="tanvir@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Space Size / Dimensions */}
                  <div className="contact-field-group">
                    <label className="contact-field-label">Space Size or Location (Optional)</label>
                    <div className="contact-input-wrapper">
                      <input
                        type="text"
                        className="contact-input-field"
                        placeholder="e.g. 1,650 sq ft flat in Dhanmondi, or 3,000 sq ft office in Gulshan"
                        value={spaceSize}
                        onChange={(e) => setSpaceSize(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="contact-field-group">
                    <label className="contact-field-label">Tell Us About Your Project *</label>
                    <textarea
                      className="contact-textarea-field"
                      placeholder="Share what rooms or areas you want to design, your preferred style, timeline, or any specific questions..."
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
                      <span>Sending Your Request...</span>
                    ) : (
                      <>
                        <span>Request Free Consultation &amp; Estimate</span>
                        <FaPaperPlane />
                      </>
                    )}
                  </button>

                  <div className="form-guarantee-note">
                    <FaCheckCircle />
                    <span>Free on-site visit &amp; initial consultation. We respect your privacy and never share your details.</span>
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
