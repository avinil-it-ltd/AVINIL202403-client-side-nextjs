'use client';

// src/components/MarqueeComponent.js
import Marquee from 'react-fast-marquee';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Headline.css';

const Headline = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/headlines/active');
            setNotices(response.data);
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };
    const separator = "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ";
    const scrollingNotices = notices.map(notice => notice.content).join(separator);

    return (
        <div className='headline'>
            <Marquee
                gradient="true"
                gradientWidth="0"
                className='mt-2 mb-2 bg-neutral font-bold text-xl fw-bold'
                speed="40"
            >
                <span dangerouslySetInnerHTML={{ __html: scrollingNotices }} />
            </Marquee>
        </div>
    );
};

export default Headline;
