'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import Marquee from 'react-fast-marquee';
import { FaQuoteLeft, FaStar, FaArrowRight } from 'react-icons/fa';
import testimonialImage from '../../../assets/images/testimonialImage.jpg';
import './Testimonial.css';

const fallbackTestimonials = [
  {
    name: "Engr. Kazi Mahfuz",
    designation: "Managing Director, Vertex Group",
    content: "3P Communication completed our corporate headquarters in Gulshan with impeccable joinery and architectural lighting. Their on-site supervision and adherence to schedule were outstanding.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Farhana Yasmin",
    designation: "Duplex Residence Owner, Uttara",
    content: "From the first 3D renders to the final wood polish, Prokash Banik and his team treated our home like their own. Transparent pricing, zero hidden surprises, and incredible attention to detail.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Syed Rezaul Karim",
    designation: "Head of Marketing, Apex Global",
    content: "The exhibition pavilion 3P Communication engineered for our brand launch was monumental. Structurally flawless and executed overnight under extreme deadline pressure.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
];

function Testimonial() {
  const [testimonialsData, setTestimonialsData] = useState(fallbackTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('https://3pcommunicationsserver.vercel.app/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setTestimonialsData(data);
          }
        }
      } catch (error) {
        console.warn("Using curated client endorsements:", error.message);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="testimonial-editorial-section py-5">
      <Container className="py-4">
        {/* Editorial Split Row */}
        <Row className="align-items-center g-5 mb-5">
          {/* Left: Studio Lookbook Photo */}
          <Col lg={5} md={12}>
            <div className="testimonial-frame">
              <img
                src={testimonialImage?.src || testimonialImage}
                alt="3P Communication Crafted Interior Space"
                className="testimonial-photo"
                loading="lazy"
              />
              <div className="testimonial-photo-tag">
                <span>HANDOVER VERIFIED • DHAKA</span>
              </div>
            </div>
          </Col>

          {/* Right: Editorial Context */}
          <Col lg={7} md={12}>
            <div className="testimonial-header-content">
              <span className="testimonial-eyebrow">CLIENT ENDORSEMENTS</span>
              <h2 className="testimonial-title">
                Trusted by Homeowners &amp; Leading Corporations
              </h2>
              <p className="testimonial-desc">
                Our clients value our disciplined adherence to transparent BOQ budgeting, durable natural materials, and stress-free turnkey execution across Bangladesh.
              </p>
              <div className="testimonial-cta-row">
                <Link href="/interior" className="testimonial-explore-btn">
                  <span>Explore Completed Projects</span>
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Testimonial Continuous Marquee Track */}
      <div className="testimonial-marquee-wrapper">
        <Marquee
          speed={32}
          pauseOnHover={true}
          autoFill={true}
          gradient={false}
        >
          {testimonialsData.map((item, index) => (
            <div key={index} className="editorial-quote-card">
              <div className="quote-card-header">
                <div className="quote-avatar-wrapper">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}
                    alt={item.name}
                    className="quote-avatar-img"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
                <div className="quote-meta">
                  <h4 className="quote-author-name">{item.name}</h4>
                  <div className="quote-author-role">{item.designation}</div>
                </div>
                <div className="quote-rating-stars" aria-label="5 stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>

              <div className="quote-card-body">
                <FaQuoteLeft className="quote-mark-icon" aria-hidden="true" />
                <p className="quote-body-text">{item.content}</p>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default Testimonial;
