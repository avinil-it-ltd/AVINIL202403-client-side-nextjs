'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import { FaArrowRight, FaCalendarCheck } from 'react-icons/fa';
import ContactModal from '../../Contact/ContactModal';
import './Banner.css';

const DEFAULT_HERO = {
  bgImage: '',
  provenance: 'DHAKA ARCHITECTURAL ATELIER • COMMERCIAL & RESIDENTIAL',
  title: 'Architecture for Living. Workplaces Crafted with Purpose.',
  subtitle: 'Turnkey corporate office interiors, bespoke executive headquarters, and luxury residential living spaces engineered with ergonomic spatial flow, acoustic zoning, and disciplined timelines.',
  primaryCtaText: 'Explore Disciplines',
  primaryCtaLink: '#services',
  secondaryCtaText: 'Book Consultation',
  metric1Number: '10+ Years',
  metric1Label: 'Turnkey Delivery',
  metric2Number: '100+ Projects',
  metric2Label: 'Completed Across BD',
  metric3Number: 'In-House',
  metric3Label: 'Joinery Workshop'
};

function Banner() {
  const [modalShow, setModalShow] = useState(false);
  const [heroData, setHeroData] = useState(DEFAULT_HERO);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('3p_hero_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setHeroData((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error('Failed reading hero settings from storage:', err);
      }
    }
  }, []);

  return (
    <section 
      className="monograph-hero-section"
      style={heroData.bgImage ? { backgroundImage: `url(${heroData.bgImage})` } : undefined}
    >
      {/* Background with Contrast Scrim */}
      <div className="monograph-hero-overlay" />

      <Container className="position-relative hero-content-container">
        <div className="monograph-hero-content">
          {/* Studio Provenance Tag */}
          <div className="hero-provenance-badge">
            <span className="provenance-dot"></span>
            <span>{heroData.provenance}</span>
          </div>

          {/* Master Monograph Title */}
          <h1 className="hero-master-title">
            {heroData.title}
          </h1>

          {/* Subtitle */}
          <p className="hero-master-sub">
            {heroData.subtitle}
          </p>

          {/* Dual Action CTAs */}
          <div className="hero-cta-group">
            <a href={heroData.primaryCtaLink || '#services'} className="hero-primary-cta">
              <span>{heroData.primaryCtaText}</span>
              <FaArrowRight className="cta-arrow" />
            </a>

            <button 
              type="button" 
              className="hero-secondary-cta"
              onClick={() => setModalShow(true)}
            >
              <FaCalendarCheck />
              <span>{heroData.secondaryCtaText}</span>
            </button>
          </div>

          {/* Studio Credibility Strip */}
          <div className="hero-spec-strip">
            <div className="hero-spec-item">
              <span className="spec-metric">{heroData.metric1Number}</span>
              <span className="spec-label">{heroData.metric1Label}</span>
            </div>
            <div className="hero-spec-divider"></div>
            <div className="hero-spec-item">
              <span className="spec-metric">{heroData.metric2Number}</span>
              <span className="spec-label">{heroData.metric2Label}</span>
            </div>
            <div className="hero-spec-divider"></div>
            <div className="hero-spec-item">
              <span className="spec-metric">{heroData.metric3Number}</span>
              <span className="spec-label">{heroData.metric3Label}</span>
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

