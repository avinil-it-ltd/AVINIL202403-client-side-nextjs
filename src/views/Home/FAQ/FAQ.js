'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import right from '../../../assets/images/interiorPage/right.jpg';
import './FAQ.css';

const defaultFaqs = [
  {
    question: "What is your turnkey delivery process?",
    answer: "Our turnkey service encompasses initial spatial 3D visualization, material specification, civil construction, custom workshop joinery, and final quality snagging with a single accountable point of contact."
  },
  {
    question: "How do you estimate project budgets and timelines?",
    answer: "Following the initial site audit, we prepare an itemized Bill of Quantities (BOQ) with transparent material costs, labor schedules, and committed completion milestones before any construction commences."
  },
  {
    question: "Do you manufacture bespoke furniture and millwork in-house?",
    answer: "Yes. 3P Communication operates a dedicated carpentry and joinery workshop in Dhaka, ensuring strict quality control over wood treatment, hardware precision, and custom finishings."
  },
  {
    question: "Can we visit past completed projects or your atelier?",
    answer: "Absolutely. We welcome clients to our studio at Asad Gate, Mohammadpur to inspect material samples and review working architectural drawings, as well as schedule visits to ongoing site works."
  }
];

function FAQ() {
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [activeKey, setActiveKey] = useState(0);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('https://3pcommunicationsserver.vercel.app/api/faqs');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setFaqs(data);
          }
        }
      } catch (error) {
        console.warn("Using default architectural FAQs:", error.message);
      }
    };
    fetchFaqs();
  }, []);

  const toggleKey = (index) => {
    setActiveKey(activeKey === index ? null : index);
  };

  return (
    <section className="faq-editorial-section py-5" id="faq">
      <Container className="py-4">
        <Row className="align-items-center g-5">
          {/* Left Column: FAQ Accordion */}
          <Col lg={7}>
            <div className="faq-section-header mb-4">
              <span className="faq-eyebrow">SPECIFICATIONS & TRANSPARENCY</span>
              <h2 className="faq-main-title">
                Frequently Inquired Questions
              </h2>
              <p className="faq-lead-text">
                Direct insights regarding our architectural methodology, material specifications, transparent BOQ pricing, and turnkey delivery.
              </p>
            </div>

            <div className="faq-accordion-container">
              {faqs.map((faq, index) => {
                const isOpen = activeKey === index;
                return (
                  <div 
                    key={index} 
                    className={`faq-item-card ${isOpen ? 'active-faq-card' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleKey(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-text">{faq.question}</span>
                      <div className="faq-toggle-icon">
                        {isOpen ? <FaMinus /> : <FaPlus />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-body">
                        <p className="faq-answer-text">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Col>

          {/* Right Column: Architectural Studio Frame */}
          <Col lg={5}>
            <div className="faq-photo-lookbook">
              <div className="faq-photo-wrapper">
                <img
                  src={right?.src || right}
                  alt="3P Communication Studio Workshop"
                  className="faq-photo-img"
                  loading="lazy"
                />
              </div>
              <div className="faq-photo-caption">
                <div className="caption-marker"></div>
                <div className="caption-text">
                  <strong>3P Studio Atelier</strong> — Asad Gate, Mohammadpur, Dhaka. Material samples & working CAD drawings.
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default FAQ;
