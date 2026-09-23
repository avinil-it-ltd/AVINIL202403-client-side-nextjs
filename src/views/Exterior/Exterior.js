'use client';

import React, { useState, useEffect } from "react";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import ContactInfo from "../Home/ContactInfo/ContactInfo";
import { Container, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import bioImg from "../../../src/assets/images/Exterior/Cantonment School Gate.jpg";
import axios from 'axios';
import '../Interior/interior.css';

const Exterior = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/projects');
        const exteriorProjects = response.data.projects.filter(
          project => project.category?.toLowerCase() === 'exterior design'
        )?.reverse();
        setProjects(exteriorProjects || []);
      } catch (error) {
        console.error('Error fetching exterior projects:', error);
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
    <div className="exterior-page-wrapper" style={{ backgroundColor: "#fbf9f6" }}>
      <TopMenu />
      
      {/* Editorial Monograph Bio Section */}
      <section className="py-5">
        <Container className="py-4">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="editorial-bio-frame">
                <img 
                  src={bioImg?.src || bioImg} 
                  alt="3P Communication Exterior Architecture" 
                  className="editorial-bio-img" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="editorial-bio-content">
                <span className="editorial-eyebrow">02 / EXTERIOR &amp; FAÇADES</span>
                <h1 className="editorial-title">
                  Modern Building Envelopes &amp; Structural Architecture
                </h1>
                <p className="editorial-lead">
                  A building’s exterior is its lasting architectural statement. At 3P Communication, we engineer front elevations, gate architectures, and exterior envelopes that endure Bangladesh’s tropical monsoons while maximizing curb presence.
                </p>
                <p className="editorial-text">
                  Our civil engineering specialists execute aluminum composite panels, exterior louvers, boundary gate structures, and perimeter landscape illumination with guaranteed structural durability and waterproofing.
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
            <span className="editorial-eyebrow">PROJECT DIRECTORY</span>
            <h2 className="editorial-title">Selected Exterior Projects</h2>
            <p className="editorial-lead">
              Explore completed commercial elevations, modern institutional gates, and architectural facades.
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
                      <span>{project.subcategory || 'Exterior Architecture'}</span>
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
                      View Project Details &rarr;
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

export default Exterior;
