'use client';

// src/App.js
import React from 'react';
import './Services.css'; // Import your CSS
import inte from '../../../../src/assets/1.png';
import india_gate from '../../../../src/assets/india-gate.png';
import wedding from '../../../../src/assets/wedding-ring.png';

function Services() {
    return (
        <>
            <div className="service_bg">
                <div className="service_content py-5">
                    <div className="text-center h2 text-white py-5" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                        <h2>Explore Our Services</h2>
                    </div>

                    <div className="container">
                        <div className="row p-4 pb-5">
                            <div className="col-12 col-sm-6 col-md-4 text-center mb-4">
                                <img src={inte?.src || inte} className="imageBorder p-2 bg-white" width="200px" height="150px" alt="Interior" />
                                <div className="text-center h4 text-white p-2" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                                    Interior
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-md-4 text-center mb-4">
                                <img src={india_gate?.src || india_gate} className="imageBorder p-2 bg-white" width="200px" height="150px" alt="Exterior" />
                                <div className="text-center h4 text-white p-2" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                                    Exterior
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-md-4 text-center mb-4">
                                <img src={wedding?.src || wedding} className="imageBorder p-2 bg-white" width="200px" height="150px" alt="Event" />
                                <div className="text-center h4 text-white p-2" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                                    Event
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Services;

