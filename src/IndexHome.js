'use client';

import React, { useState, useEffect } from "react";
import TopMenu from "./core/TopMenu";
import Footer from "./core/Footer.js";
import ContactModal from "./views/Contact/ContactModal";
import PageUpButton from "./PageUpButton/PageUpButton";
import Headline from "./views/Home/Headline/Headline.js";
import Banner from "./views/Home/Banner/Banner.js";
import CorporateTrustBar from "./views/Home/CorporateTrustBar/CorporateTrustBar.js";
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
    // Show consultation modal at most once per 24 hours per device
    if (typeof window !== 'undefined') {
      try {
        const lastShown = localStorage.getItem('3p_contact_modal_last_shown');
        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        if (!lastShown || now - parseInt(lastShown, 10) > ONE_DAY_MS) {
          const timer = setTimeout(() => {
            setModalShow(true);
            localStorage.setItem('3p_contact_modal_last_shown', String(Date.now()));
          }, 4500);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error('Error with contact modal frequency check:', err);
      }
    }
  }, []);

  return (
    <div className="homepage-wrapper">
      <TopMenu />
      <Headline />
      
      <main>
        <Banner />
        <CorporateTrustBar />
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
