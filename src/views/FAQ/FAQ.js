'use client';

import React from "react";
// import TopMenu from "../core/TopMenu";
// import Footer from "../core/Footer";
import { Container, Row, Col, Accordion } from "react-bootstrap";
// import "./App.css";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";

const FAQ = () => {
  // Sample FAQ data
  const faqData = [
    {
      id: 1,
      question: "What services do you offer?",
      answer:
        "We offer a range of services including interior and exterior design, event management, and architectural planning.",
    },
    {
      id: 2,
      question: "How can I contact your team?",
      answer: "You can contact us through the contact form on our website or via email.",
    },
    {
      id: 3,
      question: "Do you provide customized design solutions?",
      answer: "Yes, we provide fully customized solutions based on your needs.",
    },
    {
      id: 4,
      question: "What is the process for hiring your services?",
      answer: "You can request a consultation via our website and we will guide you through the next steps.",
    },
  ];

  const FAQSection = () => (
    <Container className="my-5 py-5">
      <Row>
        <Col>
          <h1 className="my-5 py-5">
            <span className="bigText">Frequently</span> <span className="smallText">Asked Questions</span>
          </h1>
          <Accordion defaultActiveKey="0">
            {faqData.map((faq) => (
              <Accordion.Item eventKey={faq.id} key={faq.id}>
                <Accordion.Header>{faq.question}</Accordion.Header>
                <Accordion.Body>{faq.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );

  return (
    <div className="g-0 body_background" style={{ maxWidth: "100vw" }}>
      <div>
        <TopMenu />
      </div>
      <div className="container-fluid">
        <div>{FAQSection()}</div>
        <div id="contact">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
