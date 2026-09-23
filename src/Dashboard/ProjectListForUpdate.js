'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProjectListForUpdate = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/projects');
                // const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/projects');
                setProjects(response.data);
            } catch (error) {
                setError('Error fetching projects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-5">
        <h2 className="text-center mb-4">Select a Project to Update</h2>
        <div className="card ">
            <div className="card-header bg-primary text-white text-center">
                <h4 className="mb-0">Project List</h4>
            </div>
            <div className="card-body">
                {projects.length > 0 ? (
                    <ul className="list-group">
                        {projects.map((project) => (
                            <li key={project._id} className="list-group-item d-flex justify-content-between align-items-center">
                                {project.title}
                                <Link 
                                    to={`/dashboard/updateProject/${project._id}`} 
                                    className="text-decoration-none text-dark fw-bold"
                                >
                                    <span className="badge bg-secondary rounded-pill">Update</span>
                                    
                                </Link>
                                
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center">
                        <p className="mb-0">No projects available.</p>
                    </div>
                )}
            </div>
            <div className="card-footer text-center">
                <Link to="/dashboard/addProject" className="btn btn-success">
                    Add New Project
                </Link>
            </div>
        </div>
    </div>
    );
};

export default ProjectListForUpdate;

