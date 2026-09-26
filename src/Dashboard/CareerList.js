'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBriefcase } from 'react-icons/fa';
import Swal from 'sweetalert2';

const CareerList = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/careers');
      const data = Array.isArray(response.data) ? response.data : [];
      setCareers(data);
    } catch (err) {
      setError('Error fetching career openings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleDelete = (id, title) => {
    Swal.fire({
      title: `Delete Position?`,
      text: `Are you sure you want to remove "${title || 'this career opening'}"?`,
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
          await axios.delete(`https://3pcommunicationsserver.vercel.app/api/careers/${id}`);
          setCareers(prev => prev.filter(c => c._id !== id));
          setSelectedIds(prev => prev.filter(itemId => itemId !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Career posting has been removed.',
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete career position.',
          });
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    Swal.fire({
      title: `Delete ${selectedIds.length} career postings?`,
      text: "Are you sure you want to permanently delete all selected career openings? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, delete ${selectedIds.length} openings`,
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: { popup: 'rounded-4' },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          text: `Deleting ${selectedIds.length} career postings...`,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          await Promise.allSettled(
            selectedIds.map(id =>
              axios.delete(`https://3pcommunicationsserver.vercel.app/api/careers/${id}`)
            )
          );
          setCareers(prev => prev.filter(c => !selectedIds.includes(c._id)));
          setSelectedIds([]);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Selected career postings have been removed.',
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error('Error during bulk delete:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete some career postings.',
          });
        }
      }
    });
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    careers.length > 0 && selectedIds.length === careers.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(careers.map(c => c._id));
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      setCareers(prev =>
        prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
      );
      await axios.patch(`https://3pcommunicationsserver.vercel.app/api/careers/status/${id}`, {
        status: newStatus,
      });
    } catch (err) {
      console.error(err);
      fetchCareers();
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <p className="loading-caption">Loading career openings...</p>
      </div>
    );
  }

  return (
    <div className="careers-dashboard-wrapper">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="m-0 fw-bold">Career Postings</h2>
          <p className="text-muted small m-0 mt-1">
            Manage job vacancies, recruitment requirements, and application status ({careers.length} Total)
          </p>
        </div>
        <Link href="/dashboard/addCareer" className="btn dashboard_all_button d-inline-flex align-items-center gap-2">
          <FaPlus /> Post New Career
        </Link>
      </div>

      {error && <Alert variant="danger" className="rounded-3 mb-4">{error}</Alert>}

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="alert alert-primary d-flex justify-content-between align-items-center mb-3 shadow-sm rounded-3 py-2 px-3 border-0 bg-primary text-white">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-primary rounded-pill px-2 py-1 fw-bold">
              {selectedIds.length}
            </span>
            <span className="fw-semibold">
              {selectedIds.length} {selectedIds.length === 1 ? 'position' : 'positions'} selected
            </span>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1 rounded-2 shadow-sm"
              onClick={handleBulkDelete}
            >
              <FaTrash /> Delete Selected ({selectedIds.length})
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

      {/* Careers Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '4%' }} className="text-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = selectedIds.length > 0 && !isAllSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    title="Select all career positions"
                  />
                </th>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '27%' }}>Position Title</th>
                <th style={{ width: '36%' }}>Description / Role Summary</th>
                <th style={{ width: '12%' }} className="text-center">Posting Status</th>
                <th style={{ width: '16%' }} className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {careers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No career postings active. Click "Post New Career" above to publish a job opening.
                  </td>
                </tr>
              ) : (
                careers.map((career, index) => {
                  const isSelected = selectedIds.includes(career._id);
                  return (
                  <tr key={career._id} className={isSelected ? 'table-active' : ''}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(career._id)}
                      />
                    </td>
                    <td className="text-muted small">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 102, 0, 0.1)',
                            color: '#ff6600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FaBriefcase />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{career.title}</div>
                          <small className="text-muted">
                            {career.location || 'Dhaka, Bangladesh'}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="small text-secondary m-0" style={{ maxWidth: '400px', lineHeight: '1.4' }}>
                        {career.description?.length > 100
                          ? `${career.description.substring(0, 100)}...`
                          : career.description || '—'}
                      </p>
                    </td>
                    <td className="text-center">
                      <button
                        className={`btn btn-sm ${
                          career.status ? 'btn-outline-success' : 'btn-outline-secondary'
                        } rounded-pill px-3 py-1`}
                        onClick={() => handleStatusChange(career._id, career.status)}
                        title="Toggle active status"
                      >
                        {career.status ? 'Active' : 'Closed'}
                      </button>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <Link
                          href={`/dashboard/updateCareer/${career._id}`}
                          className="btn btn-sm btn-outline-primary rounded-2"
                          title="Edit Career Opening"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-2"
                          onClick={() => handleDelete(career._id, career.title)}
                          title="Delete Position"
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
      </div>
    </div>
  );
};

export default CareerList;
