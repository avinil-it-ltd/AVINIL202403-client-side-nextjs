'use client';

import React, { useEffect, useState } from 'react';
import { Form, Button, Table, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';



const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');

    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [subCategoryNames, setSubCategoryNames] = useState({}); // Object for subcategory names by category ID
    const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
    const [editingSubCategoryName, setEditingSubCategoryName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state




    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/categories');
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            setMessage('Error fetching categories');
            setMessageType('danger');
            setLoading(false);
        }
    };


    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://3pcommunicationsserver.vercel.app/api/categories/${editingCategoryId}`, { name: editingCategoryName });
            setCategories(categories.map(category =>
                category._id === editingCategoryId ? { ...category, name: editingCategoryName } : category
            ));
            setEditingCategoryId(null);
            setEditingCategoryName('');
            setMessage('Category updated successfully');
            setMessageType('success');
        } catch (error) {
            setMessage('Error updating category');
            setMessageType('danger');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://3pcommunicationsserver.vercel.app/api/categories', { name: categoryName });
            setCategories([...categories, response.data]);
            setCategoryName(''); // Clear category input
            setMessage('Category added successfully');
            setMessageType('success');
        } catch (error) {
            setMessage('Error adding category');
            setMessageType('danger');
        }
    };

    const handleAddSubCategory = async (e, categoryId) => {
        e.preventDefault();
        try {
            const subCategoryName = subCategoryNames[categoryId] || ''; // Get the subcategory name for this category
            const response = await axios.post(`https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}/subcategory`, { name: subCategoryName });

            // Ensure subcategories array exists and create a new reference to trigger re-render
            setCategories(categories.map(category =>
                category._id === categoryId
                    ? {
                        ...category,
                        subcategories: [...(category.subcategories || []), response.data] // Shallow copy with fallback
                    }
                    : category
            ));

            setSubCategoryNames({ ...subCategoryNames, [categoryId]: '' }); // Clear the subcategory input for this category
            setMessage('Subcategory added successfully');
            setMessageType('success');

            window.location.reload();
        } catch (error) {
            setMessage('Error adding subcategory');
            setMessageType('danger');
        }
    };

    const handleUpdateSubCategory = async (e, categoryId, subCategoryId) => {
        e.preventDefault();

        console.log('Editing Category ID:', categoryId);
        console.log('Editing Subcategory ID:', subCategoryId);

        if (!categoryId) {
            setMessage('Invalid category or subcategory ID');
            setMessageType('danger');
            return;
        }

        try {
            await axios.put(`https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}/subcategories/${subCategoryId}`, { name: editingSubCategoryName });
            // Update state logic...
        } catch (error) {
            setMessage('Error updating subcategory');
            setMessageType('danger');
        }
    };




    const handleDeleteSubCategory = async (categoryId, subCategoryId) => {
        try {
            await axios.delete(`https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}/subcategories/${subCategoryId}`);
            setCategories(categories.map(category =>
                category._id === categoryId ? { ...category, subcategories: category.subcategories.filter(sub => sub._id !== subCategoryId) } : category
            ));
            setMessage('Subcategory deleted successfully');
            setMessageType('success');
        } catch (error) {
            setMessage('Error deleting subcategory');
            setMessageType('danger');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.delete(`https://3pcommunicationsserver.vercel.app/api/categories/${categoryId}`);
            setCategories(categories.filter(category => category._id !== categoryId));
            setMessage('Category deleted successfully');
            setMessageType('success');
        } catch (error) {
            setMessage('Error deleting category');
            setMessageType('danger');
        }
    };
    const handleEditSubCategory = (categoryId, subCategoryId, subCategoryName) => {
        setEditingCategoryId(categoryId); // Set the editing category ID
        setEditingSubCategoryId(subCategoryId); // Set the editing subcategory ID
        setEditingSubCategoryName(subCategoryName); // Set the name for editing
    };




    // Custom Loader Component
    const Loader = () => (
        <div className="loader-container text-center mt-5">
            <div className="custom-loader"></div>
        </div>
    );

    if (loading) {
        return <Loader />;
    }





    return (
        <div className="container my-4 card  p-3 m-3 shadow-lg ">
            <h2 className="text-center mb-4" style={{ fontFamily: "Times New Roman" }}>Manage Categories</h2>

            {message && (
                <Alert variant={messageType} onClose={() => setMessage('')} dismissible>
                    {message}
                </Alert>
            )}

            <Form onSubmit={handleAddCategory} className="mb-4">
                <Form.Group controlId="formCategoryName" className="d-flex justify-content-between">
                    {/* <Form.Label className="mr-2">Category Name</Form.Label> */}
                    <Form.Control
                        type="text"
                        placeholder="Search By category name Or Add Category"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className="w-75 " // Makes the input take up available space
                        style={{ borderColor: '#003366', outline: "none", boxShadow: "none" }}// Dark blue border color
                    />
                    <Button className='w-25 ms-2  dashboard_all_button' variant="" type="submit">Add Category</Button>
                </Form.Group>
            </Form>


            {/* <h5>Categories</h5> */}
            <Table className='mt-4' striped bordered hover>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Subcategories</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category._id}>
                            <td>
                                {editingCategoryId === category._id ? (
                                    <Form onSubmit={handleUpdateCategory} className="d-flex align-items-center">
                                        <Form.Control
                                            type="text"
                                            value={editingCategoryName}
                                            onChange={(e) => setEditingCategoryName(e.target.value)}
                                            required
                                            className="me-2"
                                        />
                                        <Button variant="success" type="submit" className="me-2">Update</Button>
                                        <Button variant="secondary" onClick={() => { setEditingCategoryId(null); setEditingCategoryName(''); }}>Cancel</Button>
                                    </Form>
                                ) : (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{category.name}</span>
                                        <Button variant="warning" onClick={() => { setEditingCategoryId(category._id); setEditingCategoryName(category.name); }} className="ms-2" title="Edit Category">
                                            <FaEdit />
                                        </Button>
                                    </div>
                                )}
                            </td>
                            <td>
                                <ul className="list-unstyled">
                                    {category.subcategories.map((sub, index) => (


                                        <li key={sub._id} className="d-flex justify-content-between align-items-center mb-2">
                                            {editingSubCategoryId === sub._id ? (
                                                <Form onSubmit={(e) => handleUpdateSubCategory(e, category._id, sub._id)} className="d-flex align-items-center">
                                                    <Form.Control
                                                        type="text"
                                                        value={editingSubCategoryName}
                                                        onChange={(e) => setEditingSubCategoryName(e.target.value)}
                                                        required
                                                        className="me-2"
                                                    />
                                                    <Button variant="success" type="submit" className="me-2">Update</Button>
                                                    <Button variant="secondary" onClick={() => { setEditingSubCategoryId(null); setEditingSubCategoryName(''); }}>Cancel</Button>
                                                </Form>

                                            ) : (
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <span>{sub.name}</span>
                                                    <div>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteSubCategory(category._id, sub._id)}
                                                            className="me-1"
                                                            title="Delete Subcategory"
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingSubCategoryId(sub._id);
                                                                setEditingSubCategoryName(sub.name);
                                                            }}
                                                            title="Edit Subcategory"
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="text-center">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form onSubmit={(e) => handleAddSubCategory(e, category._id)} className="d-flex align-items-center">
                                        <Form.Control
                                            type="text"
                                            placeholder="Add Subcategory"
                                            value={subCategoryNames[category._id] || ''} // Access subcategory name for the specific category
                                            onChange={(e) => setSubCategoryNames({ ...subCategoryNames, [category._id]: e.target.value })}
                                            required
                                            className="me-2"
                                        />
                                        <Button variant="primary" size="sm" type="submit" title="Add Subcategory">
                                            <FaPlus />
                                        </Button>
                                    </Form>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteCategory(category._id)}
                                        className="ms-2"
                                        title="Delete Category"
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CategoryManagement;

