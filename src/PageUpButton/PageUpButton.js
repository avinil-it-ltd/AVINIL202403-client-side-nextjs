'use client';
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import "./pageUpButton.css";

const PageUpButton = () => {
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!showScroll) return null;

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className="scroll-top-btn position-fixed"
            style={{
                bottom: '30px',
                right: '30px',
                backgroundColor: '#191919',
                border: '1px solid #e7e3da',
                color: '#ffffff',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1050,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                transition: 'all 0.3s ease'
            }}
            aria-label="Scroll to top"
            title="Scroll to Top"
        >
            <FaArrowUp />
        </button>
    );
};

export default PageUpButton;