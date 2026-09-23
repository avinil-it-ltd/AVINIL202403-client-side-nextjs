'use client';

// src/Dashboard/AddCareer.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCareer = () => {
    const [career, setCareer] = useState({
        title: '',
        description: '',
        requirements: [''],
        salary: '',
        location: [''],
        vacancy: '',
        experienceRequired: [''],
        jobResponsibilities: '',
        employmentStatus: '',
        educationRequired: '',
        additionalRequirements: [''],
        compensationBenefits: [''],
        ageRequirement: '',
        deadline: ''
    });

    const navigate = useNavigate();

    const handleChange = (e, index, field) => {
        const { name, value } = e.target;

        // Handle array inputs
        if (field === 'array') {
            const updatedArray = [...career[name]];
            updatedArray[index] = value;
            setCareer({ ...career, [name]: updatedArray });
        } else {
            setCareer({ ...career, [name]: value });
        }
    };

    const addField = (field) => {
        setCareer({
            ...career,
            [field]: [...career[field], ''], // Add an empty string for a new input
        });
    };

    const removeField = (field, index) => {
        setCareer({
            ...career,
            [field]: career[field].filter((_, i) => i !== index), // Remove the field at the specified index
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://3pcommunicationsserver.vercel.app/api/careers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(career),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await response.json(); // Optionally handle the response
            navigate('/dashboard/careers');
        } catch (error) {
            console.error('Error creating career:', error);
        }
    };

    return (
        <div className="container my-4 w-75 mx-auto">
            <form onSubmit={handleSubmit} className="p-4 border border-light rounded shadow">
                <h2 className="text-center mb-4">Add Career</h2>
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Title <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="title"
                        value={career.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Description <span className="text-danger">*</span></label>
                    <textarea
                        name="description"
                        value={career.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="form-control"
                        rows="4"
                        required
                    />
                </div>
                
                {/* Requirements Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Requirements <span className="text-danger">*</span></label>
                    {career.requirements.map((requirement, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                name="requirements"
                                value={requirement}
                                onChange={(e) => handleChange(e, index, 'array')}
                                placeholder={`Requirement ${index + 1}`}
                                className="form-control me-2"
                                required
                            />
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField('requirements', index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={() => addField('requirements')}>Add Requirement</button>
                </div>

                {/* Salary Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Salary</label>
                    <input
                        type="text"
                        name="salary"
                        value={career.salary}
                        onChange={handleChange}
                        placeholder="Salary"
                        className="form-control"
                    />
                </div>
                
                {/* Location Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Location <span className="text-danger">*</span></label>
                    {career.location.map((loc, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                name="location"
                                value={loc}
                                onChange={(e) => handleChange(e, index, 'array')}
                                placeholder={`Location ${index + 1}`}
                                className="form-control me-2"
                                required
                            />
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField('location', index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={() => addField('location')}>Add Location</button>
                </div>

                {/* Vacancy Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Vacancy <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        name="vacancy"
                        value={career.vacancy}
                        onChange={handleChange}
                        placeholder="Number of vacancies"
                        className="form-control"
                        required
                    />
                </div>

                {/* Experience Required Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Experience Required</label>
                    {career.experienceRequired.map((exp, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                name="experienceRequired"
                                value={exp}
                                onChange={(e) => handleChange(e, index, 'array')}
                                placeholder={`Experience ${index + 1}`}
                                className="form-control me-2"
                            />
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField('experienceRequired', index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={() => addField('experienceRequired')}>Add Experience</button>
                </div>

                {/* Job Responsibilities Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Job Responsibilities</label>
                    <textarea
                        name="jobResponsibilities"
                        value={career.jobResponsibilities}
                        onChange={handleChange}
                        placeholder="Job Responsibilities"
                        className="form-control"
                        rows="4"
                    />
                </div>

                {/* Employment Status Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Employment Status</label>
                    <input
                        type="text"
                        name="employmentStatus"
                        value={career.employmentStatus}
                        onChange={handleChange}
                        placeholder="Full-time, Part-time, etc."
                        className="form-control"
                    />
                </div>

                {/* Education Required Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Education Required</label>
                    <input
                        type="text"
                        name="educationRequired"
                        value={career.educationRequired}
                        onChange={handleChange}
                        placeholder="Education qualification details"
                        className="form-control"
                    />
                </div>

                {/* Additional Requirements Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Additional Requirements</label>
                    {career.additionalRequirements.map((addReq, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                name="additionalRequirements"
                                value={addReq}
                                onChange={(e) => handleChange(e, index, 'array')}
                                placeholder={`Additional Requirement ${index + 1}`}
                                className="form-control me-2"
                            />
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField('additionalRequirements', index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={() => addField('additionalRequirements')}>Add Additional Requirement</button>
                </div>

                {/* Compensation & Benefits Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Compensation & Benefits</label>
                    {career.compensationBenefits.map((benefit, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                name="compensationBenefits"
                                value={benefit}
                                onChange={(e) => handleChange(e, index, 'array')}
                                placeholder={`Benefit ${index + 1}`}
                                className="form-control me-2"
                            />
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField('compensationBenefits', index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={() => addField('compensationBenefits')}>Add Benefit</button>
                </div>

                {/* Age Requirement Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Age Requirement</label>
                    <input
                        type="text"
                        name="ageRequirement"
                        value={career.ageRequirement}
                        onChange={handleChange}
                        placeholder="Age requirement details"
                        className="form-control"
                    />
                </div>

                {/* Deadline Field */}
                <div className="mb-3">
                    <label className='fw-bold pb-2'>Application Deadline</label>
                    <input
                        type="date"
                        name="deadline"
                        value={career.deadline}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-success">Add Career</button>
            </form>
        </div>
    );
};

export default AddCareer;

