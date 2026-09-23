'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaRulerCombined, 
  FaCube, 
  FaTools, 
  FaKey,
  FaCheckCircle
} from 'react-icons/fa';
import './Process.css';

const processSteps = [
  {
    step: '01',
    phase: 'DISCOVERY & FEASIBILITY',
    title: 'Site Audit & Spatial Brief',
    description: 'Laser-accurate on-site dimensioning, structural feasibility inspections, and in-depth consultations to define functional and aesthetic objectives.',
    deliverable: 'Dimensional Survey & Spatial Zoning',
    icon: FaRulerCombined
  },
  {
    step: '02',
    phase: 'DESIGN & MATERIAL SPEC',
    title: '3D Visualization & BOQ',
    description: 'Photorealistic architectural modeling, physical sample reviews (natural marble, treated timber, brass hardware), and transparent itemized costing.',
    deliverable: 'Approved 3D CAD Renders & BOQ',
    icon: FaCube
  },
  {
    step: '03',
    phase: 'FABRICATION & CIVIL',
    title: 'Workshop Joinery & Build',
    description: 'Precision woodworking executed in our specialized joinery shop alongside on-site civil fabrication and MEP engineering under licensed supervision.',
    deliverable: 'Joinery Millwork & Structural Fitout',
    icon: FaTools
  },
  {
    step: '04',
    phase: 'COMMISSIONING',
    title: 'Quality Audit & Handover',
    description: 'Comprehensive snag-list clearance, architectural illumination testing, acoustic adjustments, and white-glove turnkey handover.',
    deliverable: 'Key Handover & Craft Warranty',
    icon: FaKey
  }
];

function Process() {
  return (
    <section className="process-editorial-section py-5" id="process">
      <Container className="py-4">
        {/* Section Header */}
        <div className="process-section-header mb-5">
          <div className="process-eyebrow">EXECUTION PROTOCOL</div>
          <h2 className="process-main-title">
            The Architectural Delivery Process
          </h2>
          <p className="process-lead-text">
            From initial spatial measurements to in-house joinery fabrication and white-glove handover, every phase is engineered for zero surprises and disciplined timelines.
          </p>
        </div>

        {/* 4 Interactive Process Steps */}
        <Row className="g-4 process-timeline-row">
          {processSteps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <Col lg={3} sm={6} key={item.step} className="d-flex">
                <div className="process-milestone-card h-100 w-100">
                  {/* Top Bar with Number & Icon */}
                  <div className="milestone-top-bar">
                    <span className="milestone-number">{item.step}</span>
                    <div className="milestone-icon-wrapper" aria-hidden="true">
                      <IconComp />
                    </div>
                  </div>

                  {/* Milestone Body */}
                  <div className="milestone-content">
                    <div className="milestone-phase">{item.phase}</div>
                    <h3 className="milestone-title">{item.title}</h3>
                    <p className="milestone-desc">{item.description}</p>
                  </div>

                  {/* Milestone Deliverable Badge */}
                  <div className="milestone-footer">
                    <div className="milestone-deliverable">
                      <FaCheckCircle className="deliverable-check-icon" />
                      <span>{item.deliverable}</span>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}

export default Process;
