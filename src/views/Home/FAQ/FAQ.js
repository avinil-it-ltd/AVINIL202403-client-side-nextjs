'use client';

// src/App.js
import React, { useEffect, useState } from 'react'; // Import React
import './FAQ.css'; // Import your CSS
import { Link } from 'react-router-dom';
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
// import TopMenu from './core/TopMenu';
// import Footer from './core/Footer';
import right from '../../../../src/assets/images/interiorPage/right.jpg';

function FAQ() {



    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch('https://3pcommunicationsserver.vercel.app/api/faqs'); // Adjust the endpoint as needed
                const data = await response.json();
                setFaqs(data);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            }
        };
        fetchFaqs();
    }, []);

    const [activeKey, setActiveKey] = useState(null);

    const toggleActiveKey = (key) => {
      setActiveKey(activeKey === key ? null : key);
    };
  
  
    return (
        <>
            <Container className="my-5 py-5">
                <Row className="align-items-center">
                    {/* FAQ Section */}
                    <Col lg={6} className="my-5 py-5 px-4">
                        <h2 className="heading_color mb-4" style={{ fontFamily: "'Aref Ruqaa', serif" }}>Frequently Asked Questions</h2>
                        <Accordion activeKey={activeKey}>
                            {faqs.map((faq, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Header
                                        onClick={() => toggleActiveKey(index)}
                                        className="d-flex align-items-center"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h6 className="mb-0 py-2">
                                            <span
                                                style={{
                                                    color: activeKey === index ? 'black' : 'black', // Orange when active, default color otherwise
                                                    textDecoration: 'none',
                                                    fontWeight: activeKey === index ? 'bold' : 'normal'
                                                }}
                                            >
                                                {faq.question}
                                            </span>
                                        </h6>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={index}>
                                        <Card.Body>{faq.answer}</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            ))}
                        </Accordion>
                    </Col>

                    {/* Right Side Image */}
                    <Col lg={6}>
                        <div className="text-center ">
                            <img
                                src={right?.src || right} // Replace with your desired image link
                                alt="FAQ Illustration"
                                className="w-100 "
                                style={{ borderRadius: '10px' }}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FAQ;
