'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import './FeaturedProjects.css';

const API_URL = 'https://3pcommunicationsserver.vercel.app/api/projects';

/* ── priority sort: Office first, then other subcategories, then Exterior ── */
function sortProjects(projects) {
  const priority = { Office: 0, Home: 1, 'Gate Design': 2 };
  return [...projects].sort((a, b) => {
    const pa = priority[a.subcategory] ?? 1;
    const pb = priority[b.subcategory] ?? 1;
    if (pa !== pb) return pa - pb;
    // within same priority, newest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data?.projects) setProjects(data.projects);
      })
      .catch((err) => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, []);

  /* collect unique subcategories for filter buttons */
  const subcategories = useMemo(() => {
    const subs = new Set();
    projects.forEach((p) => {
      if (p.subcategory) subs.add(p.subcategory);
    });
    // keep Office first
    const arr = Array.from(subs);
    arr.sort((a, b) => {
      if (a === 'Office') return -1;
      if (b === 'Office') return 1;
      return a.localeCompare(b);
    });
    return arr;
  }, [projects]);

  /* apply filter + sort + limit to 6 for homepage */
  const displayed = useMemo(() => {
    let list = projects;
    if (activeFilter !== 'All') {
      list = projects.filter((p) => p.subcategory === activeFilter);
    }
    return sortProjects(list).slice(0, 6);
  }, [projects, activeFilter]);

  return (
    <section className="featured-projects-section" id="projects">
      <Container>
        {/* Section header */}
        <div className="fp-header">
          <div className="fp-eyebrow">
            <span className="fp-eyebrow-dot" />
            OUR RECENT WORK
          </div>
          <h2 className="fp-main-title">Featured Projects</h2>
          <p className="fp-subtitle">
            Office interiors, home designs, and exterior makeovers — see what
            we have built for our clients across Dhaka and Bangladesh.
          </p>
        </div>

        {/* Filter buttons */}
        {subcategories.length > 1 && (
          <div className="fp-filter-bar">
            <button
              type="button"
              className={`fp-filter-btn${activeFilter === 'All' ? ' active' : ''}`}
              onClick={() => setActiveFilter('All')}
            >
              All Projects
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                className={`fp-filter-btn${activeFilter === sub ? ' active' : ''}`}
                onClick={() => setActiveFilter(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="fp-loading">
            <div className="fp-loading-spinner" />
          </div>
        ) : (
          <div className="fp-grid">
            {displayed.map((project) => (
              <Link
                key={project._id}
                href={`/projectDetails/${project._id}`}
                className="fp-card"
              >
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="fp-card-img"
                  loading="lazy"
                />
                <div className="fp-card-scrim" />

                {/* Top badges */}
                <div className="fp-card-top">
                  <span
                    className={`fp-badge${
                      project.subcategory === 'Office' ? ' fp-badge-office' : ''
                    }`}
                  >
                    {project.subcategory || project.category}
                  </span>
                  {project.status === 'completed' && (
                    <span className="fp-badge-status">Completed</span>
                  )}
                </div>

                {/* Bottom info */}
                <div className="fp-card-bottom">
                  <span className="fp-card-category">{project.category}</span>
                  <h3 className="fp-card-title">{project.title}</h3>
                  <div className="fp-card-meta">
                    {project.areaSize && <span>{project.areaSize}</span>}
                    {project.areaSize && project.address && (
                      <span className="fp-card-meta-sep" />
                    )}
                    {project.address && <span>{project.address}</span>}
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="fp-card-arrow">
                  <FaArrowRight />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="fp-view-all-wrap">
          <Link href="/interior" className="fp-view-all-btn">
            <span>View All Projects</span>
            <FaArrowRight className="cta-arrow" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProjects;
