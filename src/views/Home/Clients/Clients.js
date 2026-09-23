'use client';

import React from 'react';
import './Clients.css';
import Marquee from 'react-fast-marquee';
import picture1 from '../../../../src/assets/images/clients/Picture1.jpg';
import picture2 from '../../../../src/assets/images/clients/Picture2.jpg';
import picture3 from '../../../../src/assets/images/clients/Picture3.png';
import picture4 from '../../../../src/assets/images/clients/Picture4.jpg';
import picture5 from '../../../../src/assets/images/clients/Picture5.jpg';
import picture6 from '../../../../src/assets/images/clients/Picture6.jpg';
import picture7 from '../../../../src/assets/images/clients/Picture7.jpg';
import picture8 from '../../../../src/assets/images/clients/Picture8.jpg';
import picture9 from '../../../../src/assets/images/clients/Picture9.jpg';
import picture10 from '../../../../src/assets/images/clients/Picture10.jpg';
import picture11 from '../../../../src/assets/images/clients/Picture11.jpg';
import picture12 from '../../../../src/assets/images/clients/Picture12.png';

const clientLogos = [
  picture1,
  picture2,
  picture3,
  picture4,
  picture5,
  picture6,
  picture7,
  picture8,
  picture9,
  picture10,
  picture11,
  picture12,
];

function Clients() {
  return (
    <section className="clients-section">
      <div className="container">
        <div className="clients-header">
          <span className="clients-eyebrow">Distinguished Partners</span>
          <h2 className="clients-title">Trusted by Leading Organizations</h2>
          <p className="clients-subtitle">
            Crafting inspiring spaces for prestigious corporations, institutions, and visionary clients across Bangladesh.
          </p>
        </div>
      </div>

      <div className="clients-marquee-wrapper">
        <Marquee
          speed={38}
          pauseOnHover={true}
          autoFill={true}
          gradient={false}
        >
          {clientLogos.map((pic, index) => (
            <div key={index} className="client-logo-card">
              <img
                src={pic?.src || pic}
                alt={`Client Logo ${index + 1}`}
                className="client-logo-img"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default Clients;
