'use client';

// src/App.js
import React from 'react';
import './Introduction.css'; // Import your CSS
import { Link } from 'react-router-dom';
import banner1 from '../../../../src/assets/images/banner1.jpg';
import banner3 from '../../../../src/assets/images/banner3.jpg';

function Introduction() {
    return (
        <>
            <div className="intro-section" style={{ backgroundImage: "url('/images/bg-1.jpg')" }}>
                <div className="body_background">
                    <div className="container p-3">
                        <div className="row">
                            {/* Left Text Section */}
                            <div className="col-12 col-md-6 mx-auto text-section">
                                <h2 className="heading_color mt-5 text-start">3P Communication Interior & Exterior Design</h2>
                                <p className="fs-6 ">
                                    At 3P Communication, we prioritize collaboration in every project. Our design concepts emerge from close partnerships with our clients, ensuring a deep understanding of their goals and unique positions within the industry. Our talented team actively listens, conducts thorough research, and brings creative visions to life, crafting spaces that are not only visually stunning but also budget-conscious and practical. We are committed to delivering exceptional design solutions that meet the specific needs of each client.
                                </p>
                                <Link to="/interior">
                                    <button className="btn special_button mt-2">View Interior Projects</button>
                                </Link>
                            </div>

                            {/* Right Image Section */}
                            <div className="col-12 col-md-4 mx-auto image-section">
                                <img src={banner1?.src || banner1} className="rounded imageBorder" alt="Interior Design" />
                            </div>
                        </div>

                        <div className="row mt-5">
                            {/* Right Image Section */}
                            <div className="col-12 col-md-4 mx-auto image-section">
                                <img src={banner3?.src || banner3} className="rounded imageBorder" alt="Exterior Design" />
                            </div>

                            {/* Left Text Section */}
                            <div className="col-12 col-md-6 mx-auto text-section">
                                <h2 className="mt-5 heading_color text-start">Design as the people it serves</h2>
                                <p className="fs-6">
                                    We offer a full range of interior and exterior design services. Our focus on modern systems and detailed documentation allows us to create tailored solutions for each project. With award-winning design talent and solid project management skills, we ensure that every project is completed on time and within budget, all while maintaining high standards and attention to detail.
                                </p>
                                <Link to="/exterior">
                                    <button className="btn special_button">View Exterior Projects</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Introduction;

