'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // New state variables for filtering
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);


  // Fetch projects from the backend
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "https://3pcommunicationsserver.vercel.app/api/projects"
        );
        if (isMounted) {
          setProjects(response.data.projects || response.data);
          setLoading(false); // Set loading to false after fetching data
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch projects");
          setLoading(false); // Set loading to false even on error
        }
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://3pcommunicationsserver.vercel.app/api/categories"); // Replace with your categories API endpoint
        if (isMounted) {
          setCategories(response.data); // Assuming the response is an array of categories
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };



    fetchCategories();
    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show project details modal
  const handleShowDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedProject(null);
  };

  // Function to confirm project deletion with SweetAlert2
  const handleDeleteProject = (project) => {
    Swal.fire({
      title: `Are you sure you want to delete "${project.title}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      confirmButtonColor: "#007bff", // Blue color for confirm button
      cancelButtonColor: "#d33", // Optional: Red for cancel button
    }).then((result) => {
      if (result.isConfirmed) {
        // Call delete project function if confirmed
        deleteProject(project);
      }
    });
  };

  // Function to delete project
  const deleteProject = async (project) => {
    try {
      await axios.delete(
        `https://3pcommunicationsserver.vercel.app/api/projects/${project._id}`
      );
      // Update state after deletion
      setProjects(projects.filter((p) => p._id !== project._id));

      // Show success message using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Deleted successfully!",
        text: `The project "${project.title}" has been deleted.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      console.error("Failed to delete project:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to delete project",
        text: "Please try again later.",
        position: "center",
      });
    }
  };

  const handleNavigateToUpdate = (project) => {
    navigate(`/dashboard/updateproject/${project._id}`);
  };

  // Filtering projects based on search and category
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory
      ? project.category === selectedCategory
      : true;
    const matchesSearch =
      project.title.toLowerCase().includes(searchText.toLowerCase()) ||
      project.client.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Custom Loader Component
  const Loader = () => (
    <div className="loader-container text-center mt-5">
      <div className="custom-loader"></div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <div className="container m-5 p-5 shadow-lg  mx-auto card ">
      <h2 className="text-center mb-4" style={{ fontFamily: "Times New Roman" }}>Projects List</h2>

      {/* Search and Filter Section */}
      <div className="mb-4">
        <Form inline className="w-100">
          <div className="d-flex justify-content-between w-100">
            <Form.Group
              controlId="searchText"
              className="me-4"
              style={{ width: "30%" }}
            >
              <div className="position-relative ">
                <Form.Control
                  type="text"
                  placeholder="Search projects..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className=" border border-dark shadow-sm pr-5"
                  style={{ borderColor: "#003366" }}
                  aria-label="Search projects"
                />
                <i
                  className="fas fa-search position-absolute"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#888",
                  }}
                ></i>
              </div>
            </Form.Group>

            <Form.Group controlId="categorySelect" style={{ width: "30%" }}>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-dark shadow-sm"
                style={{ borderColor: "#003366" }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => ( // Adjusted to use the correct category object
                  <option key={category._id} value={category.name}> {/* Use category.name */}
                    {category.name} {/* Display category name */}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>


            <div className="text-end mb-3 ">
              <Link to="/dashboard/addProject" className="btn dashboard_all_button">
                Add New Project
              </Link>
            </div>
          </div>
        </Form>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="alert alert-info">No projects found.</div>
      ) : (
        <table className="table table-striped ">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Serial</th>
              <th scope="col">Main Image</th>
              <th scope="col">Title</th>
              <th scope="col">Category</th>
              <th scope="col">Start Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr key={project._id}>
                <th scope="row">{index + 1}</th>
                <td><img src={project.mainImage} alt="" className="img-thumbnail" style={{ maxWidth: '100px' }} /> </td>
                <td>{project.title}</td>
                <td>{project.category || "N/A"}</td>
                <td>{new Date(project.startDate).toLocaleDateString()}</td>
                <td className="">
                  <Button
                    className="mx-2"
                    variant="info"
                    onClick={() => handleShowDetails(project)}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    className="mx-2"
                    variant="warning"
                    onClick={() => handleNavigateToUpdate(project)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    className="mx-2"
                    variant="danger"
                    onClick={() => handleDeleteProject(project)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="font-weight-bold">
            {selectedProject ? selectedProject.title : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div className="container">
              <div className="row mb-3">
                <div className="col-12">
                  <h5 className="font-weight-bold">Project Details</h5>
                  <p>
                    <strong>Category:</strong>{" "}
                    {selectedProject.category || "N/A"}
                  </p>
                  <p>
                    <strong>Client Name:</strong>{" "}
                    {selectedProject.client?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Client Email:</strong>{" "}
                    {selectedProject.client?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Client Phone:</strong>{" "}
                    {selectedProject.client?.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(selectedProject.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {selectedProject.endDate
                      ? new Date(selectedProject.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: selectedProject.description || "N/A",
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectList;

