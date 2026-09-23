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
            <span className="intro-eyebrow">01 / INTERIOR ARCHITECTURE &amp; FITOUTS</span>
            <h2 className="intro-title">
              Bespoke Spaces Crafted with Purpose &amp; Tactile Rigor
            </h2>
            <p className="intro-body">
              At 3P Communication, interior architecture is treated as a physical extension of living. We synthesize spatial flow, natural daylighting, and custom joinery to craft residences and workplaces that balance comfort with lasting aesthetic poise.
            </p>
            <p className="intro-body">
              From our dedicated woodworking shop in Dhaka, our master craftsmen produce tailored cabinetry, acoustic paneling, and architectural finishes under rigorous on-site project management.
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
                <span>Modern Residential Interior • Turnkey Millwork Execution</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Row 2: Exterior Focus */}
        <Row className="align-items-center g-5 flex-lg-row-reverse pt-lg-4">
          <Col lg={6} md={12} className="intro-text-col">
            <span className="intro-eyebrow">02 / EXTERIOR FAÇADES &amp; CIVIL ENGINEERING</span>
            <h2 className="intro-title">
              Enduring Structural Envelopes Built for Bangladesh's Climate
            </h2>
            <p className="intro-body">
              An architectural envelope must resist tropical weather while asserting an iconic civic presence. We engineer building elevations using weatherproof composite cladding, precision aluminum louvers, and structural glazing.
            </p>
            <p className="intro-body">
              Our turnkey civil team handles boundary gate architecture, facade retrofitting, and structural landscaping with meticulous waterproofing and safety standards.
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
