'use client';

import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import '../custom.css';  // Ensure the correct path for your CSS

const DashboardMain = () => {
    const [projectData, setProjectData] = useState([]);
    const [categoryCount, setCategoryCount] = useState(0);
    const [contactCount, setContactCount] = useState(0);
    const [careerCount, setCareerCount] = useState(0);
    const [applicationCount, setApplicationCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [runningCount, setRunningCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state

    // Loader Component
    // const Loader = () => (
    //     <div className="loader-container text-center mt-5">
    //         <h3>Data Is Loading....</h3>
    //     </div>
    // );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectResponse = await axios.get('https://3pcommunicationsserver.vercel.app/api/projects');
                const projects = projectResponse.data;
                setProjectData(projects.projects);
                setPendingCount(projects.filter(p => p.status === 'Pending').length);
                setRunningCount(projects.filter(p => p.status === 'Running').length);
                setCompletedCount(projects.filter(p => p.status === 'Completed').length);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setLoading(false);
            }

            // Fetch counts for other entities
            const counts = [
                { endpoint: 'categories', setter: setCategoryCount },
                { endpoint: 'contacts', setter: setContactCount },
                { endpoint: 'careers', setter: setCareerCount },
                { endpoint: 'applications', setter: setApplicationCount },
            ];

            for (const { endpoint, setter } of counts) {
                try {
                    if(endpoint != 'careers'){
                        const response = await axios.get(`https://3pcommunicationsserver.vercel.app/api/${endpoint}`);
                        setter(response.data.length);
                        console.log(response.data);
                    }
                    else{
                        const response = await axios.get(`https://3pcommunicationsserver.vercel.app/api/${endpoint}`);
                        setter(response.data?.length);
                        console.log("career ",response.data?.length);
                    }
                   
                    
                } catch (error) {
                    console.error(`Error fetching ${endpoint}:`, error);
                }
            }

            // Fetch a random quote
            try {
                const quoteResponse = await axios.get('https://dummyjson.com/quotes/random');
                setQuote(quoteResponse.data);
            } catch (error) {
                console.error('Error fetching quote:', error);
            } finally {
                setLoading(false);  // Ensure loader hides after data is fetched
            }
        };

        fetchData();
    }, []);

    // // Show loader while data is being fetched
    // if (loading) {
    //     return <Loader />;
    // }

        // Custom Loader Component
        const Loader = () => (
            <div className="loader-container text-center mt-5">
                <div className="custom-loader"></div>
            </div>
        );
    
        if (loading) {
            return <Loader />;
        }
    

    return (
        <div className="dashboard-container">
            <h1 className="mt-4">Dashboard</h1>
            <div className="quote-section mb-4">
                <Card className="text-white bg-secondary">
                    <Card.Body>
                        {quote && (
                            <blockquote className="blockquote text-center">
                                <p className="mb-4">{quote.quote}</p>
                                <footer className="blockquote-footer text-light">— {quote.author}</footer>
                            </blockquote>
                        )}
                    </Card.Body>
                </Card>
            </div>
            <Row className="cards-row">
                {[ 
                    { title: "Total Projects", count: projectData.length },
                    { title: "Pending Projects", count: pendingCount },
                    { title: "Running Projects", count: runningCount },
                    { title: "Completed Projects", count: completedCount },
                    { title: "Total Categories", count: categoryCount },
                    { title: "Total Contacts", count: contactCount },
                    { title: "Total Careers", count: careerCount },
                    { title: "Total Applications", count: applicationCount },
                ].map((item, index) => (
                    <Col md={3} key={index}>
                        <Card className="mb-4 shadow-sm equal-card">
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>{item.count}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DashboardMain;
