'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt,
  FaFolderOpen,
  FaPlusCircle,
  FaThList,
  FaEnvelopeOpenText,
  FaBriefcase,
  FaUserGraduate,
  FaBullhorn,
  FaComments,
  FaQuestionCircle,
  FaInfoCircle,
  FaAddressBook,
  FaShieldAlt,
  FaCogs,
  FaTimes,
  FaExternalLinkAlt,
  FaImages
} from 'react-icons/fa';

const navSections = [
  {
    title: 'Core',
    items: [
      { href: '/dashboard', label: 'Overview', icon: FaTachometerAlt, exact: true },
    ]
  },
  {
    title: 'Portfolio & Services',
    items: [
      { href: '/dashboard/projects', label: 'All Projects', icon: FaFolderOpen },
      { href: '/dashboard/addProject', label: 'New Project', icon: FaPlusCircle },
      { href: '/dashboard/categories', label: 'Categories', icon: FaThList },
    ]
  },
  {
    title: 'Inquiries & Recruitment',
    items: [
      { href: '/dashboard/contactDashboard', label: 'Client Leads', icon: FaEnvelopeOpenText },
      { href: '/dashboard/careers', label: 'Job Openings', icon: FaBriefcase },
      { href: '/dashboard/addCareer', label: 'Post Career', icon: FaPlusCircle },
      { href: '/dashboard/applications', label: 'Applications', icon: FaUserGraduate },
    ]
  },
  {
    title: 'Content & CMS',
    items: [
      { href: '/dashboard/hero-settings', label: 'Hero Banner', icon: FaImages },
      { href: '/dashboard/headlineDashboard', label: 'Headlines', icon: FaBullhorn },
      { href: '/dashboard/testimonialDashboard', label: 'Testimonials', icon: FaComments },
      { href: '/dashboard/faqDashboard', label: 'FAQs', icon: FaQuestionCircle },
      { href: '/dashboard/UpdateAboutDetails', label: 'About Info', icon: FaInfoCircle },
      { href: '/dashboard/UpdateContactDetails', label: 'Contact Info', icon: FaAddressBook },
      { href: '/dashboard/changePrivacyPolicy', label: 'Privacy Policy', icon: FaShieldAlt },
    ]
  },
  {
    title: 'System & Security',
    items: [
      { href: '/dashboard/settings', label: 'Admin Credentials', icon: FaCogs },
    ]
  }
];

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const isItemActive = (href, exact) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop d-lg-none" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center">
          <div className="sidebar-brand-box">
            <span className="brand-dot"></span>
            <div>
              <div className="brand-heading">3P PORTAL</div>
              <small className="brand-subheading">Administration</small>
            </div>
          </div>
          <button 
            className="sidebar-close-btn d-lg-none" 
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav-container">
          {navSections.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <div className="section-title">{section.title}</div>
              <ul className="section-list">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.href, item.exact);
                  return (
                    <li key={itemIdx} className="section-item">
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 992 && onClose) {
                            onClose();
                          }
                        }}
                        className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`}
                      >
                        <span className="link-icon-box">
                          <Icon className="link-icon" />
                        </span>
                        <span className="link-text">{item.label}</span>
                        {active && <span className="active-glow-bar" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status-card">
            <div className="status-indicator-live"></div>
            <div>
              <div className="status-title">System Live</div>
              <div className="status-sub">Vercel API Connected</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
