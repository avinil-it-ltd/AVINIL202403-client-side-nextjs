'use client';

import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    FaClipboardList,
    FaTachometerAlt,
    FaImage,
    FaUserEdit,
    FaPlusCircle,
    FaListAlt,
    FaBriefcase,
    FaQuestionCircle
} from 'react-icons/fa';

import './css/dashboard.css';

const Sidebar = () => {
    const location = useLocation();

    // Helper function to apply active style if the link is the current path
    const isActive = (path) => location.pathname === path;

    return (
        <div className="d-flex flex-column sidebar">
            <Nav className="flex-column p-3">
                <h5 className="mt-4">Dashboard</h5>
                <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={`mb-2 ${isActive('/dashboard') ? 'active-link' : ''}`}
                >
                    <FaTachometerAlt /> Overall Dashboard
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/categories"
                    className={`mb-2 ${isActive('/dashboard/categories') ? 'active-link' : ''}`}
                >
                    <FaPlusCircle /> Services Categories
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/projects"
                    className={`mb-2 ${isActive('/dashboard/projects') ? 'active-link' : ''}`}
                >
                    <FaListAlt /> View All Projects
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/contactDashboard"
                    className={`mb-2 ${isActive('/dashboard/contactDashboard') ? 'active-link' : ''}`}
                >
                    <FaBriefcase /> View Contact Leads
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/careers"
                    className={`mb-2 ${isActive('/dashboard/careers') ? 'active-link' : ''}`}
                >
                    <FaBriefcase /> View Careers
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/applications"
                    className={`mb-2 ${isActive('/dashboard/applications') ? 'active-link' : ''}`}
                >
                    <FaClipboardList /> View Applications
                </Nav.Link>

                <h5 className="mt-4">Update Management</h5>
                <Nav.Link
                    as={Link}
                    to="/dashboard/changePrivacyPolicy"
                    className={`mb-2 ${isActive('/dashboard/changePrivacyPolicy') ? 'active-link' : ''}`}
                >
                    <FaClipboardList /> Change Privacy Policy
                </Nav.Link>

                <Nav.Link
                    as={Link}
                    to="/dashboard/UpdateAboutDetails"
                    className={`mb-2 ${isActive('/dashboard/UpdateAboutDetails') ? 'active-link' : ''}`}
                >
                    <FaUserEdit /> Change About Details
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/UpdateContactDetails"
                    className={`mb-2 ${isActive('/dashboard/UpdateContactDetails') ? 'active-link' : ''}`}
                >
                    <FaBriefcase /> Change Contact Details
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/faqDashboard"
                    className={`mb-2 ${isActive('/dashboard/faqDashboard') ? 'active-link' : ''}`}
                >
                    <FaQuestionCircle /> Manage FAQs
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/testimonialDashboard"
                    className={`mb-2 ${isActive('/dashboard/testimonialDashboard') ? 'active-link' : ''}`}
                >
                    <FaClipboardList /> Manage Testimonials
                </Nav.Link>

                <h5 className="mt-4">Settings</h5>
                <Nav.Link
                    as={Link}
                    to="/dashboard/headlineDashboard"  // Link to the Headline Management page
                    className={`mb-2 ${isActive('/dashboard/headlineDashboard') ? 'active-link' : ''}`}
                >
                    <FaClipboardList /> Manage Headlines
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/dashboard/settings" // Link to the combined settings page
                    className={`mb-2 ${isActive('/dashboard/settings') ? 'active-link' : ''}`}
                >
                    <FaUserEdit /> Manage Credentials
                </Nav.Link>

            </Nav>
        </div>
    );
};

export default Sidebar;
