'use client';

import React, { useState, useEffect } from "react";
import TopMenu from "./core/TopMenu";
import Footer from "./core/Footer.js";
import ContactModal from "./views/Contact/ContactModal";
import PageUpButton from "./PageUpButton/PageUpButton";
import Headline from "./views/Home/Headline/Headline.js";
import Banner from "./views/Home/Banner/Banner.js";
import Introduction from "./views/Home/Introduction/Introduction.js";
import Services from "./views/Home/Services/Services.js";
import Process from "./views/Home/Process/Process.js";
import ThreeImg from "./views/Home/ThreeImg/ThreeImg.js";
import Clients from "./views/Home/Clients/Clients.js";
import ContactInfo from "./views/Home/ContactInfo/ContactInfo.js";
import Testimonial from "./views/Home/Testimonial/Testimonial.js";
import FAQ from "./views/Home/FAQ/FAQ.js";
import FeaturedProjects from "./views/Home/FeaturedProjects/FeaturedProjects.js";

const IndexHome = () => {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalShow(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="homepage-wrapper">
      <TopMenu />
      <Headline />
      
      <main>
        <Banner />
        <Introduction />
        <Services />
        <FeaturedProjects />
        <Process />
        <ThreeImg />
        <Clients />
        <ContactInfo />
        <Testimonial />
        <FAQ />
      </main>

      <PageUpButton />
      <div id="contact">
        <Footer />
      </div>

      <ContactModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default IndexHome;
