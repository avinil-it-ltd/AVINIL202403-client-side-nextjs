'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaBullhorn } from 'react-icons/fa';
import Swal from 'sweetalert2';

const HeadlineDashboard = () => {
  const [headlines, setHeadlines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editHeadline, setEditHeadline] = useState(null);
  const [newHeadline, setNewHeadline] = useState({
    title: '',
    content: '',
    type: '',
    startDate: '',
    endDate: '',
    isActive: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchHeadlines = async () => {
    try {
      const res = await axios.get('https://3pcommunicationsserver.vercel.app/api/headlines/active');
      setHeadlines(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching headlines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const handleShowModal = (headline = null) => {
    setEditHeadline(headline);
    setNewHeadline(headline ? headline : {
      title: '',
      content: '',
      type: '',
      startDate: '',
      endDate: '',
      isActive: false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editHeadline) {
        await axios.put(`https://3pcommunicationsserver.vercel.app/api/headlines/${editHeadline._id}`, newHeadline);
      } else {
        await axios.post('https://3pcommunicationsserver.vercel.app/api/headlines', newHeadline);
      }
      fetchHeadlines();
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: 'Headline saved successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error saving headline:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save headline.',
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Headline?',
      text: 'Are you sure you want to delete this headline?',
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
          await axios.delete(`https://3pcommunicationsserver.vercel.app/api/headlines/${id}`);
          setHeadlines(prev => prev.filter(h => h._id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Headline removed.',
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete headline.',
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <p className="loading-caption">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="headline-dashboard-wrapper">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="m-0 fw-bold">Headline Ticker Management</h2>
          <p className="text-muted small m-0 mt-1">
            Publish dynamic ticker announcements across the top of the public website
          </p>
        </div>
        <Button onClick={() => handleShowModal()} className="dashboard_all_button d-inline-flex align-items-center gap-2">
          <FaPlus /> Add New Headline
        </Button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '6%' }}>#</th>
                <th style={{ width: '24%' }}>Title</th>
                <th style={{ width: '34%' }}>Content</th>
                <th style={{ width: '12%' }}>Start Date</th>
                <th style={{ width: '12%' }}>End Date</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '12%' }} className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {headlines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No active headlines found. Click "Add New Headline" to broadcast an update.
                  </td>
                </tr>
              ) : (
                headlines.map((headline, index) => (
                  <tr key={headline._id}>
                    <td className="text-muted small">{index + 1}</td>
                    <td>
                      <div className="fw-bold text-dark">{headline.title}</div>
                    </td>
                    <td>
                      <p className="small text-secondary m-0">{headline.content}</p>
                    </td>
                    <td className="small text-muted">
                      {headline.startDate ? new Date(headline.startDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="small text-muted">
                      {headline.endDate ? new Date(headline.endDate).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <span className={`badge ${headline.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {headline.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(headline)} className="rounded-2">
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(headline._id)} className="rounded-2">
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {editHeadline ? 'Edit Headline Announcement' : 'Create Headline Announcement'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Headline Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Eid Holiday Schedule / New Branch Opening"
                value={newHeadline.title}
                onChange={(e) => setNewHeadline({ ...newHeadline, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Headline Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter full ticker message..."
                value={newHeadline.content}
                onChange={(e) => setNewHeadline({ ...newHeadline, content: e.target.value })}
              />
            </Form.Group>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <Form.Label className="small fw-semibold">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newHeadline.startDate ? newHeadline.startDate.split('T')[0] : ''}
                  onChange={(e) => setNewHeadline({ ...newHeadline, startDate: e.target.value })}
                />
              </div>
              <div className="col-6">
                <Form.Label className="small fw-semibold">End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newHeadline.endDate ? newHeadline.endDate.split('T')[0] : ''}
                  onChange={(e) => setNewHeadline({ ...newHeadline, endDate: e.target.value })}
                />
              </div>
            </div>
            <Form.Check
              type="switch"
              id="headline-active-switch"
              label="Set as Active / Live Ticker"
              checked={newHeadline.isActive}
              onChange={(e) => setNewHeadline({ ...newHeadline, isActive: e.target.checked })}
              className="fw-semibold"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} className="rounded-3">
            Cancel
          </Button>
          <Button onClick={handleSave} className="dashboard_all_button">
            Save Headline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HeadlineDashboard;
