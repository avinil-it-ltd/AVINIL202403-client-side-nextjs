'use client';

import React from 'react'; // Import React
import './ThreeImg.css'; // Import your CSS
import { Col, Container, Row } from 'react-bootstrap';

function ThreeImg() {
    return (
        <Container className="my-5 py-5">
            <Row>
                <Col md={4} className="mb-4">
                    <div className={`three_image-container left-bg`}>
                        <div className="three_overlay-text">
                            <h2>Interior Design For The Future</h2>
                        </div>
                        <div className="image-overlay"></div> {/* Overlay shadow */}
                    </div>
                </Col>

                <Col md={4} className="mb-4">
                    <div className={`three_image-container center-bg`}>
                        <div className="three_overlay-text">
                            <h2>Lots Of Flexible Functionalities</h2>
                        </div>
                        <div className="image-overlay"></div> {/* Overlay shadow */}
                    </div>
                </Col>

                <Col md={4} className="mb-4">
                    <div className={`three_image-container right-bg`}>
                        <div className="three_overlay-text">
                            <h2>Introduce Vision To Your Space</h2>
                        </div>
                        <div className="image-overlay"></div> {/* Overlay shadow */}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ThreeImg;

