'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import ReactQuill from '../Components/ReactQuillWrapper';

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
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
      rating: null,  // Use null for a number type
      comment: ''
    },
    startDate: '', // Consider using null or Date object for better handling
    endDate: '',   // Consider using null or Date object for better handling
    description: '',
    mainImage: '',
    additionalImages: [],
    address: '',      // Include address as per your schema
    budget: 0,       // Initialize as a number
    areaSize: 0,     // Initialize as a number
    status: 'pending' // Initialize with a default status
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utility to format date to "yyyy-MM-dd"
  const formatDate = (dateString) => dateString?.split('T')[0] || '';

  // Fetch project details and categories
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`https://3pcommunicationsserver.vercel.app/api/projects/${id}`);
        const fetchedProject = response.data.project;
        setProject({
          ...fetchedProject,
          startDate: formatDate(fetchedProject.startDate),
          endDate: formatDate(fetchedProject.endDate)
        });
        setMainImagePreview(fetchedProject.mainImage);
        setAdditionalImagePreviews(fetchedProject.additionalImages.map(img => img)); // Keep old images
      } catch {
        setError('Error fetching project details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/categories');
        setCategories(response.data);
      } catch {
        setError('Failed to load categories.');
      }
    };

    fetchCategories();
    fetchProject();
  }, [id]);


  // Update subcategories based on selected category
  useEffect(() => {
    const selectedCategory = categories.find(cat => cat.name === project.category);
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
  }, [categories, project.category]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('client')) {
      setProject(prev => ({ ...prev, client: { ...prev.client, [name.split('.')[1]]: value } }));
    } else if (name.includes('review')) {
      setProject(prev => ({ ...prev, review: { ...prev.review, [name.split('.')[1]]: value } }));
    } else {
      setProject(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);
    setProject(prev => ({ ...prev, category: selectedCategory, subcategory: '' }));
    setSubcategories(selectedCategoryData ? selectedCategoryData.subcategories : []);
  };

  const handleDescriptionChange = (value) => setProject(prev => ({ ...prev, description: value }));









  // Handle main image change
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // // Handle additional images
  // const handleAdditionalImagesChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setAdditionalImages(files);
  //   setAdditionalImagePreviews(files.map(file => URL.createObjectURL(file)));
  // };
  // const handleDeleteAdditionalImage = (indexToDelete) => {
  //   setAdditionalImagePreviews(prev => prev.filter((_, index) => index !== indexToDelete));
  //   setAdditionalImages(prev => prev.filter((_, index) => index !== indexToDelete));
  // };


  
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', '3pcommunications');

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/avinilit/image/upload`, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  };

  // const uploadImageToCloudinary = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "3pcommunications"); // Replace with your Cloudinary upload preset
  
  //   try {
  //     const response = await axios.post(
  //       `https://api.cloudinary.com/v1_1/avinilit/image/upload?transformation=h_1080,c_scale,q_80`,
  //       formData
  //     );
  //     return response.data.secure_url; // Return the uploaded, resized image URL with 80% quality
  //   } catch (error) {
  //     console.error("Error uploading image to Cloudinary:", error);
  //     throw error;
  //   }
  // };
  
  const handleAdditionalImageChange = (index, file) => {
    const newImages = [...additionalImages];
    const newPreviews = [...additionalImagePreviews];

    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);

    setAdditionalImages(newImages);
    setAdditionalImagePreviews(newPreviews);
  };

  const addAdditionalImageField = () => {
    setAdditionalImages([...additionalImages, null]); // Add new input
    setAdditionalImagePreviews([...additionalImagePreviews, null]); // Add new preview
  };

  const removeAdditionalImageField = (index) => {
    const newImages = additionalImages.filter((_, idx) => idx !== index);
    const newPreviews = additionalImagePreviews.filter((_, idx) => idx !== index);

    setAdditionalImages(newImages);
    setAdditionalImagePreviews(newPreviews);
  };
  const handleDeleteExistingImage = (index) => {
    const updatedImages = project.additionalImages.filter((_, idx) => idx !== index);
    setProject(prev => ({ ...prev, additionalImages: updatedImages }));
  };



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let mainImageUrl = project.mainImage;

      // Upload new main image if selected
      if (mainImage && typeof mainImage === 'object') {
        mainImageUrl = await uploadImageToCloudinary(mainImage);
      }

      // Upload new additional images
      const newAdditionalImageUrls = await Promise.all(
        additionalImages.map(image => uploadImageToCloudinary(image))
      );
      const additionalImageUrls = [...project.additionalImages, ...newAdditionalImageUrls];

      const dataToSubmit = { ...project, mainImage: mainImageUrl, additionalImages: additionalImageUrls };

      await axios.put(`https://3pcommunicationsserver.vercel.app/api/projects/${id}`, dataToSubmit);
      navigate('/dashboard/projects');
    } catch {
      setError('Error updating project. Please try again.');
    }
  };



  // Render loading or error messages, and the form
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Update Project</h2>
      <button onClick={() => navigate('/dashboard/projects')} className="btn btn-secondary mt-3 mb-4">
        Back to Project List
      </button>

      <form onSubmit={handleSubmit} className="border p-4 shadow-sm bg-light rounded">
        {/* Project Title */}
        <div className="form-group mb-3">
          <label>Project Title</label>
          <input type="text" name="title" value={project.title} onChange={handleChange} className="form-control" required />
        </div>





        {/* Main Image */}
        <div className="form-group mb-3">
          <label>Main Image</label>
          <input type="file" onChange={handleMainImageChange} className="form-control" accept="image/*" />
          {mainImagePreview && (
            <div className="position-relative d-inline-block mt-2">
              <img src={mainImagePreview} alt="Main" className="img-thumbnail" style={{ maxWidth: '100px' }} />
              <button type="button" onClick={() => setMainImage(null)} className="btn btn-danger btn-sm position-absolute top-0 end-0">
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Additional Images */}
        <div className="form-group mb-3">
          <label className="fw-bold">Additional Images</label>
          {/* Render existing images */}
          <div>
            <h5>Existing Images</h5>
            {project.additionalImages.map((img, index) => (
              <div key={`old-${index}`} className="position-relative d-inline-block me-2 mt-2">
                <img src={img} alt={`Existing Additional ${index + 1}`} className="img-thumbnail" style={{ maxWidth: '100px' }} />
                <button
                  type="button"
                  onClick={() => handleDeleteExistingImage(index)}
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Render input fields for new additional images */}
          {additionalImages.map((_, index) => (
            <div key={index} className="mb-2 position-relative">
              <input
                type="file"
                onChange={(e) => handleAdditionalImageChange(index, e.target.files[0])}
                className="form-control mb-1"
                accept="image/*"
              />
              {additionalImages[index] && (
                <div className="mt-2 position-relative">
                  <img
                    src={additionalImagePreviews[index] ? additionalImagePreviews[index] : URL.createObjectURL(additionalImages[index])}
                    alt={`New Additional ${index + 1}`}
                    className="small-image img-fluid mb-1"
                    style={{ maxWidth: '100px' }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger position-absolute top-0 end-0"
                    onClick={() => removeAdditionalImageField(index)}
                    title="Delete"
                  >
                    <FaTrash className="icon-size" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={addAdditionalImageField}>
            Add More Images
          </button>
        </div>

        {/* Category */}
        <div className="form-group mb-3">
          <label>Category</label>
          <select name="category" value={project.category} onChange={handleCategoryChange} className="form-control" required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="form-group mb-3">
          <label>Subcategory</label>
          <select name="subcategory" value={project.subcategory} onChange={handleChange} className="form-control" required>
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory.name}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description with Text Editor */}
        <div className="form-group mb-3">
          <label>Description</label>
          <ReactQuill theme="snow" value={project.description} onChange={handleDescriptionChange} />
        </div>

        {/* Project Status */}
        <div className="form-group mb-3">
          <label>Status</label>
          <select name="status" value={project.status} onChange={handleChange} className="form-control" required>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {/* Address */}
        <div className="form-group mb-3">
          <label>Address</label>
          <input type="text" name="address" value={project.address} onChange={handleChange} className="form-control" required />
        </div>

        {/* Budget */}
        <div className="form-group mb-3">
          <label>Budget <span className="text-muted fw-normal">(Optional)</span></label>
          <input type="text" name="budget" value={project.budget || ''} onChange={handleChange} className="form-control" placeholder="e.g. 50,000" />
        </div>

        {/* Area Size */}
        <div className="form-group mb-3">
          <label>Area Size</label>
          <input type="text" name="areaSize" value={project.areaSize || ''} onChange={handleChange} className="form-control" required />
        </div>







        {/* Client and Review Details */}
        {/* Client Details */}
        <h3 className="mt-4">Client Details <span className="text-muted fs-6 fw-normal">(Optional)</span></h3>
        <div className="form-group mb-3">
          <label>Client Name <span className="text-muted fw-normal">(Optional)</span></label>
          <input type="text" name="client.name" value={project.client?.name || ''} onChange={handleChange} className="form-control" placeholder="Client or Company Name" />
        </div>
        <div className="form-group mb-3">
          <label>Client Email <span className="text-muted fw-normal">(Optional)</span></label>
          <input type="email" name="client.email" value={project.client?.email || ''} onChange={handleChange} className="form-control" placeholder="client@example.com" />
        </div>
        <div className="form-group mb-3">
          <label>Client Phone <span className="text-muted fw-normal">(Optional)</span></label>
          <input type="tel" name="client.phone" value={project.client?.phone || ''} onChange={handleChange} className="form-control" placeholder="Phone Number" />
        </div>

        {/* Review Details */}
        <h3 className="mt-4">Client Review</h3>
        <div className="form-group mb-3">
          <label>Rating</label>
          <input type="number" name="review.rating" value={project.review.rating} onChange={handleChange} className="form-control" min="1" max="5" />
        </div>
        <div className="form-group mb-3">
          <label>Comment</label>
          <textarea name="review.comment" value={project.review.comment} onChange={handleChange} className="form-control"></textarea>
        </div>

        {/* Dates */}
        <div className="form-group mb-3">
          <label>Start Date</label>
          <input type="date" name="startDate" value={project.startDate} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group mb-3">
          <label>End Date</label>
          <input type="date" name="endDate" value={project.endDate} onChange={handleChange} className="form-control" />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary mt-3">Update Project</button>
      </form>
    </div>
  );
};

export default UpdateProject;
