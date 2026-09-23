'use client';

import React, { useState } from "react";
import axios from "axios";
import { Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaCommentAlt,
  FaPaperPlane,
  FaTimes,
  FaBuilding,
  FaHome,
  FaCity,
  FaCalendarAlt
} from "react-icons/fa";
import "./ContactModal.css";

const SERVICE_OPTIONS = [
  { id: 'Office Interior', label: 'Office Interior', icon: FaBuilding },
  { id: 'Home Interior', label: 'Home Interior', icon: FaHome },
  { id: 'Building Exterior & Facades', label: 'Building Exterior', icon: FaCity },
  { id: 'Corporate Event Management', label: 'Event Management', icon: FaCalendarAlt },
];

function ContactModal(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [serviceType, setServiceType] = useState("Office Interior");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);

  const clickSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !phoneNo || !interest) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please complete your contact details and message to send your inquiry.",
        confirmButtonColor: "#ff6600",
      });
      return;
    }

    setLoading(true);
    try {
      const fullMessage = `[Service Interest: ${serviceType}] ${interest}`;

      const response = await axios.post("https://3pcommunicationsserver.vercel.app/api/contact", {
        name,
        email,
        phoneNumber: phoneNo,
        message: fullMessage,
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Inquiry Sent!",
          text: "Thank you for reaching out. Our project team will connect with you promptly.",
          confirmButtonColor: "#ff6600",
        });

        setName("");
        setEmail("");
        setPhoneNo("");
        setInterest("");
        if (props.onHide) props.onHide();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "Could not send your message at this time. Please try again or reach us directly via phone.",
        confirmButtonColor: "#e53e3e",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      dialogClassName="luxury-contact-modal"
      centered
      backdrop="static"
      keyboard={true}
    >
      <div className="contact-modal-header">
        <button
          type="button"
          className="contact-modal-close-btn"
          onClick={props.onHide}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <span className="contact-modal-eyebrow">3P COMMUNICATION • INQUIRY</span>
        <h2 className="contact-modal-title">Let’s Discuss Your Project</h2>
        <p className="contact-modal-subtitle">
          Consult with our in-house team for office &amp; home interiors, building exterior facades, or corporate event management across Bangladesh.
        </p>
      </div>

      <div className="contact-modal-body">
        <form onSubmit={clickSubmit}>
          {/* Service Discipline Selector Pills */}
          <div className="contact-field-group mb-3">
            <label className="contact-field-label">
              Service Discipline <span className="text-danger">*</span>
            </label>
            <div className="modal-service-pills">
              {SERVICE_OPTIONS.map((srv) => {
                const Icon = srv.icon;
                const isSelected = serviceType === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    className={`modal-service-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => setServiceType(srv.id)}
                  >
                    <Icon className="modal-pill-icon" />
                    <span>{srv.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div className="contact-field-group">
            <label className="contact-field-label">
              <FaUser className="contact-field-icon" />
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="contact-field-input"
              placeholder="e.g. Tanvir Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email & Phone */}
          <div className="row g-2">
            <div className="col-12 col-md-6 contact-field-group">
              <label className="contact-field-label">
                <FaEnvelope className="contact-field-icon" />
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="contact-field-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-md-6 contact-field-group">
              <label className="contact-field-label">
                <FaPhoneAlt className="contact-field-icon" />
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className="contact-field-input"
                placeholder="+880 1XXX-XXXXXX"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="contact-field-group">
            <label className="contact-field-label">
              <FaCommentAlt className="contact-field-icon" />
              Project Details &amp; Requirements <span className="text-danger">*</span>
            </label>
            <textarea
              rows="3"
              className="contact-field-input"
              placeholder={`Tell us about your ${serviceType.toLowerCase()} space dimensions, location, schedule, or specific goals...`}
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="contact-modal-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>Sending Inquiry...</span>
              </>
            ) : (
              <>
                <FaPaperPlane />
                <span>Send Project Inquiry</span>
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default ContactModal;
