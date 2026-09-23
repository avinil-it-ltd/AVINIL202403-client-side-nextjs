'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSearch, FaTrash, FaEnvelope, FaPhoneAlt, FaCheckCircle, FaFilter } from "react-icons/fa";

const ContactDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showShortlistedOnly, setShowShortlistedOnly] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        "https://3pcommunicationsserver.vercel.app/api/contacts"
      );
      setContacts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Lead?",
      text: `Are you sure you want to delete the inquiry from ${name || 'this client'}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        popup: "rounded-4"
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://3pcommunicationsserver.vercel.app/api/contacts/${id}`
        );
        fetchContacts();
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "The contact lead has been removed.",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error deleting contact:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete the contact lead.",
        });
      }
    }
  };

  const handleShortlistToggle = async (contact) => {
    const updatedStatus = !contact.shortlisted;
    try {
      // Optimistic update
      setContacts(prev => prev.map(c => c._id === contact._id ? { ...c, shortlisted: updatedStatus } : c));

      await axios.put(
        `https://3pcommunicationsserver.vercel.app/api/contacts/${contact._id}/shortlisted`,
        {
          shortlisted: updatedStatus,
        }
      );
    } catch (err) {
      console.error("Error updating shortlisted status:", err);
      // Revert on failure
      fetchContacts();
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const nameMatch = (contact.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (contact.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = (contact.phoneNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
    const messageMatch = (contact.message || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch || phoneMatch || messageMatch;

    if (showShortlistedOnly) {
      return matchesSearch && contact.shortlisted;
    }
    return matchesSearch;
  });

  const shortlistedCount = contacts.filter(c => c.shortlisted).length;

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <p className="loading-caption">Loading client inquiries...</p>
      </div>
    );
  }

  return (
    <div className="contact-dashboard-wrapper">
      {/* Header and Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="m-0 fw-bold">Client Inquiries & Leads</h2>
          <p className="text-muted small m-0 mt-1">
            Total {contacts.length} inquiries received · {shortlistedCount} marked for follow-up
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${!showShortlistedOnly ? 'dashboard_all_button' : 'btn-outline-secondary'}`}
            onClick={() => setShowShortlistedOnly(false)}
          >
            All Leads ({contacts.length})
          </button>
          <button
            className={`btn btn-sm ${showShortlistedOnly ? 'dashboard_all_button' : 'btn-outline-secondary'}`}
            onClick={() => setShowShortlistedOnly(true)}
          >
            <FaCheckCircle className="me-1" /> Shortlisted ({shortlistedCount})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-3 mb-4 border-0 shadow-sm rounded-3">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0 text-muted">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search by client name, email, phone, or inquiry message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 mb-4">
          Failed to synchronize with server. Please try refreshing.
        </div>
      )}

      {/* Contacts Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '22%' }}>Client</th>
                <th style={{ width: '24%' }}>Contact Details</th>
                <th style={{ width: '34%' }}>Inquiry Message</th>
                <th style={{ width: '10%' }} className="text-center">Shortlist</th>
                <th style={{ width: '10%' }} className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No inquiries found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>
                      <div className="fw-bold text-dark">{contact.name || 'Anonymous'}</div>
                      <small className="text-muted">
                        {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'Direct Lead'}
                      </small>
                    </td>
                    <td>
                      <div>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-decoration-none text-primary d-inline-flex align-items-center gap-1 small fw-semibold"
                        >
                          <FaEnvelope className="text-muted" /> {contact.email}
                        </a>
                      </div>
                      {contact.phoneNumber && (
                        <div>
                          <a
                            href={`tel:${contact.phoneNumber}`}
                            className="text-decoration-none text-secondary d-inline-flex align-items-center gap-1 small mt-1"
                          >
                            <FaPhoneAlt className="text-muted" style={{ fontSize: '10px' }} /> {contact.phoneNumber}
                          </a>
                        </div>
                      )}
                    </td>
                    <td>
                      <p className="m-0 text-secondary small" style={{ lineHeight: '1.4' }}>
                        {contact.message || '—'}
                      </p>
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id={`shortlist-${contact._id}`}
                          checked={contact.shortlisted || false}
                          onChange={() => handleShortlistToggle(contact)}
                          title="Toggle shortlisted"
                        />
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        onClick={() => handleDelete(contact._id, contact.name)}
                        className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
                        title="Delete Inquiry"
                      >
                        <FaTrash />
                      </button>
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

export default ContactDashboard;
