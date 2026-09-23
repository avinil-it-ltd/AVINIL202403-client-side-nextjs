'use client';

import React from 'react';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import { FaArrowRight, FaGem } from 'react-icons/fa';
import imgFuture from '../../../assets/images/interiorPage/feature-future-interior.jpg';
import imgErgonomic from '../../../assets/images/interiorPage/feature-ergonomic-spaces.jpg';
import imgVision from '../../../assets/images/interiorPage/feature-spatial-vision.jpg';
import './ThreeImg.css';

const featureCards = [
  {
    id: 1,
    number: '01 / INNOVATION',
    title: 'Interior Design For The Future',
    subtitle: 'Contemporary Living',
    description: 'Crafting bespoke, future-ready living spaces that integrate sustainable elegance and contemporary residential aesthetics.',
    image: imgFuture.src || imgFuture,
    link: '/interior',
    actionText: 'Explore Interior'
  },
  {
    id: 2,
    number: '02 / ERGONOMICS',
    title: 'Lots Of Flexible Functionalities',
    subtitle: 'Adaptive Spaces',
    description: 'Custom joinery, adaptive open plans, and smart interior layouts designed for seamless flow between everyday life and entertaining.',
    image: imgErgonomic.src || imgErgonomic,
    link: '/interior',
    actionText: 'Discover Concepts'
  },
  {
    id: 3,
    number: '03 / SPATIAL VISION',
    title: 'Introduce Vision To Your Space',
    subtitle: 'Transformative Design',
    description: 'Elevating environments with dramatic architectural lighting, sculptural forms, and transformative spatial flow.',
    image: imgVision.src || imgVision,
    link: '/interior',
    actionText: 'View Portfolio'
  }
];

function ThreeImg() {
  return (
    <section className="three-img-section py-5">
      <Container>
        {/* Section Header */}
        <div className="three-img-header text-center mb-5">
          <div className="three-img-tag-pill">
            <FaGem className="tag-sparkle-icon" />
            <span>DESIGN PHILOSOPHY</span>
          </div>
          <h2 className="three-img-main-title">
            Spaces Conceived For <span className="title-accent">Modern Living</span>
          </h2>
          <p className="three-img-subtitle">
            Harmonizing visionary architectural concepts, bespoke craftsmanship, and effortless functionality across residential and commercial spaces.
          </p>
        </div>

        {/* 3 Showcase Cards */}
        <Row className="g-4">
          {featureCards.map((card) => (
            <Col lg={4} md={6} key={card.id} className="d-flex">
              <Link href={card.link} className="three-img-card-link w-100">
                <div className="three-img-card">
                  {/* Background Image Container with Hover Zoom */}
                  <div 
                    className="three-img-bg"
                    style={{ backgroundImage: `url(${card.image})` }}
                  />

                  {/* Gradient Scrim for 100% Typography Contrast */}
                  <div className="three-img-scrim" />

                  {/* Top Glassmorphic Number Badge */}
                  <div className="three-img-card-top">
                    <span className="three-img-badge">{card.number}</span>
                    <div className="three-img-arrow-circle" aria-label="Explore">
                      <FaArrowRight className="arrow-icon" />
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="three-img-card-bottom">
                    <span className="three-img-card-category">{card.subtitle}</span>
                    <h3 className="three-img-card-title">{card.title}</h3>
                    <p className="three-img-card-desc">{card.description}</p>
                    <div className="three-img-cta">
                      <span>{card.actionText}</span>
                      <FaArrowRight className="cta-arrow" />
                    </div>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default ThreeImg;
