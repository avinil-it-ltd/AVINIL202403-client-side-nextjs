'use client';

import React, { useState, useEffect } from "react";
import TopMenu from "../../core/TopMenu";
import Footer from "../../core/Footer";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { zoomIn } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import profile from '../../assets/images/about/ceo.png'; // Placeholder for CEO image
import projectComplete from '../../assets/images/project.png';
import award from '../../assets/images/award.png';
import client from '../../assets/images/happyClient.png';
import servicespic from '../../assets/images/customer-service.png';
import './About.css'
const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const ZoomIn = styled.div`animation: 3s ${keyframes`${zoomIn}`}`;
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/about'); // Adjust the API endpoint as necessary
        setAboutData(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching about data:", error);
      }
    };

    fetchAboutData();
  }, []);

  const process = () => (
    <div className="mt-0" style={{ height: "auto" }}>
      <div style={{ opacity: "0.9", height: "auto" }}>
        <h1 className="text-center mt-0 p-5 heading_color" style={{ fontFamily: "'Aref Ruqaa', serif" }}>Our Process</h1>
        <div className="row p-5">
          <div className="col-12 col-md-3 text-center p-2">
            <div className="mx-auto row align-items-center" style={{ height: "150px", width: "150px" }}>
              <img src={projectComplete?.src || projectComplete} alt="" />
            </div>
            <div className="mt-4 h5 heading_color text-center" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{aboutData?.statistics?.projectsCompleted}+ PROJECTS COMPLETED</div>
          </div>
          <div className="col-12 col-md-3 text-center p-2">
            <div className="mx-auto row align-items-center" style={{ height: "150px", width: "150px" }}>
              <img src={award?.src || award} alt="" />
            </div>
            <div className="mt-4 h5 heading_color text-center" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{aboutData?.statistics?.awardsReceived}+ AWARDS RECEIVED</div>
          </div>
          <div className="col-12 col-md-3 text-center p-2">
            <div className="mx-auto row align-items-center" style={{ height: "150px", width: "150px" }}>
              <img src={client?.src || client} alt="" />
            </div>
            <div className="mt-4 h5 heading_color text-center" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{aboutData?.statistics?.happyCustomers}+ HAPPY CUSTOMERS</div>
          </div>
          <div className="col-12 col-md-3 text-center p-2">
            <div className="mx-auto row align-items-center" style={{ height: "150px", width: "150px" }}>
              <img src={servicespic?.src || servicespic} alt="" />
            </div>
            <div className="mt-4 h5 heading_color text-center" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{aboutData?.statistics?.yearsInService}+  YEARS IN SERVICE</div>
          </div>
        </div>
      </div>
    </div>
  );

  // const ChooseMe = () => (
  //   <div className="container my-5 pt-5">
  //     <h2 className="heading_color py-5 text-center">Why Choose Us?</h2>
  //     <div className="row justify-content-center align-items-center">
  //       {/* Left Circle Sections */}
  //       <div className="col-4">
  //         {aboutData?.whyChooseUs?.slice(0, 3).map((item, index) => (
  //           <div key={index} className="circle-section mb-4">
  //             <img
  //               src={item.imageUrl} // Use the image URL from your backend
  //               alt={`Why Choose Us - ${item.title}`} // Descriptive alt text
  //               className="circle-img"
  //             />
  //             <div className="text-start ps-3">
  //               <h5 className="fs-6 fw-bold">{item.title}</h5>
  //               <p className="fs-6">{item.description}</p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {/* Center Circle Image with Border */}
  //       <div className="col-4 text-center">
  //         <div className="center-circle-container">
  //           <img
  //             src={aboutData?.centralImage} // Assuming you might have a central image in your data
  //             alt="Center Circle"
  //             className="center-circle"
  //           />
  //         </div>
  //       </div>

  //       {/* Right Circle Sections */}
  //       <div className="col-4 text-center">
  //         {aboutData?.whyChooseUs?.slice(3).map((item, index) => (
  //           <div key={index} className="circle-section mb-4">
  //             <img
  //               src={item.imageUrl} // Use the image URL from your backend
  //               alt={`Why Choose Us - ${item.title}`} // Descriptive alt text
  //               className="circle-img"
  //             />
  //             <div className="text-start ps-3">
  //               <h4>{item.title}</h4>
  //               <p>{item.description}</p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );

  const ChooseMe = () => (
    <div className="container my-5 pt-5">
      <h2 className="heading_color py-5 text-center">Why Choose Us?</h2>
      <div className="row justify-content-center align-items-center">

        {/* Left Circle Sections */}
        <div className="col-12 col-md-4 text-center text-md-start">
          {aboutData?.whyChooseUs?.slice(0, 3).map((item, index) => (
            <div key={index} className="circle-section mb-4 d-flex align-items-center justify-content-center">
              <img
                src={item.imageUrl}
                alt={`Why Choose Us - ${item.title}`}
                className="circle-img img-fluid"
              />
              <div className="text-start ps-3">
                <h5 className="fs-6 fw-bold">{item.title}</h5>
                <p className="fs-6">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center Circle Image with Border */}
        <div className="col-12 col-md-4 text-center my-4 my-md-0">
          <div className="center-circle-container">
            <img
              src={aboutData?.centralImage}
              alt="Center Circle"
              className="center-circle img-fluid"
            />
          </div>
        </div>

        {/* Right Circle Sections */}
        <div className="col-12 col-md-4 text-center text-md-start">
          {aboutData?.whyChooseUs?.slice(3).map((item, index) => (
            <div key={index} className="circle-section mb-4 d-flex align-items-center justify-content-center">
              <img
                src={item.imageUrl}
                alt={`Why Choose Us - ${item.title}`}
                className="circle-img img-fluid"
              />
              <div className="text-start ps-3">
                <h5 className="fs-6 fw-bold">{item.title}</h5>
                <p className="fs-6">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );





  // State to hold contact details, loading, and error
  const [contactDetails, setContactDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch("https://3pcommunicationsserver.vercel.app/api/myContact"); // Adjust the URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch contact details");
        }
        const data = await response.json();
        setContactDetails(data); // Set contact details
      } catch (error) {
        console.error("Error fetching contact details:", error);
        setError("Failed to load contact details.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchContactDetails();
  }, []); // Empty dependency array to run only once



  const callNow = () => (
    <div className="w-100 bg-dark my-5 py-5">
      <div className="d-flex flex-column flex-md-row justify-content-around align-items-center text-center text-md-start text-black fw-bolder px-3 px-md-5 callNow_font">

        {/* Column 1 - Text */}
        <div className="col-md-4 mb-3 mb-md-0 text-white">
          <h3>CONTACT NOW FOR YOUR DREAM INTO REALITY</h3>
        </div>

        {/* Column 2 - Phone Number with Icon */}
        <div className="col-md-4 mb-3 mb-md-0 d-flex align-items-center justify-content-center">
          <div className="d-flex align-items-center justify-content-center">
            <div className="icon-circle">
              <i className="bi bi-telephone-fill"></i> {/* Bootstrap phone icon */}
            </div>
            <div className="px-3 pt-5">
              <p className="text-warning"> CALL US<br />
                <span className="text-white"> {contactDetails ? contactDetails?.mobile : "+880000000000"}</span>
              </p>
              <p className="ms-2 fw-bold"></p>
            </div>
          </div>
        </div>

        {/* Column 3 - Email with Icon */}
        <div className="col-md-4 d-flex align-items-center justify-content-center">
          <div>
            <div className="d-flex align-items-center justify-content-center">
              <div className="icon-circle">
                <i className="bi bi-envelope-fill"></i> {/* Bootstrap envelope icon */}
              </div>
              <div className="px-3 pt-3">
                <p className="text-warning">PLEASE SEND EMAIL<br />
                  <span className="fw-bold text-white">{contactDetails ? contactDetails?.email : "info@example.com"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );



  // Custom Loader JSX
  const Loader = () => (
    <div className="loader-container">
      <div className="custom-loader"></div>
    </div>
  );


  if (loading) {
    return <Loader />; // Use your custom loader here
  }




  // if (!aboutData) {
  //   return <div>Loading...</div>; // Loading state
  // }

  return (
    <div>

      <TopMenu />
      <div className="container" style={{ maxWidth: "100vw" }}>

        <div className="row">
          <div className="col-12 pt-5 mt-5 d-flex justify-content-center">
            <div className="col-md-4 text-center">
              <div className="profile-card  rounded bg-light p-4 shadow mx-auto">
                <img
                  src={profile?.src || profile} // Optionally replace with dynamic profile image from backend
                  alt="Profile"
                  className="img-fluid rounded-circle border border-white mb-3 mt-3"
                  style={{ width: "100%", height: "270px", objectFit: "cover" }}
                />
                <h4
                  className="heading_color mb-0"
                  style={{ fontFamily: "'Aref Ruqaa', serif" }}
                >
                  {aboutData?.profile?.name}
                </h4>
                <p
                  className="text-muted"
                  style={{ fontFamily: "'Aref Ruqaa', serif" }}
                >
                  {aboutData?.profile?.position}
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <h3
              className="heading_color mt-3 mb-3"
              style={{ fontFamily: "'Aref Ruqaa', serif" }}
            >
              Get To Know Our Director
            </h3>
            <div className="introduction-text my-auto" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <p className="text-black">
                {aboutData?.profile?.introduction}
              </p>
            </div>
          </div>
        </div>


        <div>{ChooseMe()}</div>
        <div>{callNow()}</div>
        <div>{process()}</div>



      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
