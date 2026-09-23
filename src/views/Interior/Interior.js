'use client';

import React, { useState, useEffect } from "react";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import ContactInfo from "../Home/ContactInfo/ContactInfo";
import { Container, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import bioImg from "../../../src/assets/images/interiorPage/bioImg.jpg";
import axios from 'axios';
import './interior.css';

const Interior = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/projects');
        const interiorProjects = response.data.projects.filter(
          project => project.category?.toLowerCase() === 'interior design'
        )?.reverse();
        setProjects(interiorProjects || []);
      } catch (error) {
        console.error('Error fetching interior projects:', error);
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
    <div className="interior-page-wrapper" style={{ backgroundColor: "#fbf9f6" }}>
      <TopMenu />
      
      {/* Editorial Monograph Bio Section */}
      <section className="py-5">
        <Container className="py-4">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="editorial-bio-frame">
                <img 
                  src={bioImg?.src || bioImg} 
                  alt="3P Communication Interior Architecture" 
                  className="editorial-bio-img" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="editorial-bio-content">
                <span className="editorial-eyebrow">01 / INTERIOR ARCHITECTURE</span>
                <h1 className="editorial-title">
                  Bespoke Living Spaces &amp; Commercial Workplaces
                </h1>
                <p className="editorial-lead">
                  Every room tells a story of spatial harmony. At 3P Communication, our interior architects synthesize ergonomic movement, natural illumination, and custom timber joinery to create environments of effortless poise.
                </p>
                <p className="editorial-text">
                  From luxury residences in Gulshan, Banani, and Uttara to high-efficiency corporate headquarters across Dhaka, our in-house millwork workshop delivers exact joinery tolerances with zero guesswork.
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
            <h2 className="editorial-title">Selected Interior Projects</h2>
            <p className="editorial-lead">
              Browse our completed residential apartments, duplexes, and commercial executive suites.
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
                      <span>{project.subcategory || 'Interior Architecture'}</span>
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

export default Interior;
