'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  FaBuilding,
  FaImages,
  FaCloudUploadAlt,
  FaTrash,
  FaCalendarAlt,
  FaUser,
  FaStar,
  FaArrowLeft,
  FaCheck,
  FaMapMarkerAlt,
  FaDollarSign,
  FaRulerCombined,
  FaAlignLeft,
  FaSpinner,
  FaExternalLinkAlt,
  FaLayerGroup,
  FaUndo
} from 'react-icons/fa';
import ReactQuill from '../Components/ReactQuillWrapper';

const UpdateProject = ({ projectId }) => {
  const router = useRouter();
  const nextParams = useParams();
  const id = projectId || nextParams?.id;

  const mainFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  // Loading & Submission states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Categories & Subcategories
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Project data state
  const [project, setProject] = useState({
    title: '',
    category: '',
    subcategory: '',
    client: {
      name: '',
      email: '',
      phone: ''
    },
    review: {
      rating: 5,
      comment: ''
    },
    startDate: '',
    endDate: '',
    description: '',
    mainImage: '',
    additionalImages: [],
    address: '',
    budget: '',
    areaSize: '',
    status: 'pending'
  });

  // Media Management states
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [newMainImageFile, setNewMainImageFile] = useState(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  // Fetch Project and Category Data
  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projRes, catRes] = await Promise.all([
          axios.get(`https://3pcommunicationsserver.vercel.app/api/projects/${id}`),
          axios.get('https://3pcommunicationsserver.vercel.app/api/categories')
        ]);

        if (!isMounted) return;

        const fetchedProject = projRes.data?.project || projRes.data;
        const fetchedCategories = Array.isArray(catRes.data) ? catRes.data : [];

        setCategories(fetchedCategories);

        if (fetchedProject) {
          setProject({
            title: fetchedProject.title || '',
            category: fetchedProject.category || '',
            subcategory: fetchedProject.subcategory || '',
            client: {
              name: fetchedProject.client?.name || '',
              email: fetchedProject.client?.email || '',
              phone: fetchedProject.client?.phone || ''
            },
            review: {
              rating: fetchedProject.review?.rating || 5,
              comment: fetchedProject.review?.comment || ''
            },
            startDate: formatDate(fetchedProject.startDate),
            endDate: formatDate(fetchedProject.endDate),
            description: fetchedProject.description || '',
            mainImage: fetchedProject.mainImage || '',
            additionalImages: Array.isArray(fetchedProject.additionalImages) ? fetchedProject.additionalImages : [],
            address: fetchedProject.address || '',
            budget: fetchedProject.budget || '',
            areaSize: fetchedProject.areaSize || '',
            status: fetchedProject.status || 'pending'
          });

          setMainImagePreview(fetchedProject.mainImage || null);
          setExistingGalleryImages(Array.isArray(fetchedProject.additionalImages) ? fetchedProject.additionalImages : []);

          // Populate subcategories for current project category
          if (fetchedProject.category) {
            const currentCatData = fetchedCategories.find(
              (c) => c.name?.toLowerCase() === fetchedProject.category?.toLowerCase()
            );
            setSubcategories(currentCatData?.subcategories || []);
          }
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        if (isMounted) {
          setError('Failed to load project details. Please check your internet connection or project ID.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle standard field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('client.')) {
      const field = name.split('.')[1];
      setProject((prev) => ({
        ...prev,
        client: { ...prev.client, [field]: value }
      }));
    } else if (name.includes('review.')) {
      const field = name.split('.')[1];
      setProject((prev) => ({
        ...prev,
        review: { ...prev.review, [field]: value }
      }));
    } else if (name === 'startDate' || name === 'endDate') {
      setProject((prev) => ({
        ...prev,
        [name]: formatDate(value)
      }));
    } else {
      setProject((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Category & Subcategory cascade handler
  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    const catData = categories.find((c) => c.name === selectedCategoryName);

    setProject((prev) => ({
      ...prev,
      category: selectedCategoryName,
      subcategory: '' // Reset subcategory when category changes
    }));

    setSubcategories(catData?.subcategories || []);
  };

  // Description change for Rich Text
  const handleDescriptionChange = (value) => {
    setProject((prev) => ({ ...prev, description: value }));
  };

  // Main Image Handling
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleResetMainImage = () => {
    setNewMainImageFile(null);
    setMainImagePreview(project.mainImage || null);
    if (mainFileInputRef.current) {
      mainFileInputRef.current.value = '';
    }
  };

  // Gallery Images Handling
  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewGalleryFiles((prev) => [...prev, ...files]);
      setNewGalleryPreviews((prev) => [
        ...prev,
        ...files.map((file) => URL.createObjectURL(file))
      ]);
    }
  };

  const removeExistingGalleryImage = (index) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewGalleryFile = (index) => {
    if (newGalleryPreviews[index]) {
      URL.revokeObjectURL(newGalleryPreviews[index]);
    }
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Cloudinary image uploader
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', '3pcommunications');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/avinilit/image/upload',
        formData
      );
      return response.data.secure_url;
    } catch (err) {
      console.error('Error uploading image to Cloudinary:', err);
      throw err;
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);

    if (!project.title?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Title Required',
        text: 'Please specify a title for this project showcase.',
        confirmButtonColor: '#ff6600'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload new Main Cover Image if updated
      let finalMainImageUrl = project.mainImage;
      if (newMainImageFile) {
        setUploadStatus('Uploading new showcase cover photo to Cloudinary...');
        finalMainImageUrl = await uploadImageToCloudinary(newMainImageFile);
      }

      // 2. Upload newly selected gallery files
      let uploadedGalleryUrls = [];
      if (newGalleryFiles.length > 0) {
        for (let i = 0; i < newGalleryFiles.length; i++) {
          setUploadStatus(
            `Uploading new gallery image ${i + 1} of ${newGalleryFiles.length}...`
          );
          const url = await uploadImageToCloudinary(newGalleryFiles[i]);
          uploadedGalleryUrls.push(url);
        }
      }

      // Combine existing kept images with newly uploaded images
      const finalAdditionalImages = [
        ...existingGalleryImages,
        ...uploadedGalleryUrls
      ];

      // 3. Save updates to API
      setUploadStatus('Saving updated project details to database...');
      const dataToSubmit = {
        ...project,
        mainImage: finalMainImageUrl,
        additionalImages: finalAdditionalImages,
        startDate: formatDate(project.startDate),
        endDate: formatDate(project.endDate)
      };

      await axios.put(
        `https://3pcommunicationsserver.vercel.app/api/projects/${id}`,
        dataToSubmit
      );

      setIsSubmitting(false);

      // Update local state to reflect saved state
      setProject(dataToSubmit);
      setNewMainImageFile(null);
      setNewGalleryFiles([]);
      setNewGalleryPreviews([]);
      setExistingGalleryImages(finalAdditionalImages);

      Swal.fire({
        icon: 'success',
        title: 'Project Updated!',
        text: `"${project.title}" has been successfully updated.`,
        showCancelButton: true,
        confirmButtonText: 'Back to Projects List',
        cancelButtonText: 'Stay on Page',
        confirmButtonColor: '#ff6600',
        cancelButtonColor: '#64748b',
        background: '#ffffff',
        customClass: { popup: 'rounded-4' }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/dashboard/projects');
        }
      });
    } catch (err) {
      console.error('Error updating project:', err);
      setIsSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the project. Please check your data and retry.',
        confirmButtonColor: '#ff6600'
      });
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') {
      return <span className="chip-mini chip-completed">Completed</span>;
    }
    if (s === 'running') {
      return <span className="chip-mini chip-running">Running</span>;
    }
    return <span className="chip-mini chip-pending">Pending</span>;
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <p className="loading-caption">Retrieving project dossier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 border-0 shadow-sm rounded-4 text-center my-4">
        <h5 className="text-danger fw-bold mb-2">Notice</h5>
        <p className="text-muted">{error}</p>
        <div className="mt-3">
          <Link href="/dashboard/projects" className="btn dashboard_all_button rounded-3">
            <FaArrowLeft /> Return to Project List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="update-project-wrapper">
      {/* Top Header & Breadcrumb Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <Link
              href="/dashboard/projects"
              className="text-decoration-none text-muted small fw-semibold d-inline-flex align-items-center gap-1"
            >
              <FaArrowLeft style={{ fontSize: '10px' }} /> Projects Portfolio
            </Link>
            <span className="text-muted small">/</span>
            <span className="text-dark small fw-bold">Edit Project</span>
            <span className="ms-2">{getStatusBadge(project.status)}</span>
          </div>
          <h2 className="m-0 fw-bold">{project.title || 'Edit Project'}</h2>
          <p className="text-muted small m-0 mt-1">
            Update project specifications, visual gallery, client testimonial, and showcase status
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <a
            href={`/details/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-info rounded-3 d-inline-flex align-items-center gap-2"
            title="Open Live Public Project View"
          >
            <FaExternalLinkAlt /> Live Showcase
          </a>
          <Link href="/dashboard/projects" className="btn btn-outline-secondary rounded-3">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn dashboard_all_button d-inline-flex align-items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="spin-icon" /> Saving...
              </>
            ) : (
              <>
                <FaCheck /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Submission Loading Notice */}
      {isSubmitting && (
        <div className="alert alert-warning border-0 shadow-sm rounded-4 mb-4 d-flex align-items-center gap-3">
          <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
          <div>
            <strong>Processing Update:</strong> {uploadStatus}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* LEFT COLUMN: Main Form Specifications */}
          <div className="col-12 col-xl-8">
            {/* Card 1: Core Specifications */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaBuilding />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">General Specifications</h5>
                  <small className="text-muted">
                    Core identity, title, categories, and property metrics
                  </small>
                </div>
              </div>

              {/* Title */}
              <div className="mb-3">
                <label className="form-label-custom">
                  Project Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={project.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Living Room in Monipur"
                  className="form-control form-control-lg"
                  required
                />
              </div>

              {/* Category & Subcategory */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Division Category <span className="text-danger">*</span>
                  </label>
                  <select
                    name="category"
                    value={project.category}
                    onChange={handleCategoryChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Service Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">Subcategory</label>
                  <select
                    name="subcategory"
                    value={project.subcategory}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">
                      {subcategories.length === 0
                        ? 'No Subcategories Available'
                        : 'Select Subcategory'}
                    </option>
                    {subcategories.map((sub, idx) => (
                      <option key={idx} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area Size & Budget */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Area Size <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <FaRulerCombined />
                    </span>
                    <input
                      type="text"
                      name="areaSize"
                      value={project.areaSize}
                      onChange={handleChange}
                      placeholder="e.g. 2,400 sq ft"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Budget <span className="text-muted fw-normal">(Optional)</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <FaDollarSign />
                    </span>
                    <input
                      type="text"
                      name="budget"
                      value={project.budget}
                      onChange={handleChange}
                      placeholder="e.g. 35,000"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Property Location */}
              <div className="mb-0">
                <label className="form-label-custom">
                  Property Location / Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <FaMapMarkerAlt />
                  </span>
                  <input
                    type="text"
                    name="address"
                    value={project.address}
                    onChange={handleChange}
                    placeholder="e.g. House 42, Road 11, Banani, Dhaka"
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Architectural Narrative */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaAlignLeft />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">Project Description &amp; Details</h5>
                  <small className="text-muted">
                    Describe the design concept, room layout, lighting, and materials used
                  </small>
                </div>
              </div>

              <div>
                <ReactQuill
                  theme="snow"
                  value={project.description}
                  onChange={handleDescriptionChange}
                  placeholder="Write project overview, key features, and material details..."
                  style={{ minHeight: '200px' }}
                />
              </div>
            </div>

            {/* Card 3: Project Timeline */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaCalendarAlt />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">Project Timeline</h5>
                  <small className="text-muted">
                    Execution timeline from ground-breaking to handover
                  </small>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Commencement Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={project.startDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">Completion Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={project.endDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Client Information & Testimonial */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaUser />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">Client Information & Review</h5>
                  <small className="text-muted">
                    Record client credentials and verified endorsement
                  </small>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="form-label-custom">Client Name</label>
                  <input
                    type="text"
                    name="client.name"
                    value={project.client?.name || ''}
                    onChange={handleChange}
                    placeholder="e.g. Asif Iqbal"
                    className="form-control"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label-custom">Client Email</label>
                  <input
                    type="email"
                    name="client.email"
                    value={project.client?.email || ''}
                    onChange={handleChange}
                    placeholder="client@domain.com"
                    className="form-control"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label-custom">Client Phone</label>
                  <input
                    type="text"
                    name="client.phone"
                    value={project.client?.phone || ''}
                    onChange={handleChange}
                    placeholder="+880 1700-000000"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <label className="form-label-custom">Rating (1 to 5)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-warning">
                      <FaStar />
                    </span>
                    <input
                      type="number"
                      name="review.rating"
                      value={project.review?.rating || 5}
                      onChange={handleChange}
                      min="1"
                      max="5"
                      placeholder="5"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-9">
                  <label className="form-label-custom">Client Feedback / Comment</label>
                  <input
                    type="text"
                    name="review.comment"
                    value={project.review?.comment || ''}
                    onChange={handleChange}
                    placeholder="e.g. Exceptional craftsmanship and punctual handover!"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Media & Publishing Controls */}
          <div className="col-12 col-xl-4">
            {/* Publishing Status Card */}
            <div className="project-form-card">
              <h6 className="fw-bold mb-3 border-bottom pb-2">Publication Status</h6>
              <div className="mb-3">
                <label className="form-label-custom">Pipeline Stage</label>
                <select
                  name="status"
                  value={project.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="pending">Pending Review</option>
                  <option value="running">In Progress (Running)</option>
                  <option value="completed">Completed Showcase</option>
                </select>
              </div>

              <div className="small text-muted p-2 bg-light rounded-3 mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Project ID:</span>
                  <span className="font-monospace text-dark" style={{ fontSize: '11px' }}>
                    {id}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total Gallery:</span>
                  <strong className="text-dark">
                    {existingGalleryImages.length + newGalleryFiles.length} photos
                  </strong>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn dashboard_all_button d-flex align-items-center justify-content-center gap-2 py-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spin-icon" /> Saving Updates...
                    </>
                  ) : (
                    <>
                      <FaCheck /> Save &amp; Update Project
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Hero Cover Image Card */}
            <div className="project-form-card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold m-0">Showcase Cover Photo</h6>
                {newMainImageFile && (
                  <button
                    type="button"
                    onClick={handleResetMainImage}
                    className="btn btn-sm btn-link text-warning p-0 text-decoration-none d-inline-flex align-items-center gap-1"
                    title="Revert to original saved cover"
                  >
                    <FaUndo style={{ fontSize: '10px' }} /> Revert
                  </button>
                )}
              </div>
              <p className="text-muted small mb-3">
                Primary hero image displayed across portfolio grids and card thumbnails
              </p>

              {mainImagePreview ? (
                <div className="preview-image-box mb-3 position-relative">
                  <img src={mainImagePreview} alt="Showcase Cover Preview" />
                  <span
                    className="badge position-absolute top-2 start-2 m-2"
                    style={{
                      background: newMainImageFile ? '#ff6600' : 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      fontSize: '10px'
                    }}
                  >
                    {newMainImageFile ? 'New Replacement' : 'Current Saved Cover'}
                  </span>
                </div>
              ) : null}

              <div
                className="upload-dropzone"
                onClick={() => mainFileInputRef.current?.click()}
              >
                <FaCloudUploadAlt className="text-primary fs-2" />
                <div className="fw-semibold text-dark small">
                  {mainImagePreview ? 'Click to Change Cover Photo' : 'Click to Browse Cover Photo'}
                </div>
                <span className="text-muted" style={{ fontSize: '11px' }}>
                  PNG, JPG, or WEBP (Max 5MB)
                </span>
              </div>

              <input
                type="file"
                ref={mainFileInputRef}
                onChange={handleMainImageChange}
                accept="image/*"
                className="d-none"
              />
            </div>

            {/* Architectural Gallery Manager Card */}
            <div className="project-form-card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold m-0">Architectural Gallery</h6>
                <span className="badge bg-light text-dark border">
                  {existingGalleryImages.length + newGalleryFiles.length} Photos
                </span>
              </div>
              <p className="text-muted small mb-3">
                Manage supplementary perspectives, detailed joinery, and lighting angles
              </p>

              {/* Add More Photos Dropzone */}
              <div
                className="upload-dropzone mb-3"
                onClick={() => galleryFileInputRef.current?.click()}
              >
                <FaImages className="text-secondary fs-3" />
                <div className="fw-semibold text-dark small">Add Gallery Photos</div>
                <span className="text-muted" style={{ fontSize: '11px' }}>
                  Select multiple files at once
                </span>
              </div>

              <input
                type="file"
                multiple
                ref={galleryFileInputRef}
                onChange={handleGalleryFilesChange}
                accept="image/*"
                className="d-none"
              />

              {/* New Photos Selected (To be uploaded on save) */}
              {newGalleryPreviews.length > 0 && (
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-primary fw-bold">
                      Newly Selected ({newGalleryPreviews.length})
                    </span>
                    <small className="text-muted" style={{ fontSize: '10px' }}>
                      Will upload upon clicking Save
                    </small>
                  </div>
                  <div className="gallery-previews-grid">
                    {newGalleryPreviews.map((previewUrl, idx) => (
                      <div key={`new-${idx}`} className="gallery-thumb-item border-warning">
                        <img src={previewUrl} alt={`New Gallery Preview ${idx + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeNewGalleryFile(idx)}
                          className="gallery-thumb-remove"
                          title="Remove from upload queue"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Saved Gallery Photos */}
              {existingGalleryImages.length > 0 ? (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-muted fw-bold">
                      Saved Gallery ({existingGalleryImages.length})
                    </span>
                    <small className="text-muted" style={{ fontSize: '10px' }}>
                      Click trash to remove
                    </small>
                  </div>
                  <div className="gallery-previews-grid">
                    {existingGalleryImages.map((imgUrl, idx) => (
                      <div key={`exist-${idx}`} className="gallery-thumb-item">
                        <img src={imgUrl} alt={`Saved Gallery photo ${idx + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeExistingGalleryImage(idx)}
                          className="gallery-thumb-remove"
                          title="Remove photo from project"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-muted small bg-light rounded-3">
                  No additional gallery images attached.
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProject;
