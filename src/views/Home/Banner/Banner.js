'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import { FaArrowRight, FaCalendarCheck } from 'react-icons/fa';
import ContactModal from '../../Contact/ContactModal';
import './Banner.css';

function Banner() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <section className="monograph-hero-section">
      {/* Background with Contrast Scrim */}
      <div className="monograph-hero-overlay" />

      <Container className="position-relative hero-content-container">
        <div className="monograph-hero-content">
          {/* Studio Provenance Tag */}
          <div className="hero-provenance-badge">
            <span className="provenance-dot"></span>
            <span>DHAKA ARCHITECTURAL ATELIER • ESTABLISHED 2014</span>
          </div>

          {/* Master Monograph Title */}
          <h1 className="hero-master-title">
            Architecture for Living. <br className="d-none d-md-inline" />
            Spaces Crafted with Purpose.
          </h1>

          {/* Subtitle */}
          <p className="hero-master-sub">
            Turnkey residential interior architecture, bespoke exterior facades, and monumental corporate stage productions engineered with honest materials and disciplined timelines.
          </p>

          {/* Dual Action CTAs */}
          <div className="hero-cta-group">
            <a href="#services" className="hero-primary-cta">
              <span>Explore Disciplines</span>
              <FaArrowRight className="cta-arrow" />
            </a>

            <button 
              type="button" 
              className="hero-secondary-cta"
              onClick={() => setModalShow(true)}
            >
              <FaCalendarCheck />
              <span>Book Consultation</span>
            </button>
          </div>

          {/* Studio Credibility Strip */}
          <div className="hero-spec-strip">
            <div className="hero-spec-item">
              <span className="spec-metric">10+ Years</span>
              <span className="spec-label">Turnkey Delivery</span>
            </div>
            <div className="hero-spec-divider"></div>
            <div className="hero-spec-item">
              <span className="spec-metric">100+ Projects</span>
              <span className="spec-label">Completed Across BD</span>
            </div>
            <div className="hero-spec-divider"></div>
            <div className="hero-spec-item">
              <span className="spec-metric">In-House</span>
              <span className="spec-label">Joinery Workshop</span>
            </div>
          </div>
        </div>
      </Container>

      {/* Global Consultation Modal */}
      <ContactModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </section>
  );
}

export default Banner;
