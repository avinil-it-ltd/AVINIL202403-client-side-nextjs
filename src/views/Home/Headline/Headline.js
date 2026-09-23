'use client';

import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import axios from 'axios';
import { FaBullhorn } from 'react-icons/fa';
import './Headline.css';

const defaultNotices = [
  {
    _id: 'default-1',
    type: 'offer',
    title: '',
    content: 'দেশ সেরা Interior, Exterior & Event Management Solution পাচ্ছেন 3p Communication এ'
  },
  {
    _id: 'default-2',
    type: 'update',
    title: 'Consultation',
    content: 'Transform Your Space With 3P Communication — Innovative designs for modern lifestyle'
  }
];

const Headline = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/headlines/active');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setNotices(response.data);
      } else {
        setNotices(defaultNotices);
      }
    } catch (error) {
      console.warn('Using default notices due to API latency/error:', error.message);
      setNotices(defaultNotices);
    } finally {
      setLoading(false);
    }
  };

  const displayNotices = notices.length > 0 ? notices : defaultNotices;

  return (
    <div className="headline-broadcast-bar">
      <div className="headline-badge-container">
        <div className="headline-badge">
          <span className="live-pulse-dot" aria-hidden="true"></span>
          <FaBullhorn className="headline-badge-icon" />
          <span className="headline-badge-text">UPDATES</span>
        </div>
      </div>

      <div className="headline-marquee-track">
        <Marquee
          speed={42}
          pauseOnHover={true}
          gradient={true}
          gradientColor="#141518"
          gradientWidth={50}
          className="headline-marquee"
        >
          {displayNotices.map((notice, index) => {
            const tagType = (notice.type || 'update').toLowerCase();
            const tagLabel = (notice.type || 'update').toUpperCase();
            const hasTitle = notice.title && notice.title !== 'General Notice';

            return (
              <div key={notice._id || index} className="headline-item">
                <span className={`headline-type-tag tag-${tagType}`}>
                  {tagLabel}
                </span>
                {hasTitle && (
                  <span className="headline-item-title">{notice.title}:</span>
                )}
                <span
                  className="headline-item-text"
                  dangerouslySetInnerHTML={{ __html: notice.content }}
                />
                <span className="headline-item-separator" aria-hidden="true">✦</span>
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
};

export default Headline;
