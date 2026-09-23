'use client';

import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { zoomIn } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import TopMenu from "./core/TopMenu"
import Footer from "./core/Footer.js"
import Data from "./projects.json"
import { Accordion, Card } from 'react-bootstrap';


import { Container, Row, Col } from "react-bootstrap"


import testimonialImage from "../src/assets/images/testimonialImage.jpg"


// import './App.css';
import ContactModal from "./views/Contact/ContactModal";

import right from "../src/assets/images/interiorPage/right.jpg"
import PageUpButton from "./PageUpButton/PageUpButton";
// import './custom.css'
import Banner from "./views/Home/Banner/Banner.js";
import Introduction from "./views/Home/Introduction/Introduction.js";
import Process from "./views/Home/Process/Process.js";
import Services from "./views/Home/Services/Services.js";
import Clients from "./views/Home/Clients/Clients.js";
import ContactInfo from "./views/Home/ContactInfo/ContactInfo.js";
import ThreeImg from "./views/Home/ThreeImg/ThreeImg.js";
import FAQ from "./views/Home/FAQ/FAQ.js";
import Testimonial from "./views/Home/Testimonial/Testimonial.js";
import Headline from "./views/Home/Headline/Headline.js";


const ZoomIn = styled.div`animation:3s ${keyframes`${zoomIn}`}`;

const IndexHome = (props) => {
  const theme = '#191919'

  const [projects, setProjects] = useState([])



  const listAllProjects = () => {
    setProjects(Data)
  }

  useEffect(() => {
    listAllProjects()
  }, [props])

  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setModalShow(true);
    }, 3000)
  }, [])











  // Faq section functionality code 

  const [activeKey, setActiveKey] = useState(null);

  const toggleActiveKey = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };



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



  const testimoni = () => (
    <Container>
      <section className="testimonial-section py-5  bg-white position-relative">
        <div className="container pb-5 mb-5">
          <div className="row  mb-5">
            {/* Left Section with Image and Text */}
            <div className="col-lg-6" data-aos="zoom-in-left">
              <img
                src={testimonialImage?.src || testimonialImage}
                alt="Testimonial Section"
                className="img-fluid rounded-lg"
              />
            </div>

            {/* Right Heading, Paragraph, and Button */}
            <div className="col-lg-6 p-3" data-aos="fade-up">
              <h2 className="display-4 pt-5 font-weight-bold">Discover Client Experiences</h2>
              <p className="text-muted mb-5">
                Our clients consistently praise our commitment to quality and service.
                Join the growing list of satisfied clients who trust us for their meeting needs.
              </p>
              <Link to="/interior"><button className="btn dashboard_all_button text-white fw-bold px-5 py-2"> Explore The Projectrs</button></Link>
            </div>
          </div>

          {/* Testimonial Cards at Bottom Right */}
          <div className="testimonial-carousel-wrapper">
            <div className="testimonial-carousel">
              {testimonialsData.map((testimonial, index) => (
                <div key={index} className="card bg-white  testimonial-card border-0 mx-3 p-3 shadow-sm">
                  <div className="d-flex align-items-center">
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="rounded-circle mr-3"
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




  const faq = () => (
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
  )




  return (
    <div className="" >
      <div><TopMenu /></div>
      <Headline />
      <div className="">
        {/* <div>{topCarousel()}</div> */}
        <Banner />
        <Introduction />
        {/* <div>{process()}</div> */}
        <Process />
        {/* <div>{ourServices()}</div> */}
        <Services />
        {/* <div>{OurClients()}</div> */}
        <Clients />

        {/* <div>{callNow()}</div> */}
        <ContactInfo />
        {/* <div>{ThreeImgSection()}</div> */}
        <ThreeImg />
        {/* <div>{testimonials()}</div> */}
        {/* <div>{testimoni()}</div> */}
        <Testimonial />
        {/* <div>{faq()}</div> */}
        <FAQ />
        <PageUpButton />
        <div id="contact"><Footer /></div>


        
      <ContactModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
 
      </div>
    </div>
  )
}

export default IndexHome
