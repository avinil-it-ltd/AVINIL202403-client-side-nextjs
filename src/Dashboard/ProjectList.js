'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const ProjectList = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "https://3pcommunicationsserver.vercel.app/api/projects"
      );
      const data = response.data?.projects || response.data;
      setProjects(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to fetch projects");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://3pcommunicationsserver.vercel.app/api/categories");
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  const handleShowDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = (project) => {
    Swal.fire({
      title: `Delete "${project.title}"?`,
      text: "This project and its associated media will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      background: "#ffffff",
      customClass: {
        popup: "rounded-4"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://3pcommunicationsserver.vercel.app/api/projects/${project._id}`
          );
          setProjects(prev => prev.filter(p => p._id !== project._id));
          Swal.fire({
            icon: "success",
            title: "Project Deleted",
            text: `"${project.title}" has been deleted.`,
            timer: 1500,
            showConfirmButton: false
          });
        } catch (err) {
          console.error("Failed to delete project:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete project. Please try again later.",
          });
        }
      }
    });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory
      ? (project.category?.toLowerCase() === selectedCategory.toLowerCase())
      : true;
    const titleMatch = (project.title || "").toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = (project.client?.name || "").toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && (titleMatch || clientMatch);
  });

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
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
        <p className="loading-caption">Loading project portfolio...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger rounded-3 mt-4">{error}</div>;
  }

  return (
    <div className="projects-dashboard-wrapper">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="m-0 fw-bold">Projects Portfolio</h2>
          <p className="text-muted small m-0 mt-1">
            Manage live interior and architectural project showcases ({projects.length} Total)
          </p>
        </div>
        <Link href="/dashboard/addProject" className="btn dashboard_all_button d-inline-flex align-items-center gap-2">
          <FaPlus /> Add New Project
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-3 mb-4 border-0 shadow-sm rounded-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search by project title or client..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="form-control border-start-0 ps-0"
              />
              {searchText && (
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => setSearchText("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-2 text-md-end text-muted small">
            <span>Showing {filteredProjects.length}</span>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '8%' }}>Cover</th>
                <th style={{ width: '28%' }}>Project Details</th>
                <th style={{ width: '18%' }}>Category</th>
                <th style={{ width: '14%' }}>Timeline</th>
                <th style={{ width: '14%' }}>Status</th>
                <th style={{ width: '18%' }} className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No projects found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project._id}>
                    <td>
                      <div 
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {project.mainImage ? (
                          <img
                            src={project.mainImage}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span className="text-muted" style={{ fontSize: '10px' }}>No img</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{project.title}</div>
                      <small className="text-muted">
                        Client: {project.client?.name || "Private Client"}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {project.category || "Uncategorized"}
                      </span>
                    </td>
                    <td>
                      <div className="small text-secondary">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}
                      </div>
                      {project.endDate && (
                        <div className="small text-muted" style={{ fontSize: '11px' }}>
                          to {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td>
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-2"
                          onClick={() => handleShowDetails(project)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <Link
                          href={`/dashboard/updateproject/${project._id}`}
                          className="btn btn-sm btn-outline-primary rounded-2"
                          title="Edit Project"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-2"
                          onClick={() => handleDeleteProject(project)}
                          title="Delete Project"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg" centered>
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold">
            {selectedProject?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {selectedProject && (
            <div className="row g-4">
              <div className="col-12 col-md-5">
                {selectedProject.mainImage && (
                  <div className="rounded-3 overflow-hidden border mb-3">
                    <img
                      src={selectedProject.mainImage}
                      alt={selectedProject.title}
                      className="img-fluid w-100"
                      style={{ maxHeight: '240px', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="p-3 bg-light rounded-3">
                  <div className="mb-2">
                    <span className="text-muted small d-block">Category</span>
                    <strong className="text-dark">{selectedProject.category || 'N/A'}</strong>
                  </div>
                  <div className="mb-2">
                    <span className="text-muted small d-block">Status</span>
                    {getStatusBadge(selectedProject.status)}
                  </div>
                  {selectedProject.address && (
                    <div className="mb-2">
                      <span className="text-muted small d-block">Location</span>
                      <span className="small text-dark">{selectedProject.address}</span>
                    </div>
                  )}
                  {selectedProject.budget && (
                    <div className="mb-2">
                      <span className="text-muted small d-block">Budget</span>
                      <span className="small text-dark">${selectedProject.budget}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-7">
                <h6 className="fw-bold text-dark border-bottom pb-2">Client Information</h6>
                <div className="row g-2 mb-3 small">
                  <div className="col-6">
                    <span className="text-muted d-block">Name:</span>
                    <strong>{selectedProject.client?.name || 'N/A'}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block">Email:</span>
                    <span>{selectedProject.client?.email || 'N/A'}</span>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block">Phone:</span>
                    <span>{selectedProject.client?.phone || 'N/A'}</span>
                  </div>
                </div>

                <h6 className="fw-bold text-dark border-bottom pb-2">Project Overview</h6>
                <div
                  className="small text-secondary"
                  dangerouslySetInnerHTML={{
                    __html: selectedProject.description || "<p>No description provided.</p>",
                  }}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0">
          <Button variant="secondary" onClick={handleCloseDetails} className="rounded-3">
            Close
          </Button>
          {selectedProject && (
            <Link
              href={`/dashboard/updateproject/${selectedProject._id}`}
              className="btn dashboard_all_button"
            >
              Edit Project
            </Link>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectList;
