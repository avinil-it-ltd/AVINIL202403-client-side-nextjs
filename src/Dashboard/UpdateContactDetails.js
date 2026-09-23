'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  FaAddressBook,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
  FaSave,
  FaSyncAlt,
  FaSpinner,
  FaGlobe,
  FaExternalLinkAlt
} from 'react-icons/fa';

const API_URL = 'https://3pcommunicationsserver.vercel.app/api/myContact';

const UpdateContactDetails = () => {
  const [contactDetails, setContactDetails] = useState({
    address: '',
    mobile: '',
    email: '',
    fbLink: '',
    whatsappLink: '',
    youtubeLink: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing contact details
  const fetchContactDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data && typeof data === 'object') {
        setContactDetails({
          address: data.address || '',
          mobile: data.mobile || '',
          email: data.email || '',
          fbLink: data.fbLink || '',
          whatsappLink: data.whatsappLink || '',
          youtubeLink: data.youtubeLink || '',
        });
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await Swal.fire({
      icon: 'question',
      title: 'Update Contact Information?',
      text: 'These changes will immediately update the website footer, top menu, and contact modals.',
      showCancelButton: true,
      confirmButtonColor: '#ff6600',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Save Changes',
      cancelButtonText: 'Cancel',
      customClass: { popup: 'rounded-4' },
    });

    if (!result.isConfirmed) return;

    setIsSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactDetails),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Contact Details Updated!',
          text: 'Company contact and social media information have been saved.',
          confirmButtonColor: '#ff6600',
          customClass: { popup: 'rounded-4' },
        });
      } else {
        throw new Error('Failed to update contact details on the server.');
      }
    } catch (error) {
      console.error('Error updating contact details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Could not save contact details. Please try again.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Top Header & Breadcrumb */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 text-muted small mb-1">
            <span>Content &amp; CMS</span>
            <span>/</span>
            <span className="text-dark fw-semibold">Contact Information</span>
          </div>
          <h2 className="m-0 fw-bold">Company Contact &amp; Social Info</h2>
          <p className="text-muted small m-0 mt-1">
            Configure primary office addresses, customer support phone numbers, email, and social media channels.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={fetchContactDetails}
            disabled={isLoading}
            className="btn btn-outline-secondary rounded-3 d-inline-flex align-items-center gap-2"
          >
            <FaSyncAlt className={isLoading ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Main Form (Left 8 cols) */}
          <div className="col-12 col-xl-8">
            {/* Card 1: Core Contact Information */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaAddressBook />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">Official Headquarters &amp; Communications</h5>
                  <small className="text-muted">
                    Displayed prominently on footer strips, inquiries, and customer consultation modals
                  </small>
                </div>
              </div>

              <div className="row g-3">
                {/* Physical Office Address */}
                <div className="col-12">
                  <label className="form-label-custom">
                    Office / Studio Address <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaMapMarkerAlt className="settings-input-icon" />
                    <input
                      type="text"
                      name="address"
                      className="form-control settings-input-control"
                      value={contactDetails.address}
                      onChange={handleInputChange}
                      placeholder="e.g. House #12, Road #4, Dhanmondi, Dhaka-1209, Bangladesh"
                      required
                    />
                  </div>
                </div>

                {/* Primary Support Phone */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Primary Phone / Mobile <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaPhoneAlt className="settings-input-icon" />
                    <input
                      type="text"
                      name="mobile"
                      className="form-control settings-input-control"
                      value={contactDetails.mobile}
                      onChange={handleInputChange}
                      placeholder="+880 1711-000000"
                      required
                    />
                  </div>
                </div>

                {/* Primary Inquiries Email */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Official Inquiries Email <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaEnvelope className="settings-input-icon" />
                    <input
                      type="email"
                      name="email"
                      className="form-control settings-input-control"
                      value={contactDetails.email}
                      onChange={handleInputChange}
                      placeholder="info@3pcommunication.com"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Social Media & Messaging Channels */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaGlobe />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">Social Media &amp; Instant Messaging</h5>
                  <small className="text-muted">
                    Links for direct customer engagement across digital platforms
                  </small>
                </div>
              </div>

              <div className="row g-3">
                {/* Facebook Link */}
                <div className="col-12">
                  <label className="form-label-custom">Facebook Page / Profile URL</label>
                  <div className="settings-input-wrapper">
                    <FaFacebookF className="settings-input-icon" />
                    <input
                      type="url"
                      name="fbLink"
                      className="form-control settings-input-control"
                      value={contactDetails.fbLink}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/3pcommunication"
                    />
                  </div>
                </div>

                {/* WhatsApp Link */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">WhatsApp Direct Link / Number</label>
                  <div className="settings-input-wrapper">
                    <FaWhatsapp className="settings-input-icon" />
                    <input
                      type="text"
                      name="whatsappLink"
                      className="form-control settings-input-control"
                      value={contactDetails.whatsappLink}
                      onChange={handleInputChange}
                      placeholder="https://wa.me/8801711000000 or phone"
                    />
                  </div>
                </div>

                {/* YouTube Link */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">YouTube Channel URL</label>
                  <div className="settings-input-wrapper">
                    <FaYoutube className="settings-input-icon" />
                    <input
                      type="url"
                      name="youtubeLink"
                      className="form-control settings-input-control"
                      value={contactDetails.youtubeLink}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/@3pcommunication"
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  Double-check URLs to ensure visitor links open correctly
                </small>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn dashboard_all_button d-inline-flex align-items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="spin-icon" /> Saving Details...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Contact Details
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Website Preview & Quick Verification */}
          <div className="col-12 col-xl-4">
            {/* Live Card Preview */}
            <div className="settings-security-card">
              <h6 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
                <span>Public Display Preview</span>
                <span className="badge bg-light text-dark border">Live Data</span>
              </h6>
              <p className="small text-muted mb-3">
                Here is a preview of how your contact info renders to visitors on the website:
              </p>

              <div className="p-3 rounded-3 bg-light border mb-3">
                <div className="d-flex align-items-start gap-2 mb-2">
                  <FaMapMarkerAlt className="text-danger mt-1 flex-shrink-0" />
                  <span className="small text-dark fw-medium">
                    {contactDetails.address || 'Address not configured'}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaPhoneAlt className="text-success flex-shrink-0" />
                  <span className="small text-dark fw-medium">
                    {contactDetails.mobile || 'Phone not configured'}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaEnvelope className="text-primary flex-shrink-0" />
                  <span className="small text-dark fw-medium">
                    {contactDetails.email || 'Email not configured'}
                  </span>
                </div>
              </div>

              {/* Social Channels Preview */}
              <div className="d-flex gap-2">
                {contactDetails.fbLink && (
                  <a
                    href={contactDetails.fbLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary rounded-circle"
                    title="Facebook"
                  >
                    <FaFacebookF />
                  </a>
                )}
                {contactDetails.whatsappLink && (
                  <a
                    href={
                      contactDetails.whatsappLink.startsWith('http')
                        ? contactDetails.whatsappLink
                        : `https://wa.me/${contactDetails.whatsappLink.replace(/[^0-9]/g, '')}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-success rounded-circle"
                    title="WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                )}
                {contactDetails.youtubeLink && (
                  <a
                    href={contactDetails.youtubeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-danger rounded-circle"
                    title="YouTube"
                  >
                    <FaYoutube />
                  </a>
                )}
              </div>
            </div>

            {/* Verification Notice */}
            <div className="settings-security-card">
              <h6 className="fw-bold mb-2">Display Locations</h6>
              <ul className="small text-muted ps-3 m-0">
                <li className="mb-2">Website Main Footer Address &amp; Social links</li>
                <li className="mb-2">Header Top Bar Customer Hotline</li>
                <li className="mb-2">Automated Consultation Modal Inquiries</li>
                <li>Contact Page Map &amp; Studio Info Box</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateContactDetails;
