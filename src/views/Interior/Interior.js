'use client';

import React, { useState, useEffect } from "react";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import ContactInfo from "../Home/ContactInfo/ContactInfo";
import { Container, Col, Row, Spinner } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import collageImg from "../../../src/assets/images/interiorPage/home-office-decor-collage.jpg";
import officeImg from "../../../src/assets/images/interiorPage/office-interior-visual.jpg";
import homeImg from "../../../src/assets/images/interiorPage/home-interior-visual.jpg";
import axios from 'axios';
import './interior.css';

const Interior = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sub = params.get('sub') || params.get('subcategory');
      if (sub) return sub;
    }
    return 'All';
  });
  const [loading, setLoading] = useState(true);

  // Synchronize subcategory with URL query parameters in real time
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncSubFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const subParam = params.get('sub') || params.get('subcategory');
        if (subParam) {
          setSelectedSubcategory(subParam);
        } else {
          setSelectedSubcategory('All');
        }
      };

      syncSubFromUrl();
      window.addEventListener('popstate', syncSubFromUrl);
      const timer = setInterval(syncSubFromUrl, 350);

      return () => {
        window.removeEventListener('popstate', syncSubFromUrl);
        clearInterval(timer);
      };
    }
  }, []);

  const handleSubcategorySelect = (subName) => {
    setSelectedSubcategory(subName);
    if (typeof window !== 'undefined') {
      const url = subName === 'All'
        ? window.location.pathname
        : `${window.location.pathname}?sub=${encodeURIComponent(subName)}`;
      window.history.pushState(null, '', url);
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

  // Dynamically extract unique subcategories, prioritizing Office and Home
  const subcategories = React.useMemo(() => {
    const counts = {};
    projects.forEach(p => {
      const sub = p.subcategory || 'General';
      counts[sub] = (counts[sub] || 0) + 1;
    });
    const list = [{ name: 'All', label: 'All Projects', count: projects.length }];
    
    // Sort so Office comes first, then Home, then others
    const sortedSubs = Object.keys(counts).sort((a, b) => {
      if (a.toLowerCase() === 'office') return -1;
      if (b.toLowerCase() === 'office') return 1;
      if (a.toLowerCase() === 'home') return -1;
      if (b.toLowerCase() === 'home') return 1;
      return a.localeCompare(b);
    });

    sortedSubs.forEach(sub => {
      const isOffice = sub.toLowerCase() === 'office';
      const isHome = sub.toLowerCase() === 'home';
      let label = sub;
      if (isOffice) label = '🏢 Office Interior';
      else if (isHome) label = '🏡 Home Interior';
      list.push({ name: sub, label, count: counts[sub] });
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

  const editorialContent = React.useMemo(() => {
    const sub = (selectedSubcategory || '').toLowerCase();
    if (sub === 'office') {
      return {
        image: officeImg,
        alt: '3P Communication Commercial Office Interior Design - Modern Workplaces',
        eyebrow: '01 / OFFICE INTERIOR DESIGN',
        title: 'Modern Commercial Workplaces & Office Interiors',
        lead: 'Designed for focus, productivity, and collaboration. At 3P Communication, our interior designers engineer contemporary corporate offices, executive suites, and ergonomic workstations tailored for high-performing teams.',
        text: 'From corporate headquarters in Gulshan, Banani, and Motijheel to dynamic tech hubs across Dhaka, our in-house furniture workshop ensures clean finishing, acoustic comfort, and exact architectural measurements.',
        directoryEyebrow: 'OFFICE PROJECT DIRECTORY',
        directoryTitle: 'Selected Commercial & Office Projects',
        directoryLead: 'Explore completed corporate headquarters, executive boardrooms, and functional office workstations across Dhaka.',
      };
    }
    if (sub === 'home') {
      return {
        image: homeImg,
        alt: '3P Communication Residential Home Interior Design - Modern Living Spaces',
        eyebrow: '01 / HOME INTERIOR DESIGN',
        title: 'Modern Living Spaces & Luxury Home Interiors',
        lead: 'Every room should be comfortable, functional, and beautiful. At 3P Communication, our interior designers combine smart room layouts, natural light, and custom wooden furniture to create warm homes you love living in.',
        text: 'From luxury apartments and duplexes in Gulshan, Banani, and Uttara to family residences across Dhaka, our in-house furniture workshop ensures bespoke cabinetry, warm ambient lighting, and flawless execution.',
        directoryEyebrow: 'RESIDENTIAL PROJECT DIRECTORY',
        directoryTitle: 'Selected Home & Residential Projects',
        directoryLead: 'Browse our completed luxury apartments, duplex homes, custom kitchens, and contemporary living spaces.',
      };
    }
    // Default: All / General Interior (Collage view)
    return {
      image: collageImg,
      alt: '3P Communication Interior Architecture - Home and Office Decor Collage',
      eyebrow: '01 / INTERIOR DESIGN',
      title: 'Modern Living Spaces & Commercial Workplaces',
      lead: 'Every room should be comfortable, functional, and beautiful. At 3P Communication, our interior designers combine smart room layouts, natural light, and custom wooden furniture to create spaces you love living and working in.',
      text: 'From apartments and houses in Gulshan, Banani, and Uttara to corporate office setups across Dhaka, our in-house furniture workshop ensures clean finishing and exact measurements with zero guesswork.',
      directoryEyebrow: 'PROJECT DIRECTORY',
      directoryTitle: 'Selected Interior Projects',
      directoryLead: 'Browse our completed residential apartments, duplexes, and commercial executive suites.',
    };
  }, [selectedSubcategory]);

  const handleMoreDetails = (id) => {
    router.push(`/details/${id}`);
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
                  key={editorialContent.eyebrow}
                  src={editorialContent.image?.src || editorialContent.image} 
                  alt={editorialContent.alt} 
                  className="editorial-bio-img" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="editorial-bio-content">
                <span className="editorial-eyebrow">{editorialContent.eyebrow}</span>
                <h1 className="editorial-title">
                  {editorialContent.title}
                </h1>
                <p className="editorial-lead">
                  {editorialContent.lead}
                </p>
                <p className="editorial-text">
                  {editorialContent.text}
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
            <span className="editorial-eyebrow">{editorialContent.directoryEyebrow}</span>
            <h2 className="editorial-title">{editorialContent.directoryTitle}</h2>
            <p className="editorial-lead">
              {editorialContent.directoryLead}
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
