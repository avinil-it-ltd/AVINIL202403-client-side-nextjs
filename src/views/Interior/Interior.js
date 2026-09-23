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
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Read query parameter on mount (e.g. ?sub=Office or ?subcategory=Office)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const subParam = params.get('sub') || params.get('subcategory');
      if (subParam) {
        setSelectedSubcategory(subParam);
      }
    }
  }, []);

  const handleSubcategorySelect = (subName) => {
    setSelectedSubcategory(subName);
    if (typeof window !== 'undefined') {
      const url = subName === 'All'
        ? window.location.pathname
        : `${window.location.pathname}?sub=${encodeURIComponent(subName)}`;
      window.history.replaceState(null, '', url);
    }
  };

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

  // Dynamically extract unique subcategories from loaded projects with live counts
  const subcategories = React.useMemo(() => {
    const counts = {};
    projects.forEach(p => {
      const sub = p.subcategory || 'General';
      counts[sub] = (counts[sub] || 0) + 1;
    });
    const list = [{ name: 'All', label: 'All Projects', count: projects.length }];
    Object.keys(counts).sort().forEach(sub => {
      list.push({ name: sub, label: sub, count: counts[sub] });
    });
    return list;
  }, [projects]);

  // Filter projects by active subcategory, prioritizing Office projects in "All" view
  const filteredProjects = React.useMemo(() => {
    if (selectedSubcategory !== 'All') {
      return projects.filter(
        p => (p.subcategory || 'General').toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }
    // High-priority curation: showcase commercial Office workplaces at the top of the directory
    const officeProjects = projects.filter(
      p => (p.subcategory || '').toLowerCase() === 'office'
    );
    const otherProjects = projects.filter(
      p => (p.subcategory || '').toLowerCase() !== 'office'
    );
    return [...officeProjects, ...otherProjects];
  }, [projects, selectedSubcategory]);

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

          {/* Subcategory Filter Bar */}
          <div className="interior-filter-bar mb-4" role="tablist" aria-label="Filter projects by subcategory">
            {subcategories.map((sub) => {
              const isActive = selectedSubcategory.toLowerCase() === sub.name.toLowerCase();
              return (
                <button
                  key={sub.name}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`interior-subcat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSubcategorySelect(sub.name)}
                >
                  <span className="interior-subcat-label">{sub.label}</span>
                  <span className="interior-subcat-count">{sub.count}</span>
                </button>
              );
            })}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="interior-empty-state text-center py-5">
              <p className="text-muted m-0">No projects currently listed under "{selectedSubcategory}".</p>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary mt-3 rounded-pill px-3"
                onClick={() => handleSubcategorySelect('All')}
              >
                View All Projects
              </button>
            </div>
          ) : (
            <Row className="g-4">
              {filteredProjects.map((project) => (
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
          )}
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Interior;
