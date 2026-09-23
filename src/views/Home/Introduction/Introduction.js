'use client';

import React from 'react';
import './Introduction.css';
import Link from 'next/link';
import banner1 from '../../../../src/assets/images/banner1.jpg';
import banner3 from '../../../../src/assets/images/banner3.jpg';

function Introduction() {
    return (
        <section className="intro-section" style={{ backgroundColor: "#faf8f5" }}>
            <div className="body_background">
                <div className="container p-3">
                    <div className="row align-items-center">
                        {/* Left Text Section */}
                        <div className="col-12 col-md-6 mx-auto text-section">
                            <h2 className="heading_color mt-4 text-start">3P Communication Interior &amp; Exterior Design</h2>
                            <p className="fs-6 text-muted">
                                At 3P Communication, we prioritize collaboration in every project. Our design concepts emerge from close partnerships with our clients, ensuring a deep understanding of their goals and unique style. Our talented team actively listens, conducts thorough site planning, and brings creative visions to life, crafting spaces that are not only visually stunning but also budget-conscious and practical.
                            </p>
                            <Link href="/interior">
                                <button className="btn special_button mt-2">View Interior Projects</button>
                            </Link>
                        </div>

                        {/* Right Image Section */}
                        <div className="col-12 col-md-5 mx-auto image-section">
                            <img src={banner1?.src || banner1} className="rounded imageBorder" alt="Interior Design" />
                        </div>
                    </div>

                    <div className="row mt-5 align-items-center">
                        {/* Right Image Section */}
                        <div className="col-12 col-md-5 mx-auto image-section">
                            <img src={banner3?.src || banner3} className="rounded imageBorder" alt="Exterior Design" />
                        </div>

                        {/* Left Text Section */}
                        <div className="col-12 col-md-6 mx-auto text-section">
                            <h2 className="mt-4 heading_color text-start">Design Crafted for the People It Serves</h2>
                            <p className="fs-6 text-muted">
                                We offer a full range of interior and exterior design services across Dhaka and beyond. Our focus on modern architectural systems and transparent documentation allows us to create tailored solutions for each project. With skilled design talent and solid project management, we ensure every project is completed on time and within budget.
                            </p>
                            <Link href="/exterior">
                                <button className="btn special_button mt-2">View Exterior Projects</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Introduction;
