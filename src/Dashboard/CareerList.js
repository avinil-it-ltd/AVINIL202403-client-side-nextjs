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

      {/* Careers Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '6%' }}>#</th>
                <th style={{ width: '28%' }}>Position Title</th>
                <th style={{ width: '38%' }}>Description / Role Summary</th>
                <th style={{ width: '12%' }} className="text-center">Posting Status</th>
                <th style={{ width: '16%' }} className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {careers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No career postings active. Click "Post New Career" above to publish a job opening.
                  </td>
                </tr>
              ) : (
                careers.map((career, index) => (
                  <tr key={career._id}>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CareerList;
