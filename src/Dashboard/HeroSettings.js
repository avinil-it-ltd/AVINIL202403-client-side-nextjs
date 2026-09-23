'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';
import {
  FaImages,
  FaCloudUploadAlt,
  FaCheck,
  FaUndo,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaDesktop,
  FaRulerCombined,
  FaWeightHanging,
  FaSpinner,
  FaTrash
} from 'react-icons/fa';

const DEFAULT_HERO_SETTINGS = {
  bgImage: '',
  provenance: '3P COMMUNICATION • INTERIOR & EXTERIOR DESIGN • DHAKA',
  title: 'Modern Office & Home Interior Design in Dhaka',
  subtitle: 'Complete office interiors, modern corporate workplaces, and comfortable home design — crafted with quality materials and delivered on time.',
  primaryCtaText: 'View Our Projects',
  primaryCtaLink: '#services',
  secondaryCtaText: 'Book Free Consultation',
  metric1Number: '10+ Years',
  metric1Label: 'Design Experience',
  metric2Number: '100+ Projects',
  metric2Label: 'Completed Across BD',
  metric3Number: 'In-House',
  metric3Label: 'Furniture Workshop'
};

const RECOMMENDED_LIMITS = {
  provenance: { min: 20, max: 55, ideal: '30–50 chars' },
  title: { min: 30, max: 70, ideal: '40–60 chars' },
  subtitle: { min: 100, max: 200, ideal: '130–180 chars' },
  cta: { min: 5, max: 25, ideal: '10–20 chars' },
  metricNum: { min: 3, max: 15, ideal: '4–10 chars' },
  metricLabel: { min: 5, max: 25, ideal: '10–20 chars' }
};

const HeroSettings = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(DEFAULT_HERO_SETTINGS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [detectedDimensions, setDetectedDimensions] = useState(null);
  const [fileSizeMB, setFileSizeMB] = useState(null);

  // Load saved settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('3p_hero_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.subtitle && (parsed.subtitle.includes('Turnkey') || parsed.subtitle.includes('spatial') || parsed.subtitle.includes('bespoke'))) {
            parsed.subtitle = DEFAULT_HERO_SETTINGS.subtitle;
          }
          if (parsed.provenance && parsed.provenance.includes('ATELIER')) {
            parsed.provenance = DEFAULT_HERO_SETTINGS.provenance;
          }
          if (parsed.metric1Label && parsed.metric1Label.includes('Turnkey')) {
            parsed.metric1Label = DEFAULT_HERO_SETTINGS.metric1Label;
          }
          if (parsed.metric3Label && parsed.metric3Label.includes('Joinery')) {
            parsed.metric3Label = DEFAULT_HERO_SETTINGS.metric3Label;
          }
          setFormData((prev) => ({ ...prev, ...parsed }));
          if (parsed.bgImage) {
            setImagePreview(parsed.bgImage);
          }
        }
      } catch (e) {
        console.error('Error reading hero settings:', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image change handler with dimension detection
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setFileSizeMB((file.size / (1024 * 1024)).toFixed(2));

      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      // Inspect image dimensions
      const img = new Image();
      img.onload = () => {
        setDetectedDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
          ratio: (img.naturalWidth / img.naturalHeight).toFixed(2)
        });
      };
      img.src = objectUrl;
    }
  };

  const handleResetImage = () => {
    setNewImageFile(null);
    setImagePreview('');
    setDetectedDimensions(null);
    setFileSizeMB(null);
    setFormData((prev) => ({ ...prev, bgImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', '3pcommunications');
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/avinilit/image/upload',
      data
    );
    return res.data.secure_url;
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      setIsSubmitting(true);

      let finalImageUrl = formData.bgImage;
      if (newImageFile) {
        finalImageUrl = await uploadImageToCloudinary(newImageFile);
      }

      const settingsToSave = {
        ...formData,
        bgImage: finalImageUrl
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('3p_hero_settings', JSON.stringify(settingsToSave));
        // Dispatch storage event so open tabs synchronize immediately
        window.dispatchEvent(new Event('storage'));
      }

      setFormData(settingsToSave);
      setNewImageFile(null);
      setIsSubmitting(false);

      Swal.fire({
        icon: 'success',
        title: 'Hero Banner Published!',
        text: 'Your homepage hero image, headline, and conversion copy have been updated.',
        showCancelButton: true,
        confirmButtonText: 'View Live Homepage',
        cancelButtonText: 'Stay on Page',
        confirmButtonColor: '#ff6600',
        cancelButtonColor: '#64748b',
        background: '#ffffff',
        customClass: { popup: 'rounded-4' }
      }).then((result) => {
        if (result.isConfirmed) {
          window.open('/', '_blank');
        }
      });
    } catch (err) {
      console.error('Error saving hero settings:', err);
      setIsSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Unable to upload image or save settings. Please verify network connectivity.'
      });
    }
  };

  const handleResetToFactoryDefault = () => {
    Swal.fire({
      title: 'Reset to Studio Defaults?',
      text: 'This will restore the balanced commercial & residential copy and default architectural banner.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset defaults',
      cancelButtonText: 'Keep custom',
      confirmButtonColor: '#ff6600',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('3p_hero_settings');
          window.dispatchEvent(new Event('storage'));
        }
        setFormData(DEFAULT_HERO_SETTINGS);
        setImagePreview('');
        setNewImageFile(null);
        setDetectedDimensions(null);
        setFileSizeMB(null);

        Swal.fire({
          icon: 'success',
          title: 'Defaults Restored',
          text: 'The master studio copy is now active.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Helper for character badge
  const renderCharBadge = (current, min, max, label) => {
    const isOptimal = current >= min && current <= max;
    const isOver = current > max;
    let badgeClass = 'bg-light text-muted border';
    if (isOptimal) badgeClass = 'bg-success-subtle text-success border-success';
    if (isOver) badgeClass = 'bg-danger-subtle text-danger border-danger';

    return (
      <span className={`badge ${badgeClass} font-monospace ms-auto`} style={{ fontSize: '11px' }}>
        {current} / {max} chars ({label})
      </span>
    );
  };

  return (
    <div className="hero-settings-wrapper">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="text-muted small fw-semibold d-inline-flex align-items-center gap-1 mb-1">
            <Link href="/dashboard" className="text-muted text-decoration-none">
              Dashboard
            </Link>
            <span>/</span>
            <span>Content &amp; CMS</span>
            <span>/</span>
            <span className="text-dark fw-bold">Hero Banner Settings</span>
          </div>
          <h2 className="m-0 fw-bold">Hero Showcase &amp; Typography</h2>
          <p className="text-muted small m-0 mt-1">
            Tailor homepage hero background, executive messaging, character limits, and conversion actions
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-info rounded-3 d-inline-flex align-items-center gap-2"
          >
            <FaExternalLinkAlt /> Live Homepage
          </a>
          <button
            type="button"
            onClick={handleResetToFactoryDefault}
            className="btn btn-outline-secondary rounded-3 d-inline-flex align-items-center gap-2"
            title="Restore studio master defaults"
          >
            <FaUndo /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="btn dashboard_all_button d-inline-flex align-items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="spin-icon" /> Publishing...
              </>
            ) : (
              <>
                <FaCheck /> Publish Banner
              </>
            )}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: Controls & Guidelines */}
        <div className="col-12 col-xl-7">
          {/* Card 1: Background Showcase Image */}
          <div className="project-form-card">
            <div className="project-form-header">
              <div className="project-form-icon">
                <FaImages />
              </div>
              <div>
                <h5 className="m-0 fw-bold">Hero Showcase Image</h5>
                <small className="text-muted">
                  High-resolution architectural backdrop for the homepage header
                </small>
              </div>
            </div>

            {/* Strict Image Specifications Card */}
            <div className="p-3 bg-light rounded-3 mb-3 border">
              <div className="d-flex align-items-center gap-2 mb-2 text-dark fw-bold small">
                <FaInfoCircle className="text-warning" /> Recommended Image Specifications:
              </div>
              <div className="row g-2 text-muted small">
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center gap-1">
                    <FaRulerCombined className="text-primary" />
                    <strong>Dimensions:</strong>
                  </div>
                  <div>1920 × 1080px (16:9)</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center gap-1">
                    <FaWeightHanging className="text-success" />
                    <strong>Max File Size:</strong>
                  </div>
                  <div>&lt; 2.0 MB</div>
                </div>
                <div className="col-6 col-md-3">
                  <strong>Formats:</strong>
                  <div>WEBP, JPG, PNG</div>
                </div>
                <div className="col-6 col-md-3">
                  <strong>Composition:</strong>
                  <div>Right/Center subject</div>
                </div>
              </div>
            </div>

            {/* Current Image or Upload Dropzone */}
            {imagePreview ? (
              <div className="mb-3 position-relative">
                <div
                  className="preview-image-box"
                  style={{ maxHeight: '280px', borderRadius: '10px' }}
                >
                  <img
                    src={imagePreview}
                    alt="Hero Preview"
                    style={{ maxHeight: '280px', objectFit: 'cover' }}
                  />
                  <div
                    className="position-absolute top-2 start-2 m-2 d-flex gap-2"
                  >
                    <span className="badge bg-dark bg-opacity-75 text-white">
                      {newImageFile ? 'New Selected Photo' : 'Active Saved Banner'}
                    </span>
                    {detectedDimensions && (
                      <span className="badge bg-info text-dark">
                        {detectedDimensions.width} × {detectedDimensions.height}px ({detectedDimensions.ratio}:1)
                      </span>
                    )}
                    {fileSizeMB && (
                      <span
                        className={`badge ${
                          fileSizeMB > 2.5 ? 'bg-danger' : 'bg-success'
                        }`}
                      >
                        {fileSizeMB} MB
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="preview-remove-btn"
                    title="Remove custom photo and revert to default"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ) : null}

            <div
              className="upload-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaCloudUploadAlt className="text-primary fs-2" />
              <div className="fw-semibold text-dark small">
                {imagePreview ? 'Click to Replace Hero Image' : 'Click to Upload 1920×1080 Banner'}
              </div>
              <span className="text-muted" style={{ fontSize: '11px' }}>
                Widescreen 16:9 ratio recommended (&lt; 2MB for fast mobile loading)
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="d-none"
            />
          </div>

          {/* Card 2: Typography & Character Limits */}
          <div className="project-form-card">
            <div className="project-form-header">
              <div className="project-form-icon">
                <FaDesktop />
              </div>
              <div>
                <h5 className="m-0 fw-bold">Hero Typography &amp; Messaging</h5>
                <small className="text-muted">
                  Keep copy within character targets to avoid breaking mobile font hierarchy
                </small>
              </div>
            </div>

            {/* Studio Provenance Eyebrow */}
            <div className="mb-3">
              <div className="d-flex align-items-center mb-1">
                <label className="form-label-custom m-0">Provenance Tag (Eyebrow)</label>
                {renderCharBadge(
                  formData.provenance.length,
                  RECOMMENDED_LIMITS.provenance.min,
                  RECOMMENDED_LIMITS.provenance.max,
                  RECOMMENDED_LIMITS.provenance.ideal
                )}
              </div>
              <input
                type="text"
                name="provenance"
                value={formData.provenance}
                onChange={handleChange}
                placeholder="e.g. 3P COMMUNICATION • INTERIOR & EXTERIOR DESIGN • DHAKA"
                className="form-control"
              />
            </div>

            {/* Master Headline */}
            <div className="mb-3">
              <div className="d-flex align-items-center mb-1">
                <label className="form-label-custom m-0">Hero Headline</label>
                {renderCharBadge(
                  formData.title.length,
                  RECOMMENDED_LIMITS.title.min,
                  RECOMMENDED_LIMITS.title.max,
                  RECOMMENDED_LIMITS.title.ideal
                )}
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Architecture for Living. Workplaces Crafted with Purpose."
                className="form-control form-control-lg fw-bold"
              />
              <small className="text-muted mt-1 d-block" style={{ fontSize: '11px' }}>
                💡 <em>Tip: 40–60 characters ensures two balanced lines on desktop and tablet.</em>
              </small>
            </div>

            {/* Subtitle / Lead Paragraph */}
            <div className="mb-0">
              <div className="d-flex align-items-center mb-1">
                <label className="form-label-custom m-0">Subtitle / Value Proposition</label>
                {renderCharBadge(
                  formData.subtitle.length,
                  RECOMMENDED_LIMITS.subtitle.min,
                  RECOMMENDED_LIMITS.subtitle.max,
                  RECOMMENDED_LIMITS.subtitle.ideal
                )}
              </div>
              <textarea
                name="subtitle"
                rows="3"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Describe your office and home interior services in clear, simple words..."
                className="form-control"
              ></textarea>
              <small className="text-muted mt-1 d-block" style={{ fontSize: '11px' }}>
                💡 <em>Keep under 180 characters so the primary CTA button remains above the screen fold on laptops.</em>
              </small>
            </div>
          </div>

          {/* Card 3: Call-To-Action Controls */}
          <div className="project-form-card">
            <h6 className="fw-bold mb-3 border-bottom pb-2">Hero Action Buttons</h6>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label-custom">Primary CTA Text</label>
                <input
                  type="text"
                  name="primaryCtaText"
                  value={formData.primaryCtaText}
                  onChange={handleChange}
                  placeholder="Explore Disciplines"
                  className="form-control"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label-custom">Primary CTA Link</label>
                <input
                  type="text"
                  name="primaryCtaLink"
                  value={formData.primaryCtaLink}
                  onChange={handleChange}
                  placeholder="#services or /interior"
                  className="form-control"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label-custom">Secondary CTA Text</label>
                <input
                  type="text"
                  name="secondaryCtaText"
                  value={formData.secondaryCtaText}
                  onChange={handleChange}
                  placeholder="Book Consultation"
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Specification & Credibility Strip */}
          <div className="project-form-card mb-0">
            <h6 className="fw-bold mb-3 border-bottom pb-2">Credibility Metrics Strip</h6>
            <div className="row g-3">
              {/* Metric 1 */}
              <div className="col-12 col-md-4">
                <label className="form-label-custom">Metric 1</label>
                <input
                  type="text"
                  name="metric1Number"
                  value={formData.metric1Number}
                  onChange={handleChange}
                  className="form-control mb-1 fw-bold"
                  placeholder="10+ Years"
                />
                <input
                  type="text"
                  name="metric1Label"
                  value={formData.metric1Label}
                  onChange={handleChange}
                  className="form-control form-control-sm text-muted"
                  placeholder="Design Experience"
                />
              </div>
              {/* Metric 2 */}
              <div className="col-12 col-md-4">
                <label className="form-label-custom">Metric 2</label>
                <input
                  type="text"
                  name="metric2Number"
                  value={formData.metric2Number}
                  onChange={handleChange}
                  className="form-control mb-1 fw-bold"
                  placeholder="100+ Projects"
                />
                <input
                  type="text"
                  name="metric2Label"
                  value={formData.metric2Label}
                  onChange={handleChange}
                  className="form-control form-control-sm text-muted"
                  placeholder="Completed Across BD"
                />
              </div>
              {/* Metric 3 */}
              <div className="col-12 col-md-4">
                <label className="form-label-custom">Metric 3</label>
                <input
                  type="text"
                  name="metric3Number"
                  value={formData.metric3Number}
                  onChange={handleChange}
                  className="form-control mb-1 fw-bold"
                  placeholder="In-House"
                />
                <input
                  type="text"
                  name="metric3Label"
                  value={formData.metric3Label}
                  onChange={handleChange}
                  className="form-control form-control-sm text-muted"
                  placeholder="Joinery Workshop"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Device Mockup Preview */}
        <div className="col-12 col-xl-5">
          <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden position-sticky"
            style={{ top: '24px' }}
          >
            <div className="p-3 bg-dark text-white d-flex align-items-center justify-content-between">
              <span className="fw-bold small d-inline-flex align-items-center gap-2">
                <FaDesktop className="text-warning" /> Real-Time Live Desktop Mockup
              </span>
              <span className="badge bg-secondary" style={{ fontSize: '10px' }}>
                Instant Preview
              </span>
            </div>

            {/* Mockup Screen Viewport */}
            <div
              style={{
                position: 'relative',
                minHeight: '420px',
                backgroundImage: imagePreview
                  ? `url(${imagePreview})`
                  : `url(/_next/static/media/Banner.015c7a26.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '36px 24px',
                display: 'flex',
                alignItems: 'center',
                color: '#ffffff',
                backgroundColor: '#121316'
              }}
            >
              {/* Scrim Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(14, 15, 18, 0.90) 0%, rgba(14, 15, 18, 0.80) 50%, rgba(14, 15, 18, 0.90) 100%)',
                  zIndex: 1
                }}
              />

              <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                {/* Provenance Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    marginBottom: '14px',
                    color: '#e5e7eb'
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#ff6600',
                      display: 'inline-block'
                    }}
                  ></span>
                  <span>{formData.provenance}</span>
                </div>

                {/* Master Title */}
                <h3
                  style={{
                    fontFamily: 'serif',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    marginBottom: '12px',
                    color: '#ffffff'
                  }}
                >
                  {formData.title}
                </h3>

                {/* Subtitle */}
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#cbd5e1',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                    maxWidth: '92%'
                  }}
                >
                  {formData.subtitle}
                </p>

                {/* Buttons */}
                <div className="d-flex gap-2 mb-3">
                  <span
                    className="btn btn-sm"
                    style={{
                      background: '#ff6600',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: '4px'
                    }}
                  >
                    {formData.primaryCtaText} &rarr;
                  </span>
                  <span
                    className="btn btn-sm btn-outline-light"
                    style={{ fontSize: '0.75rem', borderRadius: '4px' }}
                  >
                    {formData.secondaryCtaText}
                  </span>
                </div>

                {/* Spec Strip */}
                <div
                  className="d-flex align-items-center gap-3 pt-2"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}
                >
                  <div>
                    <strong style={{ fontSize: '0.8rem', display: 'block' }}>
                      {formData.metric1Number}
                    </strong>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      {formData.metric1Label}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '1px',
                      height: '20px',
                      background: 'rgba(255,255,255,0.2)'
                    }}
                  ></div>
                  <div>
                    <strong style={{ fontSize: '0.8rem', display: 'block' }}>
                      {formData.metric2Number}
                    </strong>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      {formData.metric2Label}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '1px',
                      height: '20px',
                      background: 'rgba(255,255,255,0.2)'
                    }}
                  ></div>
                  <div>
                    <strong style={{ fontSize: '0.8rem', display: 'block' }}>
                      {formData.metric3Number}
                    </strong>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      {formData.metric3Label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white text-muted small border-top">
              <div className="d-flex align-items-center gap-1 mb-1 text-dark fw-bold">
                <FaInfoCircle className="text-primary" /> Live Typography Verification
              </div>
              <div>
                Text updates render in real-time above. Check that your headline stays under 3 lines and that text contrast is clean over the background.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSettings;
