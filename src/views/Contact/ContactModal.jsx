'use client';

import React, { useState } from "react";
import axios from "axios";
import { Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaPhoneAlt, FaCommentAlt, FaPaperPlane, FaTimes } from "react-icons/fa";
import "./ContactModal.css";

function ContactModal(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);

  const clickSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !phoneNo || !interest) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please complete all fields to send your inquiry.",
        confirmButtonColor: "#ff6600",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://3pcommunicationsserver.vercel.app/api/contact", {
        name,
        email,
        phoneNumber: phoneNo,
        message: interest,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Inquiry Sent!",
          text: "Thank you for reaching out. Our design consultants will connect with you promptly.",
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
        text: "Could not send your message at this time. Please try again.",
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
        <span className="contact-modal-eyebrow">Start a Conversation</span>
        <h2 className="contact-modal-title">Let’s Design Your Vision</h2>
        <p className="contact-modal-subtitle">
          Share your interior or exterior project requirements with our specialized design team.
        </p>
      </div>

      <div className="contact-modal-body">
        <form onSubmit={clickSubmit}>
          <div className="contact-field-group">
            <label className="contact-field-label">
              <FaUser className="contact-field-icon" />
              Full Name
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

          <div className="row">
            <div className="col-12 col-md-6 contact-field-group">
              <label className="contact-field-label">
                <FaEnvelope className="contact-field-icon" />
                Email Address
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
                Phone Number
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

          <div className="contact-field-group">
            <label className="contact-field-label">
              <FaCommentAlt className="contact-field-icon" />
              Project Details & Message
            </label>
            <textarea
              rows="4"
              className="contact-field-input"
              placeholder="Tell us about your space, dimensions, timeline, or design goals..."
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
                <span>Send Inquiry</span>
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default ContactModal;
