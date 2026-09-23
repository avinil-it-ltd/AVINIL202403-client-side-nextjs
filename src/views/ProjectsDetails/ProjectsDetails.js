'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaExpand, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight, 
  FaStar, 
  FaMapMarkerAlt, 
  FaRulerCombined, 
  FaCalendarAlt, 
  FaLayerGroup, 
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

import TopMenu from '../../core/TopMenu';
import Footer from '../../core/Footer';
import ContactInfo from '../Home/ContactInfo/ContactInfo';
import ContactModal from '../Contact/ContactModal';
import './ProjectsDetails.css';

function ProjectsDetails() {
  const params = useParams();
  const id = params?.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`https://3pcommunicationsserver.vercel.app/api/projects/${id}`);
        if (response.data && response.data.project) {
          setProject(response.data.project);
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // Consolidate all project photos into a deduplicated list
  const allImages = useMemo(() => {
    if (!project) return [];
    const images = [];
    if (project.mainImage) images.push(project.mainImage);
    if (Array.isArray(project.additionalImages)) {
      project.additionalImages.forEach(img => {
        if (img && !images.includes(img)) images.push(img);
      });
    }
    return images;
  }, [project]);

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextLightboxImg = useCallback(() => {
    if (allImages.length === 0) return;
    setLightboxIndex(prev => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevLightboxImg = useCallback(() => {
    if (allImages.length === 0) return;
    setLightboxIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImg();
      if (e.key === 'ArrowLeft') prevLightboxImg();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextLightboxImg, prevLightboxImg]);

  // Main stage carousel arrows
  const nextHeroImg = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % allImages.length);
  };

  const prevHeroImg = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  // Back link category destination
  const backRoute = useMemo(() => {
    const cat = (project?.category || '').toLowerCase();
    if (cat.includes('exterior')) return { label: 'Exterior Design', href: '/exterior' };
    if (cat.includes('event')) return { label: 'Event & Stage Design', href: '/event' };
    return { label: 'Interior Design', href: '/interior' };
  }, [project?.category]);

  // Format dates cleanly
  const formatPeriod = (start, end) => {
    if (!start && !end) return 'Completed Project';
    try {
      const s = start ? new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      const e = end ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
      return s ? `${s} — ${e}` : e;
    } catch {
      return 'Completed Project';
    }
  };

  if (loading) {
    return (
      <div className="project-details-root">
        <TopMenu />
        <Container className="text-center py-5 my-5">
          <Spinner animation="border" variant="warning" className="mb-3" />
          <p className="text-muted">Loading project details...</p>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-root">
        <TopMenu />
        <Container className="text-center py-5 my-5">
          <h2 className="mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Project Not Found</h2>
          <p className="text-muted mb-4">The project you are looking for may have been moved or is no longer available.</p>
          <Link href="/interior" className="btn btn-outline-dark px-4 py-2">
            Return to Portfolio
          </Link>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="project-details-root">
      <TopMenu />

      {/* --------------------------------------------------------------------
          Header: Clean Navigation & Project Title
          -------------------------------------------------------------------- */}
      <section className="project-header-container">
        <Container>
          {/* Top navigation row: Back button on LEFT, Category pill on RIGHT (Never overlap) */}
          <div className="project-top-nav-bar">
            <Link href={backRoute.href} className="project-back-btn">
              <FaArrowLeft className="project-back-arrow" />
              <span>Back to {backRoute.label}</span>
            </Link>

            <div className="project-category-tag">
              <span>{project.category || 'Interior Design'}</span>
              {project.subcategory && <span>• {project.subcategory}</span>}
            </div>
          </div>

          <h1 className="project-master-heading">
            {project.title || 'Untitled Project'}
          </h1>

          {project.address && (
            <div className="project-location-strip">
              <FaMapMarkerAlt className="project-location-icon" />
              <span>{project.address}</span>
            </div>
          )}
        </Container>
      </section>

      {/* --------------------------------------------------------------------
          Modern Interactive Gallery: Main Stage Showcase & Thumbnail Switcher
          -------------------------------------------------------------------- */}
      {allImages.length > 0 && (
        <section className="project-gallery-wrapper">
          <Container>
            {/* Featured Main Viewport */}
            <div 
              className="gallery-main-stage"
              onClick={() => openLightbox(activeImageIndex)}
              title="Click to expand fullscreen"
            >
              <img 
                src={allImages[activeImageIndex]} 
                alt={`${project.title} - View ${activeImageIndex + 1}`}
                className="stage-main-image"
              />

              {/* Floating Expand Hint */}
              <div className="stage-expand-hint">
                <FaExpand />
                <span>Click to Expand</span>
              </div>

              {/* Photo Index Counter */}
              <div className="stage-counter-pill">
                {String(activeImageIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')} PHOTOS
              </div>

              {/* Floating Previous & Next Chevrons */}
              {allImages.length > 1 && (
                <>
                  <button 
                    type="button"
                    className="stage-nav-arrow arrow-prev" 
                    onClick={prevHeroImg}
                    aria-label="Previous photograph"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    type="button"
                    className="stage-nav-arrow arrow-next" 
                    onClick={nextHeroImg}
                    aria-label="Next photograph"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {/* Synchronized Thumbnails Strip */}
            {allImages.length > 1 && (
              <div className="gallery-thumbs-row">
                {allImages.map((imgUrl, idx) => (
                  <div 
                    key={idx}
                    className={`gallery-thumb-item ${idx === activeImageIndex ? 'active-thumb' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    title={`View photo ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Architectural Photo Lookbook Grid */}
            {allImages.length > 2 && (
              <div className="lookbook-grid-section">
                <div className="lookbook-grid-heading">
                  <span>Project Photo Plates</span>
                  <span className="text-muted" style={{ fontSize: '0.85rem', fontFamily: 'var(--font-jakarta)' }}>
                    {allImages.length} Curated Images
                  </span>
                </div>

                <div className="lookbook-grid">
                  {allImages.map((imgUrl, idx) => (
                    <div 
                      key={idx}
                      className="lookbook-card"
                      onClick={() => openLightbox(idx)}
                      title={`View Plate ${idx + 1}`}
                    >
                      <img src={imgUrl} alt={`${project.title} Plate ${idx + 1}`} />
                      <div className="lookbook-card-overlay">
                        <span className="lookbook-card-tag">
                          PLATE #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="lookbook-zoom-btn">
                          <FaExpand />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* --------------------------------------------------------------------
          Project Narrative & Specifications Section
          -------------------------------------------------------------------- */}
      <section className="project-content-section">
        <Container>
          <Row className="g-5">
            {/* Left: Narrative & Case Study Content */}
            <Col lg={8}>
              <span className="narrative-eyebrow">01 / PROJECT DETAILS &amp; OVERVIEW</span>
              <h2 className="narrative-heading">Project Overview</h2>

              {project.description ? (
                <div 
                  className="narrative-body-text"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : (
                <div className="narrative-body-text">
                  <p>
                    Designed and completed by 3P Communication, this project combines practical room layouts, quality materials, and clean finishing.
                  </p>
                  <p>
                    Every detail — from custom furniture and wall finishes to lighting — was planned carefully to make the space comfortable, functional, and finished on time.
                  </p>
                </div>
              )}

              {/* Client Testimonial Endorsement (If available) */}
              {project.review && (project.review.comment || project.review.rating) && (
                <div className="project-review-wrap">
                  <span className="review-eyebrow">02 / CLIENT ENDORSEMENT</span>
                  
                  {project.review.rating && (
                    <div className="review-stars">
                      {Array.from({ length: Math.min(5, Math.max(1, project.review.rating)) }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  )}

                  <blockquote className="review-quote-content">
                    "{project.review.comment || 'Outstanding work delivered with great care and attention to detail.'}"
                  </blockquote>

                  <div className="review-client-footer">
                    <div>
                      <div className="review-client-name">
                        {project.client?.name || 'Verified Client'}
                      </div>
                      <div className="review-client-role">
                        {project.title} • {project.category || 'Completed Project'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Col>

            {/* Right: Specifications & Inquiries Sidebar */}
            <Col lg={4}>
              <div className="sticky-top" style={{ top: '100px' }}>
                {/* Specifications Card */}
                <div className="specs-card-box">
                  <h3 className="specs-card-title">Project Specifications</h3>
                  <div className="specs-list">
                    {project.client?.name && (
                      <div className="specs-row">
                        <span className="specs-key">Client</span>
                        <span className="specs-val">{project.client.name}</span>
                      </div>
                    )}

                    <div className="specs-row">
                      <span className="specs-key">
                        <FaLayerGroup /> Category
                      </span>
                      <span className="specs-val">
                        {project.category || 'Interior Design'}
                        {project.subcategory ? ` (${project.subcategory})` : ''}
                      </span>
                    </div>

                    <div className="specs-row">
                      <span className="specs-key">
                        <FaMapMarkerAlt /> Location
                      </span>
                      <span className="specs-val">{project.address || 'Dhaka, Bangladesh'}</span>
                    </div>

                    <div className="specs-row">
                      <span className="specs-key">
                        <FaRulerCombined /> Scope
                      </span>
                      <span className="specs-val">{project.areaSize || 'Full Project'}</span>
                    </div>

                    <div className="specs-row">
                      <span className="specs-key">
                        <FaCalendarAlt /> Timeline
                      </span>
                      <span className="specs-val">{formatPeriod(project.startDate, project.endDate)}</span>
                    </div>

                    <div className="specs-row">
                      <span className="specs-key">
                        <FaCheckCircle /> Status
                      </span>
                      <span className="specs-val">
                        <span className={`specs-status-tag status-${(project.status || 'completed').toLowerCase()}`}>
                          {project.status || 'Delivered'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Commission CTA Card */}
                <div className="commission-card-box">
                  <h4 className="commission-title">Start Your Project</h4>
                  <p className="commission-desc">
                    Looking for a similar design for your office or home? Contact our design team for a consultation and free estimate.
                  </p>
                  <button 
                    type="button" 
                    className="commission-btn"
                    onClick={() => setModalShow(true)}
                  >
                    <span>Book a Consultation</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Atelier Contact Line Strip */}
      <ContactInfo />

      {/* --------------------------------------------------------------------
          Modern Fullscreen Architectural Lightbox
          Strictly ZERO Download Button
          -------------------------------------------------------------------- */}
      {lightboxOpen && allImages.length > 0 && (
        <div 
          className="bespoke-lightbox-backdrop"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Header Bar: Project Title, Counter, and Close Button */}
          <div className="lightbox-header-bar" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-center">
              <span className="lightbox-title-text">{project.title}</span>
              <span className="lightbox-counter-badge">
                {String(lightboxIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
              </span>
            </div>

            <button 
              type="button" 
              className="lightbox-exit-btn" 
              onClick={closeLightbox}
              aria-label="Close fullscreen view"
            >
              <FaTimes />
            </button>
          </div>

          {/* Central Fullscreen Image Stage with Left / Right Chevrons */}
          <div className="lightbox-image-stage" onClick={(e) => e.stopPropagation()}>
            <img 
              src={allImages[lightboxIndex]} 
              alt={`${project.title} view ${lightboxIndex + 1}`}
              className="lightbox-full-img"
            />

            {allImages.length > 1 && (
              <>
                <button 
                  type="button" 
                  className="lightbox-arrow-btn btn-prev" 
                  onClick={prevLightboxImg}
                  aria-label="Previous photograph"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  type="button" 
                  className="lightbox-arrow-btn btn-next" 
                  onClick={nextLightboxImg}
                  aria-label="Next photograph"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Bottom Miniature Preview Strip */}
          {allImages.length > 1 && (
            <div className="lightbox-footer-strip" onClick={(e) => e.stopPropagation()}>
              {allImages.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  className={`lightbox-footer-thumb ${idx === lightboxIndex ? 'active-footer-thumb' : ''}`}
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book Consultation Modal */}
      <ContactModal 
        show={modalShow} 
        onHide={() => setModalShow(false)} 
      />

      <Footer />
    </div>
  );
}

export default ProjectsDetails;
