'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import axios from "axios";
import {
  FaArrowRight,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import ceoFallback from "../../assets/images/about/ceo.png";
import heroSpacePhoto from "../../assets/images/interiorPage/feature-future-interior.jpg";
import exteriorPhoto from "../../assets/images/exterior.jpg";
import eventPhoto from "../../assets/images/event/Picture1.jpg";
import "./About.css";

const DISCIPLINES_TRIPTYCH = [
  {
    index: "01 / INTERIOR",
    title: "Interior Architecture & Styling",
    image: heroSpacePhoto,
    desc: "Bespoke residential sanctuaries, luxury duplex homes, executive corporate suites, and experiential retail environments crafted with harmonious materials and refined lighting.",
    specs: [
      "Custom Millwork & Living Ergonomics",
      "Modular Kitchens & Acoustic Ceilings",
      "Full Material & FF&E Procurement"
    ]
  },
  {
    index: "02 / EXTERIOR",
    title: "Exterior & Facade Engineering",
    image: exteriorPhoto,
    desc: "Monumental building facades, commercial entrance landmarks, and landscape architectural integrations engineered to withstand weathering while projecting bold modern identity.",
    specs: [
      "Modern Facade Cladding & Glass Paneling",
      "Architectural Canopy & Gate Architecture",
      "Illuminative & Landscape Staging"
    ]
  },
  {
    index: "03 / EVENTS",
    title: "Event Scenography & Production",
    image: eventPhoto,
    desc: "High-caliber corporate summits, brand activations, international expo pavilions, and thematic stages executed with uncompromising theatrical and acoustic precision.",
    specs: [
      "Structural Truss & Custom Stage Fabrication",
      "Smart Interactive Visual AV Integration",
      "Turnkey Production & Protocol Coordination"
    ]
  }
];

const ARCHITECTURAL_STANDARDS = [
  {
    num: "01",
    title: "Photorealistic 3D Modeling Before Civil Work",
    desc: "Every room, fixture, and material texture is rendered in high-definition 3D so you approve the finished reality before construction begins."
  },
  {
    num: "02",
    title: "Itemized Bill of Quantities & Transparent Budgets",
    desc: "We provide comprehensive, item-by-item cost breakdowns with no surprise markups or unbudgeted mid-project claims."
  },
  {
    num: "03",
    title: "Direct In-House Master Artisans",
    desc: "Our carpenters, painters, metal fabricators, and electricians are employed directly by our studio, ensuring consistent craftsmanship."
  },
  {
    num: "04",
    title: "End-to-End Turnkey Execution",
    desc: "From initial demolition and masonry to final lighting polish and handover, we handle every permit and site coordination detail."
  },
  {
    num: "05",
    title: "Rigorous Handover Timelines",
    desc: "Disciplined project schedules and daily site progress logs guarantee you receive your keys on the contractually agreed date."
  },
  {
    num: "06",
    title: "Ongoing Studio Maintenance & Care",
    desc: "We treat our work as a permanent relationship, providing warranty coverage and prompt technical support for years to come."
  }
];

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [contactData, setContactData] = useState(null);

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
        console.error("Error fetching about page data:", error);
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
    profilePicture: aboutData?.profile?.profilePicture || (ceoFallback?.src || ceoFallback)
  };

  const hotline = contactData?.mobile || "+8801722728272";

  return (
    <div className="about-page-wrapper">
      <TopMenu />

      {/* Editorial Split Hero */}
      <section className="about-editorial-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left: Monograph Headline */}
            <div className="col-12 col-lg-7">
              <div className="about-micro-tag">
                3P Communication &bull; Architectural Studio &bull; Dhaka
              </div>
              <h1 className="about-editorial-headline">
                Architecture for Living. Built with Honest Materials.
              </h1>
              <p className="about-editorial-lead">
                Founded in 2014 in Mohammadpur, Dhaka, 3P Communication was built to bridge the gap between ambitious design blueprints and rigorous on-site civil craftsmanship. We transform residential apartments, commercial corporate headquarters, building facades, and landmark event environments.
              </p>
              <div className="about-spec-strip">
                <div className="about-spec-item">
                  <FaMapMarkerAlt className="text-secondary me-2" />
                  <span>Studio: <strong>1/3 Asad Avenue, Mohammadpur, Dhaka</strong></span>
                </div>
                <div className="about-spec-item">
                  <span>Practice: <strong>Interior &bull; Exterior &bull; Events</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Visual Collage Frame */}
            <div className="col-12 col-lg-5">
              <div className="about-hero-visual-card">
                <img
                  src={heroSpacePhoto?.src || heroSpacePhoto}
                  alt="3P Communication Spatial Philosophy"
                  className="about-hero-img"
                />
                <div className="about-hero-caption">
                  <div>
                    <p className="about-caption-title">3P Communication Design Atelier</p>
                    <span className="about-caption-sub">Spatial Architecture &bull; Dhaka, Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Director & Founder Monograph */}
      <section className="about-director-section">
        <div className="container">
          <div className="director-monograph-card">
            <div className="row align-items-center g-5">
              
              {/* Left: Portrait */}
              <div className="col-12 col-lg-5 text-center">
                <div className="director-portrait-wrap">
                  <img
                    src={director.profilePicture}
                    alt={director.name}
                    className="director-portrait-img"
                    onError={(e) => {
                      e.target.src = ceoFallback?.src || ceoFallback;
                    }}
                  />
                  <div className="director-portrait-badge">
                    <span className="portrait-badge-val">{stats.yearsInService}+ Years</span>
                    <span className="portrait-badge-label">Studio Leadership</span>
                  </div>
                </div>
              </div>

              {/* Right: Personal Letter */}
              <div className="col-12 col-lg-7">
                <div className="director-editorial-col">
                  <span className="director-section-num">Leadership &amp; Direction</span>
                  <h2 className="director-name-title">{director.name}</h2>
                  <div className="director-role-sub">{director.position}</div>

                  <p className="director-letter-body">
                    "When I founded 3P Communication, my goal was simple: eliminate the friction between creative architectural drawings and real on-site construction. Too often in Bangladesh, clients are caught between designers who lack site experience and contractors who cut material corners. 
                  </p>
                  <p className="director-letter-body">
                    We built our practice on an integrated model: our designers walk the site every single morning, inspect joinery personally, test illumination under natural daylight, and ensure that every completed space stands as a lasting source of pride for its owners."
                  </p>

                  <div className="director-pledge-grid">
                    <div>
                      <h4 className="pledge-item-title">On-Site Accountability</h4>
                      <p className="pledge-item-desc">Direct daily supervision by lead architects, guaranteeing zero deviations from approved specifications.</p>
                    </div>
                    <div>
                      <h4 className="pledge-item-title">Honest Material Selection</h4>
                      <p className="pledge-item-desc">Sourcing genuine hardwoods, certified hardware, and low-emission coatings for longevity.</p>
                    </div>
                  </div>

                  <div className="director-sign-row">
                    <div>
                      <div className="director-sign-name">{director.name}</div>
                      <div className="director-sign-title">Managing Director, 3P Communication</div>
                    </div>
                    <Link href="/contactus" className="consult-btn-primary">
                      <span>Connect with Leadership</span>
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Disciplines (Triptych Photo Cards) */}
      <section className="about-disciplines-section">
        <div className="container">
          <div className="manifesto-header">
            <span className="manifesto-section-num">Multidisciplinary Practice</span>
            <h2 className="manifesto-main-title">The Three Pillars of 3P</h2>
          </div>

          <div className="triptych-grid">
            {DISCIPLINES_TRIPTYCH.map((item, idx) => (
              <div key={idx} className="triptych-card">
                <div className="triptych-img-wrap">
                  <img
                    src={item.image?.src || item.image}
                    alt={item.title}
                    className="triptych-img"
                  />
                </div>
                <div className="triptych-body">
                  <span className="triptych-index">{item.index}</span>
                  <h3 className="triptych-title">{item.title}</h3>
                  <p className="triptych-desc">{item.desc}</p>
                  <ul className="triptych-specs">
                    {item.specs.map((sp, sIdx) => (
                      <li key={sIdx}>{sp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Standards & Proof (Architectural Index) */}
      <section className="about-standards-section">
        <div className="container">
          <div className="manifesto-header">
            <span className="manifesto-section-num">Practice Standards</span>
            <h2 className="manifesto-main-title">Principles That Define Every Handover</h2>
          </div>

          <div className="standards-grid">
            {ARCHITECTURAL_STANDARDS.map((std, idx) => (
              <div key={idx} className="standard-card">
                <span className="standard-num">{std.num}</span>
                <h3 className="standard-title">{std.title}</h3>
                <p className="standard-desc">{std.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics Bar (Architectural Spec Strip) */}
      <section className="about-stats-strip">
        <div className="container">
          <div className="stats-strip-grid">
            <div className="stat-strip-item">
              <div className="stat-strip-val">
                {stats.projectsCompleted}<span>+</span>
              </div>
              <div className="stat-strip-label">Major Projects Handed Over</div>
              <p className="stat-strip-sub">Residential, commercial &amp; exterior landmarks</p>
            </div>

            <div className="stat-strip-item">
              <div className="stat-strip-val">
                {stats.awardsReceived}<span>+</span>
              </div>
              <div className="stat-strip-label">Design &amp; Service Accolades</div>
              <p className="stat-strip-sub">Recognized industry and client excellence</p>
            </div>

            <div className="stat-strip-item">
              <div className="stat-strip-val">
                {stats.happyCustomers}<span>+</span>
              </div>
              <div className="stat-strip-label">Discerning Clients Served</div>
              <p className="stat-strip-sub">Homeowners, enterprises &amp; national brands</p>
            </div>

            <div className="stat-strip-item">
              <div className="stat-strip-val">
                {stats.yearsInService}<span>+</span>
              </div>
              <div className="stat-strip-label">Years Continuous Practice</div>
              <p className="stat-strip-sub">Founded in 2014 &bull; Asad Gate, Mohammadpur</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Invitation Card */}
      <section className="about-consult-section">
        <div className="container">
          <div className="about-consult-card">
            <div>
              <h3 className="consult-title">Ready to Review Your Space with Our Architects?</h3>
              <p className="consult-desc">
                Visit our design studio at Asad Avenue, Mohammadpur, Dhaka, or schedule a consultation with our senior project team to review your architectural drawings, spatial layouts, and budget parameters.
              </p>
            </div>
            <div className="consult-actions">
              <Link href="/contactus" className="consult-btn-primary">
                <span>Book Consultation ↗</span>
              </Link>
              <a href={`tel:${hotline}`} className="consult-btn-secondary">
                <FaPhoneAlt />
                <span>{hotline}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
