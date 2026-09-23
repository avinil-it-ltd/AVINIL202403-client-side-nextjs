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
    index: '01 / INTERIOR ARCHITECTURE',
    title: 'Residential & Commercial Living',
    tagline: 'Custom Millwork & Turnkey Fitouts',
    description: 'Bespoke apartment interiors, executive office workspaces, modular kitchen joinery, and architectural ambient lighting.',
    image: imgInterior.src || imgInterior,
    link: '/interior',
    scope: ['Luxury Apartments', 'Corporate Offices', 'Joinery Fabrication', 'Lighting Design'],
    cta: 'Explore Interior Projects'
  },
  {
    id: 'exterior',
    index: '02 / EXTERIOR & FAÇADES',
    title: 'Architectural Envelopes & Elevations',
    tagline: 'Modern Facades & Civil Craft',
    description: 'Contemporary building front elevations, weatherproof composite cladding, custom gate architecture, and structural landscaping.',
    image: imgExterior.src || imgExterior,
    link: '/exterior',
    scope: ['Modern Elevations', 'Glass & Louver Facades', 'Gate Architecture', 'Landscape Integration'],
    cta: 'Explore Exterior Projects'
  },
  {
    id: 'event',
    index: '03 / STAGE & EVENT PRODUCTIONS',
    title: 'Experiential Brand Scenography',
    tagline: 'Corporate Productions & Pavilions',
    description: 'High-impact corporate AGMs, monumental exhibition stalls, brand launches, and structural stage engineering.',
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
          <div className="services-eyebrow">CORE DESIGN DISCIPLINES</div>
          <h2 className="services-main-title">
            Crafted for Living, Structure, and Experience.
          </h2>
          <p className="services-lead-text">
            Three dedicated divisions executing turnkey design with rigorous attention to honest materials, structural safety, and lasting aesthetic poise across Bangladesh.
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
