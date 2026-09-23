'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopMenu from '../../core/TopMenu';
import Footer from '../../core/Footer';

const PrivacyPolicy = () => {
    const [policies, setPolicies] = useState([]); // State to hold policies
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch policies from the backend
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/policies'); // Replace with your backend API
                setPolicies(response.data); // Adjusted to set the data directly as an array
            } catch (error) {
                console.error('Error fetching policies:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchPolicies();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Simple loading state
    }

    return (
        <div>
            <div className='privacy_design width-100 height-full'>
                <TopMenu />
                <div className='w-75 mx-auto py-5'>
                    <h2 className='mb-4'>Our Privacy Policies</h2>
                    <ol className='orderlist'>
                        {policies.map((policy) => (
                            <li key={policy._id}>
                                <strong>{policy.title}</strong>: 
                                <span dangerouslySetInnerHTML={{ __html: policy.content }} /> {/* Render HTML content */}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
