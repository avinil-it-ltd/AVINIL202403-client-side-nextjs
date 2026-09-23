'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import imgInterior from '../../../assets/images/interiorPage/feature-future-interior.jpg';
import imgExterior from '../../../assets/images/exterior.jpg';
import imgEvent from '../../../assets/images/event/Picture1.jpg';
import './Services.css';

const disciplines = [
  {
    id: 'interior',
    index: '01 / INTERIOR DESIGN',
    title: 'Homes & Corporate Workplaces',
    tagline: 'Custom Furniture & Complete Interior Setup',
    description: 'Modern apartment interiors, corporate office setups, custom kitchen cabinets, and stylish room lighting.',
    image: imgInterior.src || imgInterior,
    link: '/interior',
    scope: ['Modern Apartments', 'Corporate Offices', 'Custom Furniture', 'Ceiling & Lighting'],
    cta: 'Explore Interior Projects'
  },
  {
    id: 'exterior',
    index: '02 / EXTERIOR & FAÇADES',
    title: 'Modern Elevations & Building Fronts',
    tagline: 'Building Facades & Exterior Design',
    description: 'Modern building front elevations, weather-resistant wall panels, decorative main gates, and front landscaping.',
    image: imgExterior.src || imgExterior,
    link: '/exterior',
    scope: ['Building Elevations', 'Glass & Louver Work', 'Main Gate Design', 'Front Landscaping'],
    cta: 'Explore Exterior Projects'
  },
  {
    id: 'event',
    index: '03 / EVENTS & BRAND STAGES',
    title: 'Corporate Events & Exhibition Stalls',
    tagline: 'Stage Setup & Event Design',
    description: 'Corporate AGMs, creative exhibition stalls, product launches, and strong stage setups built on schedule.',
    image: imgEvent.src || imgEvent,
    link: '/event',
    scope: ['Corporate AGMs', 'Exhibition Pavilions', 'Brand Activations', 'Stage Engineering'],
    cta: 'Explore Event Projects'
  }
];

function Services() {
  return (
    <section className="services-editorial-section py-5" id="services">
      <Container className="py-4">
        {/* Section Header */}
        <div className="services-section-header mb-5">
          <div className="services-eyebrow">OUR CORE SERVICES</div>
          <h2 className="services-main-title">
            Interior, Exterior, and Event Design Services
          </h2>
          <p className="services-lead-text">
            Three dedicated service teams providing complete design and execution with quality materials, safe construction, and reliable support across Bangladesh.
          </p>
        </div>

        {/* 3 Clickable Discipline Cards */}
        <Row className="g-4">
          {disciplines.map((item) => (
            <Col lg={4} md={6} key={item.id} className="d-flex">
              <Link href={item.link} className="discipline-card-anchor w-100">
                <article className="discipline-card h-100">
                  {/* Photo Frame */}
                  <div className="discipline-photo-frame">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="discipline-photo" 
                      loading="lazy"
                    />
                    <div className="discipline-index-tag">{item.index}</div>
                  </div>

                  {/* Body Content */}
                  <div className="discipline-card-body">
                    <div className="discipline-sub">{item.tagline}</div>
                    <h3 className="discipline-card-title">{item.title}</h3>
                    <p className="discipline-card-desc">{item.description}</p>

                    {/* Scope Tags */}
                    <div className="discipline-scope-list">
                      {item.scope.map((tag, i) => (
                        <span key={i} className="discipline-scope-pill">{tag}</span>
                      ))}
                    </div>

                    {/* CTA Footer */}
                    <div className="discipline-card-footer">
                      <span className="discipline-cta-label">{item.cta}</span>
                      <div className="discipline-cta-arrow">
                        <FaArrowRight />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Services;
