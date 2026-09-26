'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBuilding, FaCheckCircle, FaArrowRight, FaShieldAlt, FaAward } from 'react-icons/fa';
import './CorporateTrustBar.css';

const corporateClients = [
  {
    name: 'Evonik Bangladesh Ltd.',
    type: 'German Specialty Chemicals MNC',
    scope: '3,500 Sft Corporate HQ',
    badge: 'Multinational'
  },
  {
    name: 'Kemin Industries',
    type: 'Global Nutritional Bioscience MNC',
    scope: '2,500 Sft Commercial Office',
    badge: 'Multinational'
  },
  {
    name: "Green Herald Int'l School",
    type: 'Premier English Medium Institution',
    scope: '3,000 Sft Administrative Campus',
    badge: 'Institutional'
  },
  {
    name: 'Progoti Systems Ltd.',
    type: 'Corporate Technology & Financial Systems',
    scope: '2,200 Sft Executive Office Fit-Out',
    badge: 'Corporate'
  },
  {
    name: 'SB Knitwear Ltd.',
    type: 'Industrial Apparel Group',
    scope: 'Industrial Architectural Complex',
    badge: 'Industrial'
  }
];

export default function CorporateTrustBar() {
  return (
    <section className="corp-trust-section">
      <Container>
        {/* Header Strip */}
        <div className="corp-trust-header">
          <div className="corp-trust-left">
            <span className="corp-trust-eyebrow">
              <FaBuilding className="corp-eyebrow-icon" />
              COMMERCIAL &amp; CORPORATE WORKSPACES
            </span>
            <h2 className="corp-trust-title">
              Trusted by Multinational Leaders &amp; Renowned Institutions
            </h2>
          </div>
          <div className="corp-trust-right">
            <Link href="/interior?sub=Office" className="corp-explore-btn">
              <span>View Office Portfolio</span>
              <FaArrowRight className="corp-btn-arrow" />
            </Link>
          </div>
        </div>

        {/* Corporate Client Cards Grid */}
        <div className="corp-clients-grid">
          {corporateClients.map((client, idx) => (
            <div key={idx} className="corp-client-card">
              <div className="corp-card-top">
                <span className="corp-client-badge">{client.badge}</span>
                <span className="corp-verified-tag">
                  <FaCheckCircle /> Verified Fit-Out
                </span>
              </div>
              <h3 className="corp-client-name">{client.name}</h3>
              <p className="corp-client-type">{client.type}</p>
              <div className="corp-client-scope">
                <span className="scope-bullet"></span>
                <span>{client.scope}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Capabilities Assurance Strip */}
        <div className="corp-capabilities-bar">
          <div className="corp-cap-item">
            <FaShieldAlt className="corp-cap-icon" />
            <span>Turnkey MEPF, HVAC &amp; Acoustic Engineering</span>
          </div>
          <div className="corp-cap-divider d-none d-md-block" />
          <div className="corp-cap-item">
            <FaAward className="corp-cap-icon" />
            <span>Multinational Corporate Safety &amp; Quality Compliance</span>
          </div>
          <div className="corp-cap-divider d-none d-md-block" />
          <div className="corp-cap-item">
            <FaCheckCircle className="corp-cap-icon" />
            <span>Strict Handover Schedule • In-House Workshop</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
