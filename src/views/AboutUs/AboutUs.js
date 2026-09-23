'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import axios from "axios";
import {
  FaDraftingCompass,
  FaBuilding,
  FaGlassCheers,
  FaAward,
  FaCheckCircle,
  FaPhoneAlt,
  FaQuoteLeft,
  FaUsers,
  FaCalendarAlt,
  FaArrowRight,
  FaLightbulb,
  FaLeaf,
  FaShieldAlt,
  FaBriefcase,
  FaHeart
} from "react-icons/fa";
import ceoFallback from "../../assets/images/about/ceo.png";
import "./About.css";

const DISCIPLINES_SHOWCASE = [
  {
    badge: "01 / INTERIOR",
    title: "Interior Architecture & Styling",
    icon: <FaDraftingCompass />,
    desc: "Bespoke residential sanctuaries, luxury executive corporate suites, and experiential retail environments crafted with harmonious materials and refined lighting.",
    features: [
      "Custom Millwork & Spatial Ergonomics",
      "Lighting & Acoustic Optimization",
      "Full Material & FF&E Sourcing"
    ]
  },
  {
    badge: "02 / EXTERIOR",
    title: "Exterior & Structural Elevation",
    icon: <FaBuilding />,
    desc: "Monumental building facades, commercial entryway landmarks, and landscape integrations engineered to withstand weathering while projecting bold architectural prestige.",
    features: [
      "Modern Facade Cladding & Paneling",
      "Architectural Canopy & Gate Architecture",
      "Landscape & Illuminative Staging"
    ]
  },
  {
    badge: "03 / EVENTS",
    title: "Event Scenography & Production",
    icon: <FaGlassCheers />,
    desc: "High-caliber corporate summits, brand activations, international expo pavilions, and thematic experiential stages executed with uncompromising theatrical precision.",
    features: [
      "Structural Truss & Custom Stage Fabrication",
      "Smart Interactive Visual AV Integration",
      "Turnkey Production & On-Site Protocol"
    ]
  }
];

const DEFAULT_WHY_CHOOSE_US = [
  {
    title: "Expert Architectural Designers",
    description: "Our studio brings together veteran spatial designers, CAD technicians, and interior stylists with over a decade of proven excellence.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925067/3pcom/uploads/designer_re5rov.jpg"
  },
  {
    title: "Custom Tailored Solutions",
    description: "Every blueprint is personalized to the client's cultural, operational, and aesthetic aspirations—never recycled or templated.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925091/3pcom/uploads/soultion_ttcxbt.jpg"
  },
  {
    title: "Sustainable & Enduring Materials",
    description: "We prioritize ethically sourced timbers, energy-efficient fixtures, and low-VOC finishes that guarantee longevity and health.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925094/3pcom/uploads/sustainability_pgcrrf.jpg"
  },
  {
    title: "Comprehensive Turnkey Services",
    description: "From 3D photorealistic visualization to on-site civil fabrication and handover, we handle every detail end-to-end.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925111/3pcom/uploads/service_pabyxm.jpg"
  },
  {
    title: "Proven Milestone Track Record",
    description: "Decades of successful handovers for Bangladesh's leading institutions, corporations, and discerning private homeowners.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925117/3pcom/uploads/track_zwmnab.jpg"
  },
  {
    title: "Passion for Spatial Betterment",
    description: "Continuous innovation in modern architecture, acoustic design, and ergonomic living ensures every finished space elevates human experience.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925846/3pcom/uploads/better_yisx6j.jpg"
  }
];

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, contactRes] = await Promise.allSettled([
          axios.get("https://3pcommunicationsserver.vercel.app/api/about"),
          axios.get("https://3pcommunicationsserver.vercel.app/api/myContact")
        ]);

        if (aboutRes.status === "fulfilled" && aboutRes.value.data) {
          setAboutData(aboutRes.value.data);
        }
        if (contactRes.status === "fulfilled" && contactRes.value.data) {
          setContactData(contactRes.value.data);
        }
      } catch (error) {
        console.error("Error fetching about page datasets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    projectsCompleted: aboutData?.statistics?.projectsCompleted ?? 20,
    awardsReceived: aboutData?.statistics?.awardsReceived ?? 10,
    happyCustomers: aboutData?.statistics?.happyCustomers ?? 100,
    yearsInService: aboutData?.statistics?.yearsInService ?? 10
  };

  const director = {
    name: aboutData?.profile?.name || "Prokash Banik",
    position: aboutData?.profile?.position || "CEO & Managing Director, 3P Communication",
    introduction: aboutData?.profile?.introduction ||
      "At 3P Communication, we blend creativity, structural engineering, and uncompromising aesthetic rigor to transform raw spaces into inspiring habitats. With an unwavering passion for innovative spatial design, we turn complex blueprints into enduring architectural legacies.",
    profilePicture: aboutData?.profile?.profilePicture || (ceoFallback?.src || ceoFallback)
  };

  const whyChooseList = (aboutData?.whyChooseUs && aboutData.whyChooseUs.length > 0)
    ? aboutData.whyChooseUs
    : DEFAULT_WHY_CHOOSE_US;

  const hotline = contactData?.mobile || "+8801722728272";
  const email = contactData?.email || "3pcommunication@gmail.com";

  return (
    <div className="about-page-wrapper">
      <TopMenu />

      {/* Hero Header */}
      <section className="about-hero-banner">
        <div className="container">
          <div className="about-hero-tag">
            <span>✦</span> ABOUT 3P COMMUNICATION
          </div>
          <h1 className="about-hero-title">
            Crafting Spatial Legacies &amp; <span>Iconic Experiences</span>
          </h1>
          <p className="about-hero-subtitle">
            A premier multidisciplinary studio dedicated to elevating architectural interiors, monumental exteriors, and high-production event environments across Bangladesh.
          </p>
        </div>
      </section>

      {/* Executive Leadership (Director Philosophy) */}
      <section className="about-section">
        <div className="container">
          <div className="about-director-card">
            <div className="row align-items-center">
              
              {/* Left: Portrait */}
              <div className="col-12 col-lg-5 text-center mb-4 mb-lg-0">
                <div className="director-img-wrapper">
                  <img
                    src={director.profilePicture}
                    alt={director.name}
                    className="director-portrait"
                    onError={(e) => {
                      e.target.src = ceoFallback?.src || ceoFallback;
                    }}
                  />
                  <div className="director-experience-badge">
                    <span className="badge-number">{stats.yearsInService}+</span>
                    <span className="badge-text">Years of Visionary Spatial Leadership</span>
                  </div>
                </div>
              </div>

              {/* Right: Leadership Content */}
              <div className="col-12 col-lg-7">
                <div className="director-content">
                  <div className="director-role-tag">Director &amp; Principal Visionary</div>
                  <h2 className="director-name">{director.name}</h2>
                  <div className="director-position">{director.position}</div>

                  <div className="director-quote-box">
                    <FaQuoteLeft className="quote-icon" />
                    <p className="director-quote">
                      "{director.introduction}"
                    </p>
                  </div>

                  <div className="director-philosophy-list">
                    <div className="philosophy-item">
                      <FaCheckCircle className="philosophy-icon" />
                      <span>
                        <strong>Precision Engineering &amp; Aesthetic Harmony:</strong> Ensuring every millwork detail and lighting fixture serves both functional longevity and experiential beauty.
                      </span>
                    </div>
                    <div className="philosophy-item">
                      <FaCheckCircle className="philosophy-icon" />
                      <span>
                        <strong>End-to-End Turnkey Execution:</strong> From 3D photorealistic renderings to turnkey site civil execution, eliminating client friction and unforeseen delays.
                      </span>
                    </div>
                    <div className="philosophy-item">
                      <FaCheckCircle className="philosophy-icon" />
                      <span>
                        <strong>Client-First Transparent Collaboration:</strong> Direct access to lead architects and real-time fabrication updates throughout every phase.
                      </span>
                    </div>
                  </div>

                  <Link href="/contactus" className="btn cta-btn-primary">
                    <span>Connect with Leadership</span>
                    <FaArrowRight />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* KPI Impact Statistics Bar */}
      <section className="about-stats-section">
        <div className="container">
          <div className="stats-grid">
            
            <div className="stat-metric-card">
              <div className="stat-icon-circle">
                <FaDraftingCompass />
              </div>
              <div className="stat-number">
                {stats.projectsCompleted}<span>+</span>
              </div>
              <div className="stat-label">Projects Completed</div>
              <p className="stat-desc">Residential, corporate &amp; commercial landmarks</p>
            </div>

            <div className="stat-metric-card">
              <div className="stat-icon-circle">
                <FaAward />
              </div>
              <div className="stat-number">
                {stats.awardsReceived}<span>+</span>
              </div>
              <div className="stat-label">Awards &amp; Honors</div>
              <p className="stat-desc">Recognized architectural &amp; design excellence</p>
            </div>

            <div className="stat-metric-card">
              <div className="stat-icon-circle">
                <FaUsers />
              </div>
              <div className="stat-number">
                {stats.happyCustomers}<span>+</span>
              </div>
              <div className="stat-label">Delighted Clients</div>
              <p className="stat-desc">Leading corporations, brands &amp; private homeowners</p>
            </div>

            <div className="stat-metric-card">
              <div className="stat-icon-circle">
                <FaCalendarAlt />
              </div>
              <div className="stat-number">
                {stats.yearsInService}<span>+</span>
              </div>
              <div className="stat-label">Years In Service</div>
              <p className="stat-desc">A decade of pioneering multidisciplinary execution</p>
            </div>

          </div>
        </div>
      </section>

      {/* The 3 Core Disciplines (3P DNA) */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-tag">Multidisciplinary Practice</span>
            <h2 className="about-section-title">The Three Pillars of 3P</h2>
            <p className="about-section-subtitle">
              We seamlessly integrate architecture, facade engineering, and experiential production under one unified creative atelier.
            </p>
          </div>

          <div className="disciplines-grid">
            {DISCIPLINES_SHOWCASE.map((item, idx) => (
              <div key={idx} className="discipline-card">
                <div className="discipline-card-header">
                  <span className="discipline-badge">{item.badge}</span>
                  <div className="discipline-icon-box">{item.icon}</div>
                </div>
                <div className="discipline-card-body">
                  <h3 className="discipline-title">{item.title}</h3>
                  <p className="discipline-desc">{item.desc}</p>
                  <ul className="discipline-features">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose 3P (6 Value Pillars Grid) */}
      <section className="about-section" style={{ backgroundColor: "#f3ede3" }}>
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-tag">Studio Values &amp; Standards</span>
            <h2 className="about-section-title">Why Discerning Clients Choose Us</h2>
            <p className="about-section-subtitle">
              Built on uncompromising work ethics, sustainable materials, and a proven track record of architectural distinction.
            </p>
          </div>

          <div className="why-grid">
            {whyChooseList.map((item, idx) => (
              <div key={item._id || idx} className="why-pillar-card">
                <div className="why-card-thumb-wrap">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="why-card-thumb"
                    loading="lazy"
                  />
                  <div className="why-pillar-num">0{idx + 1}</div>
                </div>
                <div className="why-card-content">
                  <h3 className="why-card-title">{item.title}</h3>
                  <p className="why-card-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Call to Action Banner */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <div className="row align-items-center">
              <div className="col-12 col-lg-7 mb-4 mb-lg-0">
                <h3 className="cta-title">
                  Ready to Turn Your Dream Space Into <span>Reality?</span>
                </h3>
                <p className="cta-desc">
                  Schedule an on-site consultation or visit our Mohammadpur design studio to discuss your interior, exterior facade, or corporate event production with our principal leads.
                </p>
              </div>
              <div className="col-12 col-lg-5 text-lg-end">
                <div className="cta-actions justify-content-lg-end">
                  <Link href="/contactus" className="cta-btn-primary">
                    <span>Book Consultation ↗</span>
                  </Link>
                  <a href={`tel:${hotline}`} className="cta-btn-secondary">
                    <FaPhoneAlt />
                    <span>{hotline}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
