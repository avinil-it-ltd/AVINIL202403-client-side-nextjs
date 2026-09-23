'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import banner1 from '../../../assets/images/banner1.jpg';
import banner3 from '../../../assets/images/banner3.jpg';
import './Introduction.css';

function Introduction() {
  return (
    <section className="intro-editorial-section py-5">
      <Container className="py-4">
        {/* Row 1: Interior Focus */}
        <Row className="align-items-center g-5 mb-5 pb-lg-4">
          <Col lg={6} md={12} className="intro-text-col">
            <span className="intro-eyebrow">01 / INTERIOR DESIGN &amp; FITOUTS</span>
            <h2 className="intro-title">
              Beautiful Spaces Designed with Quality &amp; Care
            </h2>
            <p className="intro-body">
              At 3P Communication, we believe good interior design makes everyday life and work better. We combine smart room layouts, pleasant natural light, and custom wooden furniture to create homes and offices that feel welcoming, practical, and durable.
            </p>
            <p className="intro-body">
              From our dedicated furniture workshop in Dhaka, our skilled carpenters produce custom cabinets, wall panels, and interior finishes with strict on-site quality control.
            </p>
            <div className="pt-2">
              <Link href="/interior" className="intro-action-link">
                <span>View Interior Projects</span>
                <FaArrowRight className="intro-link-arrow" />
              </Link>
            </div>
          </Col>

          <Col lg={6} md={12}>
            <div className="intro-image-frame">
              <img 
                src={banner1?.src || banner1} 
                className="intro-photo" 
                alt="3P Communication Interior Architecture" 
                loading="lazy"
              />
              <div className="intro-image-caption">
                <span>Modern Residential &amp; Office Interior Design</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Row 2: Exterior Focus */}
        <Row className="align-items-center g-5 flex-lg-row-reverse pt-lg-4">
          <Col lg={6} md={12} className="intro-text-col">
            <span className="intro-eyebrow">02 / EXTERIOR FAÇADES &amp; CONSTRUCTION</span>
            <h2 className="intro-title">
              Durable Building Facades Built for Bangladesh's Climate
            </h2>
            <p className="intro-body">
              Building exteriors must handle heavy rain and tropical heat while looking modern and impressive. We design and install durable building elevations using weather-resistant cladding, aluminum louvers, and modern glasswork.
            </p>
            <p className="intro-body">
              Our experienced team handles main gates, building exterior renovations, and front landscaping with proper waterproofing and safety standards.
            </p>
            <div className="pt-2">
              <Link href="/exterior" className="intro-action-link">
                <span>View Exterior Projects</span>
                <FaArrowRight className="intro-link-arrow" />
              </Link>
            </div>
          </Col>

          <Col lg={6} md={12}>
            <div className="intro-image-frame">
              <img 
                src={banner3?.src || banner3} 
                className="intro-photo" 
                alt="3P Communication Exterior Architecture" 
                loading="lazy"
              />
              <div className="intro-image-caption">
                <span>Modern Exterior Envelope • Cladding &amp; Civil Architecture</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Introduction;
