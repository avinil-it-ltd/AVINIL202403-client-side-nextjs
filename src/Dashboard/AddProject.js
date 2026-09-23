'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';




const AddProject = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImageInputs, setAdditionalImageInputs] = useState([null]);
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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://3pcommunicationsserver.vercel.app/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load categories. Please try again later.",
        });
      }
    };
    fetchCategories();
  }, []);

  // Utility to format date to "yyyy-MM-dd" for input[type="date"]
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Extract "yyyy-MM-dd"
  };
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
  };

  const handleDescriptionChange = (value) => {
    setProjectData((prevState) => ({
      ...prevState,
      description: value,
    }));
  };


  const handleAdditionalImageChange = (index, file) => {
    const newImages = [...additionalImages];
    newImages[index] = file;
    setAdditionalImages(newImages);
  };

  const addAdditionalImageField = () => {
    setAdditionalImageInputs([...additionalImageInputs, null]);
  };

  const removeAdditionalImageField = (index) => {
    const newInputs = additionalImageInputs.filter((_, i) => i !== index);
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImageInputs(newInputs);
    setAdditionalImages(newImages);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("client")) {
      setProjectData((prevState) => ({
        ...prevState,
        client: {
          ...prevState.client,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.includes("review")) {
      setProjectData((prevState) => ({
        ...prevState,
        review: {
          ...prevState.review,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name === "startDate" || name === "endDate") {
      // Format date before updating state
      setProjectData((prevState) => ({
        ...prevState,
        [name]: formatDate(value), // Use the formatDate function here
      }));
    } else {
      setProjectData((prevState) => ({
        ...prevState,
        [name]: name === "budget" ? value : value,
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selectedCategoryData = categories.find(
      (cat) => cat.name === selectedCategory
    );

    setProjectData((prevState) => ({
      ...prevState,
      category: selectedCategory,
      subcategory: "",
    }));

    if (selectedCategoryData) {
      setSubcategories(selectedCategoryData.subcategories);
    } else {
      setSubcategories([]);
    }
  };

  
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "3pcommunications"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/avinilit/image/upload`,
        formData
      );
      return response.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
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
  
  const removeMainImage = () => {
    setMainImage(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload main image
      let mainImageUrl = "";
      if (mainImage) {
        mainImageUrl = await uploadImageToCloudinary(mainImage);
      }

      // Upload additional images
      const additionalImageUrls = await Promise.all(
        additionalImages
          .filter((image) => image)
          .map((image) => uploadImageToCloudinary(image))
      );

      
      // Prepare project data
      const dataToSubmit = {
        title: projectData.title,
        category: projectData.category,
        subcategory: projectData.subcategory,
        description: projectData.description,
        client: projectData.client,
        review: projectData.review,
        startDate: formatDate(projectData.startDate), // Format date here
        endDate: formatDate(projectData.endDate), // Format date here
        mainImage: mainImageUrl,
        additionalImages: additionalImageUrls, // Ensure we're sending the URLs
        address: projectData.address,
        budget: projectData.budget,
        areaSize:projectData.areaSize,
        status: projectData.status || "pending", // Default to 'pending' if not specified
      };


      const response = await axios.post(
        "https://3pcommunicationsserver.vercel.app/api/projects",
        dataToSubmit
      );

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Project added successfully!",
        position: "center",
        showConfirmButton: true,
        confirmButtonColor: "#28a745",
      });

      // Reset form fields
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
      setMainImage(null);
      setAdditionalImages([]);
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding project. Please try again.",
      });
    }
  };

  return (
    <div className="container card p-5 w-75 mx-auto shadow-lg m-5 ">
      <h2 className="text-center">Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <h3 className="mt-5 mb-3">Project Details</h3>
        <div className="form-group  dashboard_form_desing">
          <label className="fw-bold">Project Title</label>
          <input
            type="text"
            name="title"
            value={projectData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Main Image</label>
          <input
            type="file"
            name="mainImage"
            onChange={handleMainImageChange}
            className="form-control"
            accept="image/*"
            required
          />
          {mainImage && (
            <div className="mt-2 position-relative">
              <img
                src={URL.createObjectURL(mainImage)}
                alt="Main"
                className="small-image img-fluid mb-2"
              />
              <button
                type="button"
                className="btn btn-danger position-absolute top-0 end-0"
                onClick={removeMainImage}
                title="Delete"
              >
                <FaTrash className="icon-size" />
              </button>
            </div>
          )}
        </div>

        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Additional Images</label>
          {additionalImageInputs.map((_, index) => (
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
                    src={URL.createObjectURL(additionalImages[index])}
                    alt={`Additional ${index}`}
                    className="small-image img-fluid mb-1"
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

        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Category</label>
          <select
            name="category"
            value={projectData.category}
            onChange={handleCategoryChange}
            className="form-control"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Subcategory</label>
          <select
            name="subcategory"
            value={projectData.subcategory}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory.name}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Description</label>
          <ReactQuill
            theme="snow"
            value={projectData.description}
            onChange={handleDescriptionChange}
            className="form-control"
            required
          />
        </div>
        {/* Additional form fields for address, budget, and status */}
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Address</label>
          <input type="text" name="address" value={projectData.address} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Budget <span className="text-muted fw-normal">(Optional)</span></label>
          <input type="text" name="budget" value={projectData.budget} onChange={handleChange} className="form-control" placeholder="e.g. 50,000" />
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Area Size</label>
          <input type="text" name="areaSize" value={projectData.areaSize} onChange={handleChange}  className="form-control" required />
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Status</label>
          <select name="status" value={projectData.status} onChange={handleChange} className="form-control" required>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
          </select>
        </div>



        <h3 className="mt-5 pt-5">Client Details <span className="text-muted fs-6 fw-normal">(Optional)</span></h3>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Client Name <span className="text-muted fw-normal">(Optional)</span></label>
          <input
            type="text"
            name="client.name"
            value={projectData.client.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Client or Company Name"
          />
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Client Email <span className="text-muted fw-normal">(Optional)</span></label>
          <input
            type="email"
            name="client.email"
            value={projectData.client.email}
            onChange={handleChange}
            className="form-control"
            placeholder="client@example.com"
          />
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Client Phone <span className="text-muted fw-normal">(Optional)</span></label>
          <input
            type="text"
            name="client.phone"
            value={projectData.client.phone}
            onChange={handleChange}
            className="form-control"
            placeholder="Phone Number"
          />
        </div>

        <h3 className="mt-5 pt-5">Review <span className="text-muted fs-6 fw-normal">(Optional)</span></h3>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Rating <span className="text-muted fw-normal">(Optional)</span></label>
          <input
            type="number"
            name="review.rating"
            value={projectData.review.rating}
            onChange={handleChange}
            min="1"
            max="5"
            className="form-control"
            placeholder="1-5"
          />
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Comment <span className="text-muted fw-normal">(Optional)</span></label>
          <textarea
            name="review.comment"
            value={projectData.review.comment}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Client review / feedback"
          />
        </div>

        <h3 className="mt-5 pt-5">Project Timeline</h3>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group dashboard_form_desing">
          <label className="fw-bold">End Date</label>
          <input
            type="date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn dashboard_all_button mt-4">
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;

