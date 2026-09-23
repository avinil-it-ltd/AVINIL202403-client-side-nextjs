'use client';

// src/Dashboard/CareerList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

// Loader Component
const Loader = () => (
    <div className="loader-container">
        <div className="custom-loader"></div>
    </div>
);

// CareerRow Component
const CareerRow = ({ career, onDelete, onStatusChange }) => (
    <tr>
        <td>{career.serial}</td>
        <td>{career.title}</td>
        <td>{career.description}</td>
        <td>
            <Button
                className='btn-sm'
                variant={career.status ? 'danger' : 'success'}
                onClick={() => onStatusChange(career._id, !career.status)}
            >
                {career.status ? 'Deactivate' : 'Activate'}
            </Button>
        </td>
        <td className='d-flex '>
            <Link to={`/dashboard/updateCareer/${career._id}`} className="btn btn-info btn-sm me-2">
                Update
            </Link>
            <Button variant="warning" size="sm" onClick={() => onDelete(career._id)}>
                Delete
            </Button>
        </td>
    </tr>
);

const CareerList = () => {
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCareers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/careers');
            console.log(response.data); // Log the entire response for debugging
            const careersWithSerial = response.data?.map((career, index) => ({
                ...career,
                serial: index + 1
            }));
            setCareers(careersWithSerial);
        } catch (err) {
            setError('Error fetching careers. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCareers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this career?')) {
            try {
                await axios.delete(`https://3pcommunicationsserver.vercel.app/api/careers/${id}`);
                setCareers(prevCareers => prevCareers.filter(career => career._id !== id));
            } catch (err) {
                setError('Error deleting career. Please try again later.');
                console.error(err);
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.patch(`https://3pcommunicationsserver.vercel.app/api/careers/status/${id}`, { status });
            fetchCareers(); // Refresh the list after status update
        } catch (err) {
            setError('Failed to update career status. Please try again later.');
            console.error(err);
        }
    };

    return (
        <div className="container card shadow-lg p-4 my-4">
            {loading && <Loader />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <>
                    <h2 className="text-center mb-4 " style={{ fontFamily: "Times New Roman" }}>Career List</h2>
                    <div className="text-end mb-3">
                        <Link to="/dashboard/addCareer" className="px-5 btn dashboard_all_button">
                            Add Career
                        </Link>
                    </div>
                    {careers.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Serial</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                    <th></th> {/* Empty header for alignment */}
                                </tr>
                            </thead>
                            <tbody>
                                {careers?.map(career => (
                                    <CareerRow
                                        key={career._id}
                                        career={career}
                                        onDelete={handleDelete}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-center">No careers available. Please add some career opportunities.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default CareerList;

