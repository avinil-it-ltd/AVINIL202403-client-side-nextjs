'use client';

import React, { useEffect, useState } from 'react'; // Import React
import './Testimonial.css'; // Import your CSS
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import testimonialImage from "../../../../src/assets/images/testimonialImage.jpg";

function Testimonial() {
  const [testimonialsData, setTestimonialsData] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('https://3pcommunicationsserver.vercel.app/api/testimonials'); // Adjust the endpoint as needed
        const data = await response.json();
        setTestimonialsData(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <Container fluid>
      <section className="testimonial-section py-5 bg-white position-relative">
        <div className="container pb-5 mb-5">
          <Row className="mb-5">
            {/* Left Section with Image and Text */}
            <Col lg={6} md={12} className="mb-4" data-aos="zoom-in-left">
              <img
                src={testimonialImage}
                alt="Testimonial Section"
                className="img-fluid rounded-lg"
              />
            </Col>

            {/* Right Heading, Paragraph, and Button */}
            <Col lg={6} md={12} className="p-3" data-aos="fade-up">
              <h2 className="display-4 pt-5 text-start font-weight-bold">Discover Client Experiences</h2>
              <p className="text-muted mb-5">
                Our clients consistently praise our commitment to quality and service. Join the growing list of satisfied clients who trust us for their meeting needs.
              </p>
              <Link to="/interior">
                <button className="btn dashboard_all_button text-white fw-bold px-5 py-2"> Explore The Projects</button>
              </Link>
            </Col>
          </Row>

          {/* Testimonial Cards at Bottom Right */}
          <div className="testimonial-carousel-wrapper">
            <div className="testimonial-carousel">
              {testimonialsData.map((testimonial, index) => (
                <div key={index} className="card bg-white testimonial-card border-0 mx-3 p-3 shadow-sm">
                  <div className="d-flex align-items-center">
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="rounded-circle me-3"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div className="ps-3">
                      <h6 className="mb-1">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.designation}</small>
                    </div>
                  </div>
                  <p className="mt-3 text-muted">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}

export default Testimonial;
