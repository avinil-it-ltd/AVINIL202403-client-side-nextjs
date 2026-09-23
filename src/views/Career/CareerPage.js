'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TopMenu from '../../core/TopMenu';
import Footer from '../../core/Footer';
import {
  FaArrowRight,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt
} from 'react-icons/fa';
import studioPhoto from '../../assets/images/interiorPage/feature-ergonomic-spaces.jpg';
import './CSS/CareerPage.css';

const MANIFESTO = [
  {
    index: "01 / QUALITY MATERIALS",
    title: "Materials Over Gimmicks",
    body: "We design for real people, natural daylight, comfortable acoustics, and lasting physical durability — not just nice 3D renders."
  },
  {
    index: "02 / REAL PROJECT EXPERIENCE",
    title: "From Sketch to Handover",
    body: "Our designers don't just sit behind desks. You work directly with master carpenters, metal fabricators, and site engineers on live construction sites."
  },
  {
    index: "03 / AUTHENTIC GROWTH",
    title: "Mentorship & Direct Voice",
    body: "You will collaborate shoulder-to-shoulder with our principal leads. Good ideas win, credit is shared openly, and craft is rewarded."
  }
];

const CareerPage = () => {
  const [careers, setCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch('https://3pcommunicationsserver.vercel.app/api/careers');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCareers(data);
          }
        }
      } catch (error) {
        console.error('Error fetching careers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const activeCareers = careers.filter((career) => career.status);

  const filteredCareers = activeCareers.filter((career) => {
    const query = searchTerm.toLowerCase();
    const titleMatch = career.title?.toLowerCase().includes(query);
    const descMatch = career.description?.toLowerCase().includes(query);
    const locMatch = Array.isArray(career.location)
      ? career.location.some(l => l.toLowerCase().includes(query))
      : career.location?.toLowerCase().includes(query);
    return titleMatch || descMatch || locMatch;
  });

  return (
    <div className="career-page-wrapper">
      <TopMenu />

      {/* Editorial Split Hero */}
      <section className="career-editorial-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left: Manifesto Headline */}
            <div className="col-12 col-lg-7">
              <div className="hero-micro-label">
                3P Communication &bull; Careers &bull; Dhaka
              </div>
              <h1 className="hero-editorial-headline">
                Crafting Spaces That Endure.
              </h1>
              <p className="hero-editorial-subtext">
                We are building a talented team of interior designers, 3D visualizers, and site supervisors who take genuine pride in craftsmanship, quality materials, and great spaces.
              </p>
              <div className="hero-telemetry-strip">
                <div className="telemetry-item">
                  <FaMapMarkerAlt className="text-secondary" />
                  <span>Studio: <strong>Mohammadpur, Dhaka</strong></span>
                </div>
                <div className="telemetry-item">
                  <span>Practice: <strong>Interior &bull; Exterior &bull; Events</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Authentic Studio Frame */}
            <div className="col-12 col-lg-5">
              <div className="hero-visual-frame">
                <img
                  src={studioPhoto?.src || studioPhoto}
                  alt="3P Communication Design Office"
                  className="hero-visual-img"
                />
                <div className="hero-visual-caption">
                  <div>
                    <p className="caption-label">Studio Practice &amp; Detail Fabrication</p>
                    <span className="caption-spec">Asad Gate, Dhaka &bull; Since 2014</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Principles (3-Column Editorial Strip) */}
      <section className="career-manifesto-section">
        <div className="container">
          <div className="manifesto-header">
            <span className="manifesto-section-num">Our Working Ethos</span>
            <h2 className="manifesto-main-title">How We Practice Architecture &amp; Design</h2>
          </div>

          <div className="manifesto-grid">
            {MANIFESTO.map((item, idx) => (
              <div key={idx} className="manifesto-column">
                <span className="manifesto-index">{item.index}</span>
                <h3 className="manifesto-title">{item.title}</h3>
                <p className="manifesto-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Positions Directory */}
      <section className="career-directory-section">
        <div className="container">
          <div className="directory-header-row">
            <div>
              <span className="manifesto-section-num">Available Opportunities</span>
              <h2 className="directory-title">Open Positions</h2>
            </div>
            <div>
              <input
                type="text"
                placeholder="Filter by role or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="directory-search-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading opportunities...</span>
              </div>
            </div>
          ) : filteredCareers.length > 0 ? (
            <div className="directory-list">
              {filteredCareers.map((career) => {
                const locationText = Array.isArray(career.location)
                  ? career.location.join(', ')
                  : (career.location || 'Mohammadpur, Dhaka');

                return (
                  <Link
                    key={career._id}
                    href={`/applyCareer/${career._id}`}
                    className="directory-row"
                  >
                    <div className="row-primary-cell">
                      <h3 className="row-job-title">{career.title}</h3>
                      <span className="row-job-category">
                        {career.employmentStatus || 'Full-Time'} &bull; Interior &amp; Exterior Design
                      </span>
                    </div>

                    <div className="row-spec-cell">
                      <div><strong>Location:</strong> {locationText}</div>
                      <div><strong>Experience:</strong> {career.experience || '2+ Years'}</div>
                    </div>

                    <div className="row-meta-cell">
                      <div><strong>Vacancy:</strong> {career.vacancy || '1'} Position</div>
                      <div><strong>Remuneration:</strong> {career.salary || 'Negotiable'}</div>
                    </div>

                    <div className="row-action-cell">
                      <span className="row-apply-link">
                        View Role ↗
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-5 text-center bg-white border rounded">
              <h4 className="fw-bold mb-2">No Active Openings Matching "{searchTerm}"</h4>
              <p className="text-muted mb-0">Check back soon or send us an open portfolio submission below.</p>
            </div>
          )}

          {/* Open Talent Submission Card */}
          <div className="open-talent-card">
            <div>
              <div className="open-talent-label">Spontaneous Applications</div>
              <h3 className="open-talent-title">Don't See Your Exact Discipline?</h3>
              <p className="open-talent-desc">
                We are always eager to meet exceptional 3D visualizers, draftsmen, site engineers, and event producers. Send your portfolio and CV directly to our creative directors.
              </p>
            </div>
            <div className="open-talent-cta">
              <a href="mailto:3pcommunication@gmail.com?subject=Open%20Application%20-%20Design%20Portfolio" className="talent-btn-primary">
                <FaEnvelope />
                <span>Submit Portfolio</span>
              </a>
              <a href="https://wa.me/+8801722728272" target="_blank" rel="noopener noreferrer" className="talent-btn-secondary">
                <FaWhatsapp />
                <span>Direct WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareerPage;
