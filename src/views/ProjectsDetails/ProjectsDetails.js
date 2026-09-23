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
  FaThLarge, 
  FaImage, 
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
  const [viewMode, setViewMode] = useState('cinematic'); // 'cinematic' | 'grid'
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

  // Consolidate all project photos deduplicated
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

  // Lightbox navigation
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
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

  // Navigation arrows for cinematic hero
  const nextHeroImg = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % allImages.length);
  };

  const prevHeroImg = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  // Back link category determination
  const backRoute = useMemo(() => {
    const cat = (project?.category || '').toLowerCase();
    if (cat.includes('exterior')) return { label: 'Exterior Architecture', href: '/exterior' };
    if (cat.includes('event')) return { label: 'Event Scenography', href: '/event' };
    return { label: 'Interior Architecture', href: '/interior' };
  }, [project?.category]);

  // Format dates cleanly
  const formatPeriod = (start, end) => {
    if (!start && !end) return 'Turnkey Commission';
    try {
      const s = start ? new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      const e = end ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
      return s ? `${s} — ${e}` : e;
    } catch {
      return 'Turnkey Commission';
    }
  };

  if (loading) {
    return (
      <div className="project-details-root">
        <TopMenu />
        <Container className="text-center py-5 my-5">
          <Spinner animation="border" variant="warning" className="mb-3" />
          <p className="text-muted">Loading architectural archive monograph...</p>
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
          <h2 className="mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Project Not Located</h2>
          <p className="text-muted mb-4">The architectural monograph you are seeking may have been archived or reassigned.</p>
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
          Monograph Header & Architectural Spec Matrix
          -------------------------------------------------------------------- */}
      <section className="project-header-section">
        <Container>
          <Link href={backRoute.href} className="project-breadcrumb">
            <FaArrowLeft />
            <span>Back to {backRoute.label}</span>
          </Link>

          <div className="project-discipline-badge">
            <span>{project.category || 'Architectural Design'}</span>
            {project.subcategory && <span>• {project.subcategory}</span>}
          </div>

          <h1 className="project-master-title">
            {project.title || 'Untitled Commission'}
          </h1>

          {/* Architectural Spec Matrix */}
          <div className="project-spec-matrix">
            <div className="spec-cell">
              <span className="spec-cell-label">
                <FaMapMarkerAlt /> Location
              </span>
              <span className="spec-cell-value">{project.address || 'Dhaka, Bangladesh'}</span>
            </div>

            <div className="spec-cell">
              <span className="spec-cell-label">
                <FaRulerCombined /> Spatial Scope
              </span>
              <span className="spec-cell-value">{project.areaSize || 'Turnkey Scale'}</span>
            </div>

            <div className="spec-cell">
              <span className="spec-cell-label">
                <FaLayerGroup /> Discipline
              </span>
              <span className="spec-cell-value">
                {project.category || 'Architecture'} {project.subcategory ? `(${project.subcategory})` : ''}
              </span>
            </div>

            <div className="spec-cell">
              <span className="spec-cell-label">
                <FaCalendarAlt /> Timeline
              </span>
              <span className="spec-cell-value">
                {formatPeriod(project.startDate, project.endDate)}
              </span>
            </div>

            <div className="spec-cell">
              <span className="spec-cell-label">
                <FaCheckCircle /> Status
              </span>
              <div className="mt-1">
                <span className={`spec-status-pill status-${(project.status || 'completed').toLowerCase()}`}>
                  {project.status || 'Completed'}
                </span>
              </div>
            </div>

            {project.client?.name && (
              <div className="spec-cell">
                <span className="spec-cell-label">Commissioned By</span>
                <span className="spec-cell-value">{project.client.name}</span>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------------------
          Modern Interactive Gallery & View Mode Switcher
          -------------------------------------------------------------------- */}
      <section className="project-gallery-section">
        <Container>
          <div className="gallery-top-bar">
            <div className="gallery-section-label">
              <span>Architectural Photography</span>
              <span className="gallery-counter-tag">
                {allImages.length} Photographs
              </span>
            </div>

            {/* View Mode Switcher (Cinematic vs Grid) */}
            <div className="gallery-view-switcher">
              <button 
                type="button" 
                className={`view-switch-btn ${viewMode === 'cinematic' ? 'active-view' : ''}`}
                onClick={() => setViewMode('cinematic')}
                aria-label="Switch to Cinematic View"
              >
                <FaImage />
                <span>Cinematic View</span>
              </button>
              <button 
                type="button" 
                className={`view-switch-btn ${viewMode === 'grid' ? 'active-view' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Switch to Grid Gallery"
              >
                <FaThLarge />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: Cinematic Hero + Thumbnail Strip */}
          {viewMode === 'cinematic' && allImages.length > 0 && (
            <div className="cinematic-gallery-container">
              {/* Featured Large Viewport */}
              <div 
                className="cinematic-hero-viewport"
                onClick={() => openLightbox(activeImageIndex)}
                title="Click to expand fullscreen"
              >
                <img 
                  src={allImages[activeImageIndex]} 
                  alt={`${project.title} - View ${activeImageIndex + 1}`}
                  className="cinematic-hero-img"
                />

                <div className="hero-expand-badge">
                  <FaExpand />
                  <span>Click to Expand</span>
                </div>

                <div className="hero-index-pill">
                  {String(activeImageIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')} PHOTOGRAPHS
                </div>

                {/* Floating Previous & Next Chevrons */}
                {allImages.length > 1 && (
                  <>
                    <button 
                      type="button"
                      className="hero-nav-arrow arrow-prev" 
                      onClick={prevHeroImg}
                      aria-label="Previous photograph"
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      type="button"
                      className="hero-nav-arrow arrow-next" 
                      onClick={nextHeroImg}
                      aria-label="Next photograph"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              {/* Synchronized Thumbnail Carousel Strip */}
              {allImages.length > 1 && (
                <div className="cinematic-thumbs-strip">
                  {allImages.map((imgUrl, idx) => (
                    <div 
                      key={idx}
                      className={`cinematic-thumb-card ${idx === activeImageIndex ? 'active-thumb' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                      title={`View photo ${idx + 1}`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: Multi-Column Architectural Gallery Grid */}
          {viewMode === 'grid' && (
            <div className="project-gallery-grid">
              {allImages.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  className="grid-photo-card"
                  onClick={() => openLightbox(idx)}
                  title="Click to view photograph"
                >
                  <img src={imgUrl} alt={`${project.title} - ${idx + 1}`} />
                  <div className="grid-photo-overlay">
                    <span className="grid-photo-counter">
                      PLATE #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="grid-photo-zoom-icon">
                      <FaExpand />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* --------------------------------------------------------------------
          Architectural Narrative & Case Study Content
          -------------------------------------------------------------------- */}
      <section className="project-narrative-section">
        <Container>
          <Row className="g-5">
            <Col lg={8}>
              <span className="narrative-headline-eyebrow">01 / DESIGN BRIEF & SPATIAL EXECUTION</span>
              <h2 className="narrative-headline-title">Architectural Narrative</h2>

              {project.description ? (
                <div 
                  className="narrative-body-content"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : (
                <div className="narrative-body-content">
                  <p>
                    Commissioned as a bespoke spatial environment by 3P Communication, this project represents our disciplined methodology of combining material honesty, ergonomic spatial flow, and enduring architectural craftsmanship.
                  </p>
                  <p>
                    Every junction, millwork profile, and lighting axis was calibrated to elevate the human experience within the space while adhering to turnkey delivery schedules.
                  </p>
                </div>
              )}
            </Col>

            {/* Side Action Column */}
            <Col lg={4}>
              <div className="project-inquiry-card">
                <h3 className="inquiry-card-title">Commission a Space</h3>
                <p className="inquiry-card-desc">
                  Planning an interior renovation, corporate fitout, or exterior facade? Our studio directors are available for site inspections and design consultations.
                </p>
                <button 
                  type="button" 
                  className="inquiry-action-btn"
                  onClick={() => setModalShow(true)}
                >
                  <span>Book Atelier Consultation</span>
                  <FaArrowRight />
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --------------------------------------------------------------------
          Client Testimonial Endorsement (If available)
          -------------------------------------------------------------------- */}
      {project.review && (project.review.comment || project.review.rating) && (
        <section className="project-review-section">
          <Container>
            <div className="project-testimonial-card">
              <span className="testimonial-eyebrow">02 / CLIENT ENDORSEMENT</span>
              
              {project.review.rating && (
                <div className="testimonial-stars-row">
                  {Array.from({ length: Math.min(5, Math.max(1, project.review.rating)) }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              )}

              <blockquote className="testimonial-quote-text">
                "{project.review.comment || 'Outstanding spatial transformation delivered with professional rigor.'}"
              </blockquote>

              <div className="testimonial-client-signature">
                <div>
                  <div className="client-signature-name">
                    {project.client?.name || 'Verified Client'}
                  </div>
                  <div className="client-signature-meta">
                    {project.title} • {project.category || 'Turnkey Project'}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Direct Atelier Contact Strip */}
      <ContactInfo />

      {/* --------------------------------------------------------------------
          Modern Fullscreen Architectural Lightbox
          Strictly NO download button
          -------------------------------------------------------------------- */}
      {lightboxOpen && allImages.length > 0 && (
        <div 
          className="architectural-lightbox-backdrop"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar with Title, Counter and Clean Close Button */}
          <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-center">
              <span className="lightbox-meta-title">{project.title}</span>
              <span className="lightbox-index-badge">
                {String(lightboxIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
              </span>
            </div>

            <button 
              type="button" 
              className="lightbox-close-btn" 
              onClick={closeLightbox}
              aria-label="Close fullscreen lightbox"
            >
              <FaTimes />
            </button>
          </div>

          {/* Central Image Viewport with Previous / Next Arrows */}
          <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <img 
              src={allImages[lightboxIndex]} 
              alt={`${project.title} photograph ${lightboxIndex + 1}`}
              className="lightbox-img"
            />

            {allImages.length > 1 && (
              <>
                <button 
                  type="button" 
                  className="lightbox-nav-arrow arrow-prev" 
                  onClick={prevLightboxImg}
                  aria-label="Previous photograph"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  type="button" 
                  className="lightbox-nav-arrow arrow-next" 
                  onClick={nextLightboxImg}
                  aria-label="Next photograph"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Bottom Miniature Preview Strip for Quick Navigation */}
          {allImages.length > 1 && (
            <div className="lightbox-bottom-strip" onClick={(e) => e.stopPropagation()}>
              {allImages.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  className={`lightbox-mini-thumb ${idx === lightboxIndex ? 'active-mini' : ''}`}
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
