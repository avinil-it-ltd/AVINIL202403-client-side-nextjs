'use client';

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaExternalLinkAlt, 
  FaArrowUp, 
  FaArrowDown, 
  FaDownload, 
  FaLayerGroup,
  FaCheckCircle,
  FaSortAmountDown,
  FaImages,
  FaUndo
} from "react-icons/fa";
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

  // Filter & Search states
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [categories, setCategories] = useState([]);

  // Sorting & Ordering
  const [sortBy, setSortBy] = useState("newest");
  const [customOrderIds, setCustomOrderIds] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("3p_projects_custom_order");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading custom order from localStorage:", e);
      }
    }
    return [];
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);

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

  // Save custom order to localStorage
  const saveCustomOrder = (newOrderIds) => {
    setCustomOrderIds(newOrderIds);
    if (typeof window !== "undefined") {
      localStorage.setItem("3p_projects_custom_order", JSON.stringify(newOrderIds));
    }
  };

  // Reorder project Up or Down
  const handleMoveProject = (projectId, direction) => {
    // We reorder within the currently sorted list
    const currentList = [...sortedProjects];
    const index = currentList.findIndex((p) => p._id === projectId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const itemToMove = currentList[index];
    currentList.splice(index, 1);
    currentList.splice(targetIndex, 0, itemToMove);

    const newIds = currentList.map((p) => p._id);
    saveCustomOrder(newIds);
    if (sortBy !== "custom") {
      setSortBy("custom");
    }

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Display order updated",
      showConfirmButton: false,
      timer: 1200,
    });
  };

  // Dynamic KPI Stats
  const stats = useMemo(() => {
    const total = projects.length;
    const interior = projects.filter((p) => p.category?.toLowerCase() === "interior design").length;
    const exterior = projects.filter((p) => p.category?.toLowerCase() === "exterior design").length;
    const event = projects.filter((p) => p.category?.toLowerCase() === "event management").length;
    const completed = projects.filter((p) => p.status?.toLowerCase() === "completed").length;
    const running = projects.filter((p) => p.status?.toLowerCase() === "running").length;
    return { total, interior, exterior, event, completed, running };
  }, [projects]);

  // Dynamically extract available subcategories with counts based on selected category
  const availableSubcategories = useMemo(() => {
    let relevantProjects = projects;
    if (selectedCategory) {
      relevantProjects = projects.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    const counts = {};
    relevantProjects.forEach((p) => {
      const sub = p.subcategory || "General";
      counts[sub] = (counts[sub] || 0) + 1;
    });

    const list = [
      { name: "", label: selectedCategory ? `All ${selectedCategory}` : "All Subcategories", count: relevantProjects.length }
    ];
    Object.keys(counts).sort().forEach((sub) => {
      list.push({ name: sub, label: sub, count: counts[sub] });
    });
    return list;
  }, [projects, selectedCategory]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory
        ? project.category?.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const matchesSubcategory = selectedSubcategory
        ? (project.subcategory || "General").toLowerCase() === selectedSubcategory.toLowerCase()
        : true;
      const matchesStatus = selectedStatus
        ? (project.status || "").toLowerCase() === selectedStatus.toLowerCase()
        : true;

      const query = searchText.toLowerCase().trim();
      const titleMatch = (project.title || "").toLowerCase().includes(query);
      const clientMatch = (project.client?.name || "").toLowerCase().includes(query);
      const addressMatch = (project.address || "").toLowerCase().includes(query);
      const matchesSearch = query ? titleMatch || clientMatch || addressMatch : true;

      return matchesCategory && matchesSubcategory && matchesStatus && matchesSearch;
    });
  }, [projects, selectedCategory, selectedSubcategory, selectedStatus, searchText]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    if (sortBy === "newest") {
      return list.sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0));
    }
    if (sortBy === "oldest") {
      return list.sort((a, b) => new Date(a.createdAt || a.startDate || 0) - new Date(b.createdAt || b.startDate || 0));
    }
    if (sortBy === "title-asc") {
      return list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    if (sortBy === "title-desc") {
      return list.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    }
    if (sortBy === "budget-desc") {
      return list.sort((a, b) => (Number(b.budget) || 0) - (Number(a.budget) || 0));
    }
    if (sortBy === "budget-asc") {
      return list.sort((a, b) => (Number(a.budget) || 0) - (Number(b.budget) || 0));
    }
    if (sortBy === "custom" && customOrderIds.length > 0) {
      return list.sort((a, b) => {
        const indexA = customOrderIds.indexOf(a._id);
        const indexB = customOrderIds.indexOf(b._id);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }
    return list;
  }, [filteredProjects, sortBy, customOrderIds]);

  // Pagination calculation
  const totalItems = sortedProjects.length;
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedProjects = useMemo(() => {
    if (itemsPerPage === -1) return sortedProjects;
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return sortedProjects.slice(start, start + itemsPerPage);
  }, [sortedProjects, safeCurrentPage, itemsPerPage]);

  const startIndex = itemsPerPage === -1 ? 1 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endIndex = itemsPerPage === -1 ? totalItems : Math.min(safeCurrentPage * itemsPerPage, totalItems);

  // Bulk selection handlers
  const handleSelectAllOnPage = (e) => {
    if (e.target.checked) {
      const pageIds = paginatedProjects.map((p) => p._id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = new Set(paginatedProjects.map((p) => p._id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllPageSelected =
    paginatedProjects.length > 0 &&
    paginatedProjects.every((p) => selectedIds.includes(p._id));

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    Swal.fire({
      title: `Delete ${selectedIds.length} projects?`,
      text: "All selected projects and their associated media will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete selected",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      background: "#ffffff",
      customClass: { popup: "rounded-4" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedIds.map((id) =>
              axios.delete(`https://3pcommunicationsserver.vercel.app/api/projects/${id}`)
            )
          );
          setProjects((prev) => prev.filter((p) => !selectedIds.includes(p._id)));
          setSelectedIds([]);
          Swal.fire({
            icon: "success",
            title: "Projects Deleted",
            text: "Successfully deleted selected projects.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Bulk delete error:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete some projects. Please try again.",
          });
        }
      }
    });
  };

  // CSV Export
  const handleExportCSV = (itemsToExport = sortedProjects, filename = "3p_projects_export.csv") => {
    const headers = [
      "Title",
      "Category",
      "Subcategory",
      "Client Name",
      "Client Phone",
      "Client Email",
      "Budget",
      "Status",
      "Address",
      "Start Date",
      "End Date",
    ];
    const rows = itemsToExport.map((p) => [
      `"${(p.title || "").replace(/"/g, '""')}"`,
      `"${(p.category || "").replace(/"/g, '""')}"`,
      `"${(p.subcategory || "").replace(/"/g, '""')}"`,
      `"${(p.client?.name || "").replace(/"/g, '""')}"`,
      `"${(p.client?.phone || "").replace(/"/g, '""')}"`,
      `"${(p.client?.email || "").replace(/"/g, '""')}"`,
      `"${p.budget || ""}"`,
      `"${(p.status || "").replace(/"/g, '""')}"`,
      `"${(p.address || "").replace(/"/g, '""')}"`,
      `"${p.startDate ? new Date(p.startDate).toLocaleDateString() : ""}"`,
      `"${p.endDate ? new Date(p.endDate).toLocaleDateString() : ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      customClass: { popup: "rounded-4" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://3pcommunicationsserver.vercel.app/api/projects/${project._id}`
          );
          setProjects((prev) => prev.filter((p) => p._id !== project._id));
          setSelectedIds((prev) => prev.filter((id) => id !== project._id));
          Swal.fire({
            icon: "success",
            title: "Project Deleted",
            text: `"${project.title}" has been deleted.`,
            timer: 1500,
            showConfirmButton: false,
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

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed") {
      return <span className="chip-mini chip-completed">Completed</span>;
    }
    if (s === "running") {
      return <span className="chip-mini chip-running">Running</span>;
    }
    return <span className="chip-mini chip-pending">Pending</span>;
  };

  const clearAllFilters = () => {
    setSearchText("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedStatus("");
    setSortBy("newest");
    setCurrentPage(1);
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
            Manage live showcases, subcategories, ordering, and project visibility ({projects.length} Total)
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 rounded-3"
            onClick={() => handleExportCSV()}
            title="Download CSV export of currently filtered projects"
          >
            <FaDownload /> Export CSV
          </button>
          <Link
            href="/dashboard/addProject"
            className="btn dashboard_all_button d-inline-flex align-items-center gap-2"
          >
            <FaPlus /> Add New Project
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
            <div className="kpi-icon-wrapper kpi-orange">
              <FaLayerGroup />
            </div>
            <div>
              <div className="text-muted small fw-semibold">Total Projects</div>
              <h4 className="m-0 fw-bold text-dark">{stats.total}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
            <div className="kpi-icon-wrapper" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
              <FaCheckCircle />
            </div>
            <div>
              <div className="text-muted small fw-semibold">Completed</div>
              <h4 className="m-0 fw-bold text-dark">{stats.completed}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
            <div className="kpi-icon-wrapper" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
              <FaImages />
            </div>
            <div>
              <div className="text-muted small fw-semibold">Interior Design</div>
              <h4 className="m-0 fw-bold text-dark">{stats.interior}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
            <div className="kpi-icon-wrapper" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
              <FaSortAmountDown />
            </div>
            <div>
              <div className="text-muted small fw-semibold">Running / Active</div>
              <h4 className="m-0 fw-bold text-dark">{stats.running}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="p-3 bg-white">
          <div className="row g-2 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search title, client, or location..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-control border-start-0 ps-0"
                />
                {searchText && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setSearchText("");
                      setCurrentPage(1);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Select */}
            <div className="col-6 col-md-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory(""); // Reset subcat when category changes
                  setCurrentPage(1);
                }}
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

            {/* Status Select */}
            <div className="col-6 col-md-2">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-select"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="running">Running</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="col-6 col-md-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-select"
                title="Sort Projects"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="title-asc">Title: A &rarr; Z</option>
                <option value="title-desc">Title: Z &rarr; A</option>
                <option value="budget-desc">Budget: High to Low</option>
                <option value="budget-asc">Budget: Low to High</option>
                <option value="custom">Custom Order (Manual)</option>
              </select>
            </div>

            {/* Page Size Select */}
            <div className="col-6 col-md-1">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select px-2"
                title="Items per page"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={-1}>All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Subcategory Filter Buttons Strip */}
        <div className="project-subcat-bar">
          <span className="small text-muted fw-bold me-1 d-inline-flex align-items-center gap-1">
            <FaLayerGroup /> Subcategory:
          </span>
          {availableSubcategories.map((sub) => {
            const isActive = selectedSubcategory.toLowerCase() === sub.name.toLowerCase();
            return (
              <button
                key={sub.name || "all-subcats"}
                type="button"
                className={`subcat-pill-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  setSelectedSubcategory(sub.name);
                  setCurrentPage(1);
                }}
              >
                <span>{sub.label}</span>
                <span className="subcat-pill-count">{sub.count}</span>
              </button>
            );
          })}
          {(searchText || selectedCategory || selectedSubcategory || selectedStatus || sortBy !== "newest") && (
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none text-danger ms-auto p-0 d-inline-flex align-items-center gap-1"
              onClick={clearAllFilters}
            >
              <FaUndo style={{ fontSize: "10px" }} /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Selection Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bulk-actions-banner">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark px-2 py-1 fw-bold">
              {selectedIds.length} Selected
            </span>
            <span className="small text-light">
              Manage selected projects across this view
            </span>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-light d-inline-flex align-items-center gap-1 rounded-2"
              onClick={() => {
                const selectedItems = projects.filter((p) => selectedIds.includes(p._id));
                handleExportCSV(selectedItems, `3p_selected_${selectedIds.length}_projects.csv`);
              }}
            >
              <FaDownload /> Export ({selectedIds.length})
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1 rounded-2"
              onClick={handleBulkDelete}
            >
              <FaTrash /> Delete ({selectedIds.length})
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-light rounded-2"
              onClick={() => setSelectedIds([])}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "3%", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isAllPageSelected}
                    onChange={handleSelectAllOnPage}
                    title="Select all on page"
                  />
                </th>
                <th style={{ width: "8%" }}>Cover</th>
                <th style={{ width: "26%" }}>Project Details</th>
                <th style={{ width: "16%" }}>Category / Subcategory</th>
                <th style={{ width: "12%" }}>Timeline</th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "10%" }} className="text-center" title="Custom display priority order">
                  Order
                </th>
                <th style={{ width: "15%" }} className="text-end pe-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <p className="m-0 mb-2">No projects found matching the current filters.</p>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                      onClick={clearAllFilters}
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project, index) => {
                  const isSelected = selectedIds.includes(project._id);
                  const isFirst = index === 0 && safeCurrentPage === 1;
                  const isLast =
                    index === paginatedProjects.length - 1 &&
                    safeCurrentPage === totalPages;
                  const galleryCount = project.additionalImages?.length || 0;

                  return (
                    <tr key={project._id} className={isSelected ? "table-active" : ""}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(project._id)}
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e2e8f0",
                            position: "relative",
                          }}
                        >
                          {project.mainImage ? (
                            <img
                              src={project.mainImage}
                              alt={project.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <span className="text-muted" style={{ fontSize: "10px" }}>
                              No img
                            </span>
                          )}
                          {galleryCount > 0 && (
                            <span className="gallery-count-badge" title={`${galleryCount} additional photos`}>
                              +{galleryCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{project.title}</div>
                        <small className="text-muted d-block">
                          Client: {project.client?.name || "Private Client"}
                        </small>
                        {project.address && (
                          <small className="text-secondary" style={{ fontSize: "11px" }}>
                            📍 {project.address}
                          </small>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border d-inline-block mb-1">
                          {project.category || "Uncategorized"}
                        </span>
                        {project.subcategory && (
                          <div className="small text-muted" style={{ fontSize: "11px" }}>
                            ↳ {project.subcategory}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="small text-secondary">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}
                        </div>
                        {project.endDate && (
                          <div className="small text-muted" style={{ fontSize: "11px" }}>
                            to {new Date(project.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td>{getStatusBadge(project.status)}</td>
                      <td className="text-center">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="reorder-btn"
                            disabled={isFirst}
                            onClick={() => handleMoveProject(project._id, "up")}
                            title="Move Project Up in Display Order"
                          >
                            <FaArrowUp />
                          </button>
                          <button
                            type="button"
                            className="reorder-btn"
                            disabled={isLast}
                            onClick={() => handleMoveProject(project._id, "down")}
                            title="Move Project Down in Display Order"
                          >
                            <FaArrowDown />
                          </button>
                        </div>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-inline-flex gap-2">
                          <a
                            href={`/details/${project._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-info rounded-2"
                            title="View Live Public Showcase Page"
                          >
                            <FaExternalLinkAlt />
                          </a>
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-2"
                            onClick={() => handleShowDetails(project)}
                            title="Quick View Details Modal"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count Bar */}
        <div className="p-3 bg-white border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="small text-muted">
            {totalItems === 0 ? (
              "No projects to display"
            ) : (
              <>
                Showing <strong className="text-dark">{startIndex}</strong> to{" "}
                <strong className="text-dark">{endIndex}</strong> of{" "}
                <strong className="text-dark">{totalItems}</strong> projects
                {selectedCategory && (
                  <span className="ms-1">
                    in <em>{selectedCategory}</em>
                  </span>
                )}
                {selectedSubcategory && (
                  <span className="ms-1">
                    &rsaquo; <em>{selectedSubcategory}</em>
                  </span>
                )}
              </>
            )}
          </div>

          {totalPages > 1 && (
            <div className="d-inline-flex align-items-center gap-1">
              <button
                type="button"
                className="pagination-btn"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                &larr; Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, and window around current page
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= safeCurrentPage - 2 && page <= safeCurrentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      type="button"
                      className={`pagination-btn ${safeCurrentPage === page ? "active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                }
                if (page === safeCurrentPage - 3 || page === safeCurrentPage + 3) {
                  return (
                    <span key={page} className="px-1 text-muted small">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                type="button"
                className="pagination-btn"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg" centered>
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold">{selectedProject?.title}</Modal.Title>
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
                      style={{ maxHeight: "240px", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="p-3 bg-light rounded-3">
                  <div className="mb-2">
                    <span className="text-muted small d-block">Category</span>
                    <strong className="text-dark">{selectedProject.category || "N/A"}</strong>
                  </div>
                  {selectedProject.subcategory && (
                    <div className="mb-2">
                      <span className="text-muted small d-block">Subcategory</span>
                      <strong className="text-dark">{selectedProject.subcategory}</strong>
                    </div>
                  )}
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
                  {selectedProject.additionalImages?.length > 0 && (
                    <div className="mt-3">
                      <span className="text-muted small d-block mb-1">
                        Gallery ({selectedProject.additionalImages.length} images)
                      </span>
                      <div className="d-flex gap-2 flex-wrap">
                        {selectedProject.additionalImages.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-7">
                <h6 className="fw-bold text-dark border-bottom pb-2">Client Information</h6>
                <div className="row g-2 mb-3 small">
                  <div className="col-6">
                    <span className="text-muted d-block">Name:</span>
                    <strong>{selectedProject.client?.name || "N/A"}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block">Email:</span>
                    <span>{selectedProject.client?.email || "N/A"}</span>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block">Phone:</span>
                    <span>{selectedProject.client?.phone || "N/A"}</span>
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
          {selectedProject && (
            <a
              href={`/details/${selectedProject._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-info rounded-3 me-auto d-inline-flex align-items-center gap-1"
            >
              <FaExternalLinkAlt /> Live Public Page
            </a>
          )}
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
