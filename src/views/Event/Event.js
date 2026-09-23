'use client';

import React, { useEffect, useState } from 'react';
import TopMenu from '../../core/TopMenu';
import Footer from '../../core/Footer';
import ContactInfo from '../Home/ContactInfo/ContactInfo';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import bioImg from "../../../src/assets/images/event/Picture1.jpg";
import axios from 'axios';
import '../Interior/interior.css';

const Event = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/projects');
        const eventProjects = response.data.projects.filter(
          project => project.category?.toLowerCase() === 'event management'
        )?.reverse();
        setProjects(eventProjects || []);
      } catch (error) {
        console.error('Error fetching event projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleMoreDetails = (id) => {
    navigate(`/details/${id}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="event-page-wrapper" style={{ backgroundColor: "#fbf9f6" }}>
      <TopMenu />
      
      {/* Editorial Monograph Bio Section */}
      <section className="py-5">
        <Container className="py-4">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="editorial-bio-frame">
                <img 
                  src={bioImg?.src || bioImg} 
                  alt="3P Communication Stage & Event Scenography" 
                  className="editorial-bio-img" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="editorial-bio-content">
                <span className="editorial-eyebrow">03 / STAGE &amp; EVENT PRODUCTIONS</span>
                <h1 className="editorial-title">
                  Experiential Scenography &amp; Monumental Event Stages
                </h1>
                <p className="editorial-lead">
                  Live corporate environments require architectural grandeur executed with absolute structural precision. At 3P Communication, we design and build immersive stages, exhibition pavilions, and corporate AGM venues that elevate brand authority.
                </p>
                <p className="editorial-text">
                  From high-security corporate conventions to monumental brand reveals across Bangladesh, our in-house staging engineers coordinate trussing, architectural lighting arrays, high-resolution LED backdrops, and acoustic calibration under zero-margin timelines.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Clickable Studio Direct Line Bar */}
      <ContactInfo />

      {/* Selected Projects Directory */}
      <section className="py-5">
        <Container className="pb-5">
          <div className="projects-header mb-5">
            <span className="editorial-eyebrow">PRODUCTION PORTFOLIO</span>
            <h2 className="editorial-title">Selected Event &amp; Stage Productions</h2>
            <p className="editorial-lead">
              Review corporate stages, exhibition pavilions, and ceremonial venues executed across Bangladesh.
            </p>
          </div>

          <Row className="g-4">
            {projects.map((project) => (
              <Col lg={4} md={6} key={project._id} className="d-flex">
                <div 
                  className="project-editorial-card w-100"
                  onClick={() => handleMoreDetails(project._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleMoreDetails(project._id)}
                >
                  <div className="project-photo-frame">
                    <img 
                      src={project.mainImage} 
                      alt={project.title} 
                      className="project-photo" 
                      loading="lazy"
                    />
                    <div className="project-tag-overlay">
                      <span>{project.subcategory || 'Stage Production'}</span>
                    </div>
                  </div>
                  <div className="project-card-meta">
                    <h3 className="project-card-title">{project.title}</h3>
                    <p className="project-card-cat">{project.category}</p>
                    <button 
                      type="button" 
                      className="project-detail-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoreDetails(project._id);
                      }}
                    >
                      View Production Details &rarr;
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Event;