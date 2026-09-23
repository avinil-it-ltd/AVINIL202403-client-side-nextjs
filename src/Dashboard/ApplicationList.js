'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaTrash, FaSearch, FaFilePdf, FaCheck, FaTimes, FaUserTie } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Swal from 'sweetalert2';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showShortlisted, setShowShortlisted] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCareers = async () => {
    try {
      const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/careers');
      setCareers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching careers:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const params = {
        careerId: selectedCareer || undefined,
        searchTerm: searchTerm || undefined,
        showShortlisted: showShortlisted || undefined,
      };

      const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/applications/filtered', { params });
      setApplications(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedCareer, searchTerm, showShortlisted]);

  const handleShortlist = async (id, isShortlisted) => {
    try {
      const updatedStatus = !isShortlisted;
      setApplications(prev =>
        prev.map(app => (app._id === id ? { ...app, isShortlisted: updatedStatus } : app))
      );

      await axios.put(`https://3pcommunicationsserver.vercel.app/api/applications/shortlist/${id}`, {
        isShortlisted: updatedStatus,
      });
    } catch (err) {
      console.error('Error updating shortlist status:', err);
      fetchApplications();
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Delete Application?`,
      text: `Are you sure you want to delete the application from ${name || 'this candidate'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: { popup: 'rounded-4' },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://3pcommunicationsserver.vercel.app/api/applications/${id}`);
          setApplications(prev => prev.filter(app => app._id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Application removed.',
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error('Error deleting application:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete application.',
          });
        }
      }
    });
  };

  const handleViewResume = (url) => {
    setResumeUrl(url);
    setShowResumeModal(true);
  };

  const handleShowDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const shortlistedCount = applications.filter(a => a.isShortlisted).length;

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <p className="loading-caption">Loading job applications...</p>
      </div>
    );
  }

  return (
    <div className="applications-dashboard-wrapper">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="m-0 fw-bold">Candidate Applications</h2>
          <p className="text-muted small m-0 mt-1">
            Review recruitment submissions ({applications.length} Total · {shortlistedCount} Shortlisted)
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${!showShortlisted ? 'dashboard_all_button' : 'btn-outline-secondary'}`}
            onClick={() => setShowShortlisted(false)}
          >
            All Candidates
          </button>
          <button
            className={`btn btn-sm ${showShortlisted ? 'dashboard_all_button' : 'btn-outline-secondary'}`}
            onClick={() => setShowShortlisted(true)}
          >
            Shortlisted Only ({shortlistedCount})
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-3 mb-4 border-0 shadow-sm rounded-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search candidate name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control border-start-0 ps-0"
              />
              {searchTerm && (
                <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="form-select"
            >
              <option value="">All Career Positions ({careers.length})</option>
              {careers.map((career) => (
                <option key={career._id} value={career._id}>
                  {career.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-2 text-md-end text-muted small">
            <span>Showing {applications.length}</span>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

      {/* Applications Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '6%' }}>#</th>
                <th style={{ width: '24%' }}>Candidate</th>
                <th style={{ width: '20%' }}>Position</th>
                <th style={{ width: '16%' }}>Resume</th>
                <th style={{ width: '14%' }} className="text-center">Shortlist</th>
                <th style={{ width: '20%' }} className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No candidate applications found matching criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app, index) => (
                  <tr key={app._id}>
                    <td className="text-muted small">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            flexShrink: 0,
                          }}
                        >
                          {app.photo ? (
                            <img
                              src={app.photo}
                              alt={app.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <FaUserTie className="text-muted" />
                          )}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{app.name}</div>
                          <small className="text-muted">{app.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {app.careerId?.title || 'General Opening'}
                      </span>
                    </td>
                    <td>
                      {app.resume ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 rounded-2"
                          onClick={() => handleViewResume(app.resume)}
                        >
                          <FaFilePdf className="text-danger" /> View Resume
                        </button>
                      ) : app.resumePdfLink ? (
                        <a
                          href={app.resumePdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 rounded-2"
                        >
                          <FaFilePdf className="text-danger" /> PDF Link
                        </a>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={app.isShortlisted || false}
                          onChange={() => handleShortlist(app._id, app.isShortlisted)}
                          title="Toggle shortlist status"
                        />
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-2"
                          onClick={() => handleShowDetails(app)}
                          title="View Application Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-2"
                          onClick={() => handleDelete(app._id, app.name)}
                          title="Delete Application"
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
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Candidate Profile: {selectedApplication?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <div className="row g-4">
              <div className="col-12 col-md-4 text-center">
                <div
                  className="mx-auto mb-3"
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9',
                    border: '3px solid #ff6600',
                  }}
                >
                  {selectedApplication.photo ? (
                    <img
                      src={selectedApplication.photo}
                      alt={selectedApplication.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                      <FaUserTie size={48} />
                    </div>
                  )}
                </div>
                <h5 className="fw-bold m-0">{selectedApplication.name}</h5>
                <span className="badge bg-light text-dark border mt-1">
                  {selectedApplication.careerId?.title || 'Applicant'}
                </span>
                <div className="mt-3">
                  {selectedApplication.isShortlisted ? (
                    <span className="badge-pill-shortlisted">Shortlisted</span>
                  ) : (
                    <span className="badge-pill-pending">Review Pending</span>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-8">
                <h6 className="fw-bold text-dark border-bottom pb-2">Contact Details</h6>
                <div className="row g-2 mb-3 small">
                  <div className="col-6">
                    <span className="text-muted d-block">Email:</span>
                    <a href={`mailto:${selectedApplication.email}`} className="text-primary fw-medium">
                      {selectedApplication.email}
                    </a>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block">Phone:</span>
                    <span>{selectedApplication.phoneNumber || 'N/A'}</span>
                  </div>
                  {selectedApplication.address && (
                    <div className="col-12">
                      <span className="text-muted d-block">Address:</span>
                      <span>{selectedApplication.address}</span>
                    </div>
                  )}
                </div>

                <h6 className="fw-bold text-dark border-bottom pb-2">Professional Profiles & Links</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {selectedApplication.linkedinProfile && (
                    <a
                      href={selectedApplication.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                  {selectedApplication.portfolioLink && (
                    <a
                      href={selectedApplication.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-dark"
                    >
                      Portfolio Link
                    </a>
                  )}
                  {selectedApplication.resumePdfLink && (
                    <a
                      href={selectedApplication.resumePdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-danger"
                    >
                      Resume PDF
                    </a>
                  )}
                </div>

                {selectedApplication.description && (
                  <>
                    <h6 className="fw-bold text-dark border-bottom pb-2">Cover Note / Self Description</h6>
                    <p className="small text-secondary">{selectedApplication.description}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)} className="rounded-3">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Resume Modal */}
      <Modal show={showResumeModal} onHide={() => setShowResumeModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Candidate Resume Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <Zoom>
            <img src={resumeUrl} alt="Resume Preview" className="img-fluid rounded-3 shadow-sm" />
          </Zoom>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" href={resumeUrl} target="_blank" download className="rounded-3">
            Download File
          </Button>
          <Button variant="secondary" onClick={() => setShowResumeModal(false)} className="rounded-3">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplicationList;
