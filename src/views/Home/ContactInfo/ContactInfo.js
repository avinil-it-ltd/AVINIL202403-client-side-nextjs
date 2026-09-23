'use client';


import './ContactInfo.css'; // Import your CSS
// import '../../../../../src/assets/images/contact-bg.jpg'
import React, { useState, useEffect } from "react";


function ContactInfo() {




    // State to hold contact details, loading, and error
    const [contactDetails, setContactDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    
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

    // Custom Loader JSX
    const Loader = () => (
        <div className="loader-container">
            <div className="custom-loader"></div>
        </div>
    );

    if (loading) {
        return <Loader />; // Use your custom loader here
    }


    return (
        <>
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
        </>
    );
}

export default ContactInfo;

