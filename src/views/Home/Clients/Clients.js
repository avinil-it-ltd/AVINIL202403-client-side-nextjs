'use client';

// src/App.js
import React from 'react'; // Import React
import './Clients.css'; // Import your CSS
import { Link } from 'react-router-dom';
// import TopMenu from './core/TopMenu';
// import Footer from './core/Footer';
import picture1 from '../../../../src/assets/images/clients/Picture1.jpg'
import picture2 from '../../../../src/assets/images/clients/Picture2.jpg'
import picture3 from '../../../../src/assets/images/clients/Picture3.png'
import picture4 from '../../../../src/assets/images/clients/Picture4.jpg'
import picture5 from '../../../../src/assets/images/clients/Picture5.jpg'
import picture6 from '../../../../src/assets/images/clients/Picture6.jpg'
import picture7 from '../../../../src/assets/images/clients/Picture7.jpg'
import picture8 from '../../../../src/assets/images/clients/Picture8.jpg'
import picture9 from '../../../../src/assets/images/clients/Picture9.jpg'
import picture10 from '../../../../src/assets/images/clients/Picture10.jpg'
import picture11 from '../../../../src/assets/images/clients/Picture11.jpg'
import picture12 from '../../../../src/assets/images/clients/Picture12.png'
import { Container } from 'react-bootstrap';


function Clients() {
    return (
        <>
            <Container>
                <div className="container my-5 py-5">
                    <h2 className="text-center mb-2 fs-4 heading_color">Our Clients</h2>
                    <h1 className="text-center mb-5 callNow_font" style={{ fontFamily: "Times New Roman" }}>
                        We have worked with great people
                    </h1>

                    {/* Scrollable row of clients */}
                    <div className="client-scroll">
                        <div className="client-row ">
                            {[picture1, picture2, picture3, picture4, picture5, picture6, picture7, picture8, picture9, picture10, picture11, picture12].map((pic, index) => (
                                <div key={index} className="client-item">
                                    <img src={pic} alt={`Client ${index + 1}`} className="client-image mx-2" />
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </Container>
        </>
    );
}

export default Clients;

