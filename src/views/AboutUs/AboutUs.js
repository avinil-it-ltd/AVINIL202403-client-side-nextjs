'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import axios from "axios";
import {
  FaHome,
  FaBuilding,
  FaGlassCheers,
  FaAward,
  FaCheckCircle,
  FaPhoneAlt,
  FaQuoteLeft,
  FaUsers,
  FaCalendarAlt,
  FaArrowRight
} from "react-icons/fa";
import ceoFallback from "../../assets/images/about/ceo.png";
import "./About.css";

const CORE_SERVICES = [
  {
    badge: "01 / INTERIOR",
    title: "Home & Apartment Interior Design",
    icon: <FaHome />,
    desc: "From modern living rooms and cozy master bedrooms to modular kitchens and smart duplex layouts, we design homes that balance elegance, comfort, and everyday functionality.",
    features: [
      "Custom Living & Bedroom Space Planning",
      "Modular Kitchens & Built-in Wardrobes",
      "Lighting, Ceiling & Wall Panel Design"
    ]
  },
  {
    badge: "02 / EXTERIOR & COMMERCIAL",
    title: "Office Interiors & Building Facades",
    icon: <FaBuilding />,
    desc: "We transform commercial offices, retail showrooms, restaurants, and building exterior facades into modern, brand-defining spaces that impress clients and inspire teams.",
    features: [
      "Modern Office Workstations & Executive Cabins",
      "Building Exterior Facade Cladding & Gates",
      "Retail Showroom & Restaurant Fit-outs"
    ]
  },
  {
    badge: "03 / EVENT MANAGEMENT",
    title: "Corporate Events & Stage Production",
    icon: <FaGlassCheers />,
    desc: "Complete end-to-end event management for corporate AGMs, brand launches, trade expos, and gala conferences with custom stage fabrication, sound, and lighting.",
    features: [
      "Custom Stage Design & Pavilion Fabrication",
      "Professional Sound, LED Screen & Lighting Setup",
      "Complete On-Site Event Protocol & Coordination"
    ]
  }
];

const DEFAULT_WHY_CHOOSE_US = [
  {
    title: "Custom 3D Design Before We Build",
    description: "Preview your exact space in photorealistic 3D renders before construction starts, ensuring zero guesswork.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925067/3pcom/uploads/designer_re5rov.jpg"
  },
  {
    title: "Transparent Budgets, No Hidden Costs",
    description: "Detailed, itemized quotations with clear material specifications so you stay comfortably in control of your budget.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925091/3pcom/uploads/soultion_ttcxbt.jpg"
  },
  {
    title: "Durable & Certified Materials",
    description: "We use high-grade boards, genuine hardware, branded paints, and eco-friendly finishes built to last for decades.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925094/3pcom/uploads/sustainability_pgcrrf.jpg"
  },
  {
    title: "Complete Turnkey Solutions",
    description: "From civil demolition, electrical and plumbing to woodwork, painting, and final cleaning — we handle it all.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925111/3pcom/uploads/service_pabyxm.jpg"
  },
  {
    title: "On-Time Project Handover",
    description: "Disciplined project schedules and daily supervision ensure we hand over your keys on the promised date.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925117/3pcom/uploads/track_zwmnab.jpg"
  },
  {
    title: "Dedicated After-Service Support",
    description: "We stand firmly behind our workmanship with reliable ongoing maintenance and prompt customer care.",
    imageUrl: "https://res.cloudinary.com/avinilit/image/upload/v1729925846/3pcom/uploads/better_yisx6j.jpg"
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
    introduction: aboutData?.profile?.introduction && aboutData.profile.introduction.length > 30
      ? aboutData.profile.introduction
      : "When we take on a project, we don't just see blueprints or empty rooms — we see a family's dream home, a business owner's ambitious future, or a brand's milestone moment. Our promise is simple: listen carefully, design thoughtfully, use honest materials, and deliver on time.",
    profilePicture: aboutData?.profile?.profilePicture || (ceoFallback?.src || ceoFallback)
  };

  const whyChooseList = (aboutData?.whyChooseUs && aboutData.whyChooseUs.length > 0)
    ? aboutData.whyChooseUs
    : DEFAULT_WHY_CHOOSE_US;

  const hotline = contactData?.mobile || "+8801722728272";

  return (
    <div className="about-page-wrapper">
      <TopMenu />

      {/* Hero Header */}
      <section className="about-hero-banner">
        <div className="container">
          <div className="about-hero-tag">
            About 3P Communication
          </div>
          <h1 className="about-hero-title">
            Designing Spaces You Love, <span>Crafted with Care</span>
          </h1>
          <p className="about-hero-subtitle">
            From 3D concept designs to complete turnkey handover, 3P Communication is your trusted partner for home interiors, commercial office setups, building facades, and corporate events across Bangladesh.
          </p>
        </div>
      </section>

      {/* Founder & Leadership Spotlight */}
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
                    <span className="badge-text">Years of Trusted Craftsmanship</span>
                  </div>
                </div>
              </div>

              {/* Right: Leadership Content */}
              <div className="col-12 col-lg-7">
                <div className="director-content">
                  <div className="director-role-tag">Founder &amp; Managing Director</div>
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
                        <strong>Custom 3D Visualization Before Execution:</strong> You see every detail, material texture, and lighting plan in 3D before work starts on-site.
                      </span>
                    </div>
                    <div className="philosophy-item">
                      <FaCheckCircle className="philosophy-icon" />
                      <span>
                        <strong>Honest Budgets &amp; No Hidden Charges:</strong> Clear, itemized pricing so your project finishes smoothly without unexpected costs.
                      </span>
                    </div>
                    <div className="philosophy-item">
                      <FaCheckCircle className="philosophy-icon" />
                      <span>
                        <strong>In-House Skilled Artisans &amp; Quality Control:</strong> Experienced carpenters, painters, and site supervisors ensuring top-notch durability.
                      </span>
                    </div>
                  </div>

                  <Link href="/contactus" className="btn cta-btn-primary">
                    <span>Talk with Our Team</span>
                    <FaArrowRight />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* KPI Impact Statistics Strip */}
      <section className="about-stats-section">
        <div className="container">
          <div className="stats-grid">
            
            <div className="stat-metric-card">
              <div className="stat-icon-circle">
                <FaHome />
              </div>
              <div className="stat-number">
                {stats.projectsCompleted}<span>+</span>
              </div>
              <div className="stat-label">Major Projects Completed</div>
              <p className="stat-desc">Homes, duplexes &amp; corporate offices</p>
            </div>

            <div className="stat-metric-card">
              <div className="stat-icon-circle">
                <FaAward />
              </div>
              <div className="stat-number">
                {stats.awardsReceived}<span>+</span>
              </div>
              <div className="stat-label">Design &amp; Service Awards</div>
              <p className="stat-desc">Recognized for customer satisfaction</p>
            </div>

            <div className="stat-metric-card">
              <div className="stat-icon-circle">
                <FaUsers />
              </div>
              <div className="stat-number">
                {stats.happyCustomers}<span>+</span>
              </div>
              <div className="stat-label">Delighted Clients</div>
              <p className="stat-desc">Homeowners, corporations &amp; brands</p>
            </div>

            <div className="stat-metric-card">
              <div className="stat-icon-circle">
                <FaCalendarAlt />
              </div>
              <div className="stat-number">
                {stats.yearsInService}<span>+</span>
              </div>
              <div className="stat-label">Years of Experience</div>
              <p className="stat-desc">Serving clients in Dhaka since 2014</p>
            </div>

          </div>
        </div>
      </section>

      {/* The 3 Core Services */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-tag">What We Do</span>
            <h2 className="about-section-title">Our Core Design Services</h2>
            <p className="about-section-subtitle">
              Whether it's your personal sanctuary, a dynamic office workplace, or an unforgettable corporate event, we handle everything from start to finish.
            </p>
          </div>

          <div className="disciplines-grid">
            {CORE_SERVICES.map((item, idx) => (
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

      {/* Why Choose 3P (6 Real Value Pillars) */}
      <section className="about-section" style={{ backgroundColor: "#f6f2ec" }}>
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-tag">Why Work With Us</span>
            <h2 className="about-section-title">Why Homeowners &amp; Businesses Choose 3P</h2>
            <p className="about-section-subtitle">
              We take the stress out of building and renovating with transparent budgets, quality craftsmanship, and reliable handovers.
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

      {/* Warm Consultation Call to Action Banner */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <div className="row align-items-center">
              <div className="col-12 col-lg-7 mb-4 mb-lg-0">
                <h3 className="cta-title">
                  Ready to Build or Renovate Your <span>Dream Space?</span>
                </h3>
                <p className="cta-desc">
                  Visit our studio in Mohammadpur, Dhaka, or book a free consultation with our design team to discuss your project ideas, space layout, and budget.
                </p>
              </div>
              <div className="col-12 col-lg-5 text-lg-end">
                <div className="cta-actions justify-content-lg-end">
                  <Link href="/contactus" className="cta-btn-primary">
                    <span>Book Free Consultation ↗</span>
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
