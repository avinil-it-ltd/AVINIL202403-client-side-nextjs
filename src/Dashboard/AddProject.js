'use client';

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  FaSpinner
} from "react-icons/fa";
import ReactQuill from '../Components/ReactQuillWrapper';

const AddProject = () => {
  const router = useRouter();
  const mainFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Media state
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const [projectData, setProjectData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    client: {
      name: "",
      email: "",
      phone: "",
    },
    review: {
      rating: "",
      comment: "",
    },
    startDate: "",
    endDate: "",
    address: "",
    budget: "",
    areaSize: "",
    status: "pending",
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://3pcommunicationsserver.vercel.app/api/categories"
        );
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  // Main Image Handling
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
      setMainImagePreview(null);
    }
    if (mainFileInputRef.current) {
      mainFileInputRef.current.value = "";
    }
  };

  // Gallery Images Handling
  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...additionalImages, ...files];
      const newPreviews = [...additionalImagePreviews, ...files.map(f => URL.createObjectURL(f))];
      setAdditionalImages(newImages);
      setAdditionalImagePreviews(newPreviews);
    }
  };

  const removeGalleryImage = (index) => {
    if (additionalImagePreviews[index]) {
      URL.revokeObjectURL(additionalImagePreviews[index]);
    }
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (value) => {
    setProjectData(prev => ({
      ...prev,
      description: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("client.")) {
      const field = name.split(".")[1];
      setProjectData(prev => ({
        ...prev,
        client: { ...prev.client, [field]: value }
      }));
    } else if (name.includes("review.")) {
      const field = name.split(".")[1];
      setProjectData(prev => ({
        ...prev,
        review: { ...prev.review, [field]: value }
      }));
    } else if (name === "startDate" || name === "endDate") {
      setProjectData(prev => ({
        ...prev,
        [name]: formatDate(value)
      }));
    } else {
      setProjectData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selectedCategoryData = categories.find(
      (cat) => cat.name === selectedCategory
    );

    setProjectData(prev => ({
      ...prev,
      category: selectedCategory,
      subcategory: "",
    }));

    if (selectedCategoryData && selectedCategoryData.subcategories) {
      setSubcategories(selectedCategoryData.subcategories);
    } else {
      setSubcategories([]);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "3pcommunications");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/avinilit/image/upload`,
      formData
    );
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      Swal.fire({
        icon: "warning",
        title: "Cover Image Required",
        text: "Please select a main cover image for this project showcase.",
        confirmButtonColor: "#ff6600",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload Main Image
      setUploadStatus("Uploading main showcase cover photo to Cloudinary...");
      const mainImageUrl = await uploadImageToCloudinary(mainImage);

      // 2. Upload Additional Gallery Images
      let additionalImageUrls = [];
      if (additionalImages.length > 0) {
        for (let i = 0; i < additionalImages.length; i++) {
          setUploadStatus(`Uploading gallery photo ${i + 1} of ${additionalImages.length}...`);
          const url = await uploadImageToCloudinary(additionalImages[i]);
          additionalImageUrls.push(url);
        }
      }

      // 3. Save to Backend Database
      setUploadStatus("Saving project to portfolio database...");
      const dataToSubmit = {
        title: projectData.title,
        category: projectData.category,
        subcategory: projectData.subcategory,
        description: projectData.description,
        client: projectData.client,
        review: projectData.review,
        startDate: formatDate(projectData.startDate),
        endDate: formatDate(projectData.endDate),
        mainImage: mainImageUrl,
        additionalImages: additionalImageUrls,
        address: projectData.address,
        budget: projectData.budget,
        areaSize: projectData.areaSize,
        status: projectData.status || "pending",
      };

      await axios.post(
        "https://3pcommunicationsserver.vercel.app/api/projects",
        dataToSubmit
      );

      setIsSubmitting(false);

      Swal.fire({
        icon: "success",
        title: "Project Published!",
        text: `"${projectData.title}" has been successfully added to the portfolio.`,
        showCancelButton: true,
        confirmButtonColor: "#ff6600",
        cancelButtonColor: "#64748b",
        confirmButtonText: "View Portfolio",
        cancelButtonText: "Add Another",
        customClass: { popup: "rounded-4" }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/dashboard/projects");
        } else {
          // Reset form
          setProjectData({
            title: "",
            category: "",
            subcategory: "",
            description: "",
            client: { name: "", email: "", phone: "" },
            review: { rating: "", comment: "" },
            startDate: "",
            endDate: "",
            address: "",
            budget: "",
            areaSize: "",
            status: "pending",
          });
          removeMainImage();
          setAdditionalImages([]);
          setAdditionalImagePreviews([]);
        }
      });
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Could not upload images or save project. Please verify image file types and try again.",
      });
    }
  };

  return (
    <div className="add-project-wrapper">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Link href="/dashboard/projects" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
              <FaArrowLeft /> Back to Portfolio
            </Link>
          </div>
          <h2 className="m-0 fw-bold">Add New Project</h2>
          <p className="text-muted small m-0 mt-1">
            Publish a luxury interior or exterior architectural showcase to 3P Communication portfolio
          </p>
        </div>
        <div className="d-flex gap-2">
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
                <FaSpinner className="spin-icon" /> Publishing...
              </>
            ) : (
              <>
                <FaCheck /> Publish Project
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
            <strong>Processing Upload:</strong> {uploadStatus}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* LEFT COLUMN: Main Form Specs */}
          <div className="col-12 col-xl-8">
            {/* Card 1: Core Specifications */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaBuilding />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">General Specifications</h5>
                  <small className="text-muted">Core attributes, title, categories, and property metrics</small>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Project Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Living Room in Monipur (Progoti Villa)"
                  className="form-control form-control-lg"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">Division Category <span className="text-danger">*</span></label>
                  <select
                    name="category"
                    value={projectData.category}
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
                    value={projectData.subcategory}
                    onChange={handleChange}
                    className="form-select"
                    disabled={subcategories.length === 0}
                  >
                    <option value="">
                      {subcategories.length === 0 ? "No Subcategories Available" : "Select Subcategory"}
                    </option>
                    {subcategories.map((sub, idx) => (
                      <option key={idx} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">Area Size <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <FaRulerCombined />
                    </span>
                    <input
                      type="text"
                      name="areaSize"
                      value={projectData.areaSize}
                      onChange={handleChange}
                      placeholder="e.g. 2,400 sq ft"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">Budget <span className="text-muted fw-normal">(Optional)</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <FaDollarSign />
                    </span>
                    <input
                      type="text"
                      name="budget"
                      value={projectData.budget}
                      onChange={handleChange}
                      placeholder="e.g. 35,000"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-0">
                <label className="form-label-custom">Property Location / Address <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <FaMapMarkerAlt />
                  </span>
                  <input
                    type="text"
                    name="address"
                    value={projectData.address}
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
                  <h5 className="m-0 fw-bold">Architectural Narrative & Details</h5>
                  <small className="text-muted">Describe design concepts, materials, lighting, and finishes</small>
                </div>
              </div>

              <div>
                <ReactQuill
                  theme="snow"
                  value={projectData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Draft architectural overview, key features, and material specifications..."
                  style={{ minHeight: '200px' }}
                />
              </div>
            </div>

            {/* Card 3: Timeline */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaCalendarAlt />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">Project Timeline</h5>
                  <small className="text-muted">Execution timeline from ground-breaking to handover</small>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">Commencement Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    name="startDate"
                    value={projectData.startDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">Completion Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    name="endDate"
                    value={projectData.endDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Client & Testimonial Details */}
            <div className="project-form-card">
              <div className="project-form-header">
                <div className="project-form-icon">
                  <FaUser />
                </div>
                <div>
                  <h5 className="m-0 fw-bold">Client Information & Review</h5>
                  <small className="text-muted">Optional: Record client credentials and handover feedback</small>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="form-label-custom">Client Name</label>
                  <input
                    type="text"
                    name="client.name"
                    value={projectData.client.name}
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
                    value={projectData.client.email}
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
                    value={projectData.client.phone}
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
                      value={projectData.review.rating}
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
                    value={projectData.review.comment}
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
                  value={projectData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="pending">Pending Review</option>
                  <option value="running">In Progress (Running)</option>
                  <option value="completed">Completed Showcase</option>
                </select>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn dashboard_all_button d-flex align-items-center justify-content-center gap-2 py-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spin-icon" /> Uploading & Publishing...
                    </>
                  ) : (
                    <>
                      <FaCheck /> Save & Publish Showcase
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Hero Cover Image Card */}
            <div className="project-form-card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold m-0">Showcase Cover Photo <span className="text-danger">*</span></h6>
                {mainImage && (
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-muted small mb-3">Primary thumbnail for homepage portfolio grid (Recommended: 16:9 ratio, &lt; 5MB)</p>

              {mainImagePreview ? (
                <div className="preview-image-box">
                  <img src={mainImagePreview} alt="Showcase Preview" />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="preview-remove-btn"
                    title="Remove Image"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div
                  className="upload-dropzone"
                  onClick={() => mainFileInputRef.current?.click()}
                >
                  <FaCloudUploadAlt className="text-primary fs-2" />
                  <div className="fw-semibold text-dark small">Click to browse cover photo</div>
                  <span className="text-muted" style={{ fontSize: '11px' }}>PNG, JPG, or WEBP</span>
                </div>
              )}

              <input
                type="file"
                ref={mainFileInputRef}
                onChange={handleMainImageChange}
                accept="image/*"
                className="d-none"
              />
            </div>

            {/* Additional Project Gallery Card */}
            <div className="project-form-card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold m-0">Project Gallery Images</h6>
                <span className="badge bg-light text-dark border">
                  {additionalImages.length} Photos
                </span>
              </div>
              <p className="text-muted small mb-3">Additional angles, detailed shots, and interior renders</p>

              <div
                className="upload-dropzone"
                onClick={() => galleryFileInputRef.current?.click()}
              >
                <FaImages className="text-secondary fs-3" />
                <div className="fw-semibold text-dark small">Select Gallery Photos</div>
                <span className="text-muted" style={{ fontSize: '11px' }}>Select multiple files at once</span>
              </div>

              <input
                type="file"
                multiple
                ref={galleryFileInputRef}
                onChange={handleGalleryFilesChange}
                accept="image/*"
                className="d-none"
              />

              {additionalImagePreviews.length > 0 && (
                <div className="gallery-previews-grid">
                  {additionalImagePreviews.map((previewUrl, idx) => (
                    <div key={idx} className="gallery-thumb-item">
                      <img src={previewUrl} alt={`Gallery item ${idx + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="gallery-thumb-remove"
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
