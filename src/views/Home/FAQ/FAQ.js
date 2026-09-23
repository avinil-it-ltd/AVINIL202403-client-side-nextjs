'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import right from '../../../assets/images/interiorPage/right.jpg';
import './FAQ.css';

const defaultFaqs = [
  {
    question: "What is your complete design and setup process?",
    answer: "We handle the entire project from start to finish: initial 3D design, material selection, electrical and civil work, custom furniture making in our workshop, and final quality inspection before handing over the keys."
  },
  {
    question: "How do you estimate project budgets and timelines?",
    answer: "Following the site visit, we prepare a clear, itemized cost estimate with transparent material prices, labor costs, and committed delivery milestones before any work begins."
  },
  {
    question: "Do you make custom furniture in your own workshop?",
    answer: "Yes. 3P Communication operates a dedicated carpentry and woodworking workshop in Dhaka. This ensures high quality wood treatment, precise fittings, and durable finishing."
  },
  {
    question: "Can we visit your office or see ongoing project sites?",
    answer: "Absolutely. We welcome you to our office at Asad Gate, Mohammadpur, Dhaka to check material samples, view designs, and schedule visits to completed or ongoing project sites."
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
              <span className="faq-eyebrow">QUESTIONS &amp; ANSWERS</span>
              <h2 className="faq-main-title">
                Frequently Asked Questions
              </h2>
              <p className="faq-lead-text">
                Clear answers about our design process, pricing, materials, and project timelines.
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
                  <strong>3P Design Office</strong> — Asad Gate, Mohammadpur, Dhaka. Material samples & floor plan consultations.
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
