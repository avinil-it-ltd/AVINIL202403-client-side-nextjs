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
    phase: 'FIRST STEP',
    title: 'Site Measurement & Requirements',
    description: 'Accurate room measurements, on-site structural check, and discussing your exact style and functional needs.',
    deliverable: 'Accurate Floor Plan & Layout',
    icon: FaRulerCombined
  },
  {
    step: '02',
    phase: 'DESIGN & BUDGET',
    title: '3D Design & Detailed Cost Estimate',
    description: 'Realistic 3D views of your rooms, real material samples (tiles, wood, paint colors), and clear itemized cost estimates.',
    deliverable: 'Approved 3D Views & Budget',
    icon: FaCube
  },
  {
    step: '03',
    phase: 'PRODUCTION & SETUP',
    title: 'Workshop Furniture & On-Site Work',
    description: 'Custom wood furniture made in our own workshop, alongside electrical, lighting, and interior fitting work done by experienced technicians.',
    deliverable: 'Finished Furniture & Interior Setup',
    icon: FaTools
  },
  {
    step: '04',
    phase: 'COMPLETION',
    title: 'Final Inspection & Project Handover',
    description: 'Careful final checks, testing all lights and electrical points, deep cleaning, and on-time key handover.',
    deliverable: 'Key Handover & Workmanship Warranty',
    icon: FaKey
  }
];

function Process() {
  return (
    <section className="process-editorial-section py-5" id="process">
      <Container className="py-4">
        {/* Section Header */}
        <div className="process-section-header mb-5">
          <div className="process-eyebrow">HOW WE WORK</div>
          <h2 className="process-main-title">
            Our Step-by-Step Project Process
          </h2>
          <p className="process-lead-text">
            From first room measurements to custom furniture making and final cleaning, every step is planned to avoid surprises and finish on time.
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
