'use client';

import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaLayerGroup } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [subCategoryInputs, setSubCategoryInputs] = useState({});
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
  const [editingSubCategoryName, setEditingSubCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    categories.length > 0 && selectedIds.length === categories.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map(c => c._id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    Swal.fire({
      title: `Delete ${selectedIds.length} categories?`,
      text: "All selected categories and their subcategories will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, delete ${selectedIds.length} categories`,
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: { popup: 'rounded-4' },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          text: `Deleting ${selectedIds.length} categories...`,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          await Promise.allSettled(
            selectedIds.map(id =>
              axios.delete(`https://3pcommunicationsserver.vercel.app/api/categories/${id}`)
            )
          );
          setCategories(prev => prev.filter(c => !selectedIds.includes(c._id)));
          setSelectedIds([]);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Selected categories have been removed.',
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error('Error during bulk delete:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete some categories.',
          });
        }
      }
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Error fetching categories');
      setMessageType('danger');
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const response = await axios.post('https://3pcommunicationsserver.vercel.app/api/categories', {
        name: newCategoryName.trim(),
      });
      setCategories(prev => [...prev, response.data]);
      setNewCategoryName('');
      setMessage('Category created successfully');
      setMessageType('success');
    } catch (error) {
      setMessage('Error creating category');
      setMessageType('danger');
    }
  };

  const handleUpdateCategory = async (e, categoryId) => {
    e.preventDefault();
    if (!editingCategoryName.trim()) return;
    try {
      await axios.put(`https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}`, {
        name: editingCategoryName.trim(),
      });
      setCategories(prev =>
        prev.map(c => (c._id === categoryId ? { ...c, name: editingCategoryName.trim() } : c))
      );
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setMessage('Category updated');
      setMessageType('success');
    } catch (error) {
      setMessage('Error updating category');
      setMessageType('danger');
    }
  };

  const handleDeleteCategory = (categoryId, categoryName) => {
    Swal.fire({
      title: `Delete "${categoryName}"?`,
      text: 'This will remove the category and all associated subcategories.',
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
          await axios.delete(`https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}`);
          setCategories(prev => prev.filter(c => c._id !== categoryId));
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Category deleted.',
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          setMessage('Error deleting category');
          setMessageType('danger');
        }
      }
    });
  };

  const handleAddSubCategory = async (e, categoryId) => {
    e.preventDefault();
    const subName = subCategoryInputs[categoryId]?.trim();
    if (!subName) return;

    try {
      const response = await axios.post(
        `https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}/subcategory`,
        { name: subName }
      );
      setCategories(prev =>
        prev.map(cat =>
          cat._id === categoryId
            ? {
                ...cat,
                subcategories: [...(cat.subcategories || []), response.data],
              }
            : cat
        )
      );
      setSubCategoryInputs({ ...subCategoryInputs, [categoryId]: '' });
      setMessage('Subcategory added');
      setMessageType('success');
    } catch (error) {
      setMessage('Error adding subcategory');
      setMessageType('danger');
    }
  };

  const handleUpdateSubCategory = async (e, categoryId, subCategoryId) => {
    e.preventDefault();
    if (!editingSubCategoryName.trim()) return;

    try {
      await axios.put(
        `https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}/subcategories/${subCategoryId}`,
        { name: editingSubCategoryName.trim() }
      );
      setCategories(prev =>
        prev.map(cat =>
          cat._id === categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub._id === subCategoryId ? { ...sub, name: editingSubCategoryName.trim() } : sub
                ),
              }
            : cat
        )
      );
      setEditingSubCategoryId(null);
      setEditingSubCategoryName('');
      setMessage('Subcategory updated');
      setMessageType('success');
    } catch (error) {
      setMessage('Error updating subcategory');
      setMessageType('danger');
    }
  };

  const handleDeleteSubCategory = async (categoryId, subCategoryId) => {
    try {
      await axios.delete(
        `https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}/subcategories/${subCategoryId}`
      );
      setCategories(prev =>
        prev.map(cat =>
          cat._id === categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.filter(sub => sub._id !== subCategoryId),
              }
            : cat
        )
      );
      setMessage('Subcategory deleted');
      setMessageType('success');
    } catch (error) {
      setMessage('Error deleting subcategory');
      setMessageType('danger');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <p className="loading-caption">Loading service categories...</p>
      </div>
    );
  }

  return (
    <div className="category-dashboard-wrapper">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="m-0 fw-bold">Service Categories</h2>
          <p className="text-muted small m-0 mt-1">
            Organize interior, exterior, and commercial architecture divisions and project classifications
          </p>
        </div>
      </div>

      {message && (
        <Alert variant={messageType} onClose={() => setMessage('')} dismissible className="rounded-3 mb-4">
          {message}
        </Alert>
      )}

      {/* Add New Category Box */}
      <div className="card p-4 mb-4 border-0 shadow-sm rounded-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <FaPlus className="text-primary small" /> Add New Service Category
        </h5>
        <Form onSubmit={handleAddCategory} className="d-flex flex-column flex-sm-row gap-2">
          <Form.Control
            type="text"
            placeholder="e.g. Commercial Architecture, Luxury Residential, Landscaping..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-grow-1"
          />
          <Button type="submit" className="dashboard_all_button d-inline-flex align-items-center gap-2 justify-content-center">
            <FaPlus /> Add Category
          </Button>
        </Form>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="alert alert-primary d-flex justify-content-between align-items-center mb-4 shadow-sm rounded-3 py-2 px-3 border-0 bg-primary text-white">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-primary rounded-pill px-2 py-1 fw-bold">
              {selectedIds.length}
            </span>
            <span className="fw-semibold">
              {selectedIds.length} {selectedIds.length === 1 ? 'category' : 'categories'} selected
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

      {/* Select All Checkbox Bar */}
      {categories.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <div className="form-check d-flex align-items-center gap-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="selectAllCategories"
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = selectedIds.length > 0 && !isAllSelected;
              }}
              onChange={handleSelectAll}
            />
            <label className="form-check-label small fw-semibold text-secondary user-select-none" htmlFor="selectAllCategories">
              Select All Categories ({categories.length})
            </label>
          </div>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="row g-4">
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category._id);
          return (
          <div key={category._id} className="col-12 col-lg-6">
            <div className={`card h-100 border-0 shadow-sm rounded-4 p-4 ${isSelected ? 'border border-2 border-primary bg-light' : ''}`}>
              {/* Category Header */}
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                {editingCategoryId === category._id ? (
                  <Form onSubmit={(e) => handleUpdateCategory(e, category._id)} className="d-flex align-items-center gap-2 flex-grow-1 me-2">
                    <Form.Control
                      type="text"
                      size="sm"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      autoFocus
                    />
                    <Button variant="success" size="sm" type="submit" className="d-flex align-items-center">
                      <FaCheck />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditingCategoryId(null)} className="d-flex align-items-center">
                      <FaTimes />
                    </Button>
                  </Form>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input me-1"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(category._id)}
                    />
                    <span className="p-2 rounded-3 bg-light text-primary">
                      <FaLayerGroup />
                    </span>
                    <div>
                      <h5 className="m-0 fw-bold text-dark">{category.name}</h5>
                      <small className="text-muted">
                        {(category.subcategories || []).length} Subcategories
                      </small>
                    </div>
                  </div>
                )}

                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-outline-secondary border-0 p-2 rounded-circle"
                    onClick={() => {
                      setEditingCategoryId(category._id);
                      setEditingCategoryName(category.name);
                    }}
                    title="Edit Category Name"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger border-0 p-2 rounded-circle"
                    onClick={() => handleDeleteCategory(category._id, category.name)}
                    title="Delete Category"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              <div className="mb-3 flex-grow-1">
                <span className="text-muted small d-block mb-2 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  Subcategories
                </span>
                {(!category.subcategories || category.subcategories.length === 0) ? (
                  <p className="text-muted small fst-italic">No subcategories created yet.</p>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {category.subcategories.map((sub) => (
                      <div key={sub._id}>
                        {editingSubCategoryId === sub._id ? (
                          <Form
                            onSubmit={(e) => handleUpdateSubCategory(e, category._id, sub._id)}
                            className="d-flex align-items-center gap-1"
                          >
                            <Form.Control
                              type="text"
                              size="sm"
                              value={editingSubCategoryName}
                              onChange={(e) => setEditingSubCategoryName(e.target.value)}
                              style={{ width: '130px' }}
                              autoFocus
                            />
                            <Button variant="success" size="sm" type="submit" className="p-1 px-2">
                              <FaCheck style={{ fontSize: '10px' }} />
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setEditingSubCategoryId(null)} className="p-1 px-2">
                              <FaTimes style={{ fontSize: '10px' }} />
                            </Button>
                          </Form>
                        ) : (
                          <div className="d-inline-flex align-items-center gap-2 bg-light border rounded-pill px-3 py-1">
                            <span className="small text-dark fw-medium">{sub.name}</span>
                            <button
                              className="btn btn-link p-0 text-muted"
                              onClick={() => {
                                setEditingSubCategoryId(sub._id);
                                setEditingSubCategoryName(sub.name);
                              }}
                              title="Edit Subcategory"
                            >
                              <FaEdit style={{ fontSize: '11px' }} />
                            </button>
                            <button
                              className="btn btn-link p-0 text-danger"
                              onClick={() => handleDeleteSubCategory(category._id, sub._id)}
                              title="Delete Subcategory"
                            >
                              <FaTrash style={{ fontSize: '11px' }} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Subcategory Input */}
              <div className="pt-2 border-top">
                <Form onSubmit={(e) => handleAddSubCategory(e, category._id)} className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Add subcategory..."
                    value={subCategoryInputs[category._id] || ''}
                    onChange={(e) =>
                      setSubCategoryInputs({
                        ...subCategoryInputs,
                        [category._id]: e.target.value,
                      })
                    }
                  />
                  <Button variant="outline-primary" size="sm" type="submit" className="d-inline-flex align-items-center gap-1">
                    <FaPlus /> Add
                  </Button>
                </Form>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryManagement;
