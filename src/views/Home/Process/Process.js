'use client';

// src/App.js
import React from 'react';
import './Process.css'; // Import your CSS
import ideas from '../../../../src/assets/images/idea.png';
import design from '../../../../src/assets/images/interior-design.png';
import meeting from '../../../../src/assets/images/business-meeting.png';
import delivery from '../../../../src/assets/images/delivery.png';

function Process() {
    return (
        <>
            <div className="process-section mt-0 mb-5">
                <div className="process-background">
                    <h1 className="text-center mt-0 p-5 heading_color" style={{ fontFamily: "'Aref Ruqaa', serif" }}>Our Process</h1>
                    <div className="container">
                        <div className="row g-4">
                            {/* Idea & Concept */}
                            <div className="col-12 col-sm-6 col-md-3 text-center process-step">
                                <div className="image-container mx-auto">
                                    <img src={ideas} alt="Idea & Concept" />
                                </div>
                                <div className="h2 process-title">Idea & Concept</div>
                            </div>

                            {/* Design & Create */}
                            <div className="col-12 col-sm-6 col-md-3 text-center process-step">
                                <div className="image-container mx-auto">
                                    <img src={design} alt="Design & Create" />
                                </div>
                                <div className="h2 process-title">Design & Create</div>
                            </div>

                            {/* Meet & Agree */}
                            <div className="col-12 col-sm-6 col-md-3 text-center process-step">
                                <div className="image-container mx-auto">
                                    <img src={meeting} alt="Meet & Agree" />
                                </div>
                                <div className="h2 process-title">Meet & Agree</div>
                            </div>

                            {/* Deliver & Install */}
                            <div className="col-12 col-sm-6 col-md-3 text-center process-step">
                                <div className="image-container mx-auto">
                                    <img src={delivery} alt="Deliver & Install" />
                                </div>
                                <div className="h2 process-title">Deliver & Install</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Process;

