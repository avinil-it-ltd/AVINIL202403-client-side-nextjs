'use client';

import TopMenu from "../core/TopMenu";
import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // Import Outlet to render nested routes

const Dashboard = () => {
    return (
        <div className="pt-4">
            <div><TopMenu /></div>
            <div className="dashboard">
                <Sidebar />
                <div className="content">
                    <Outlet /> {/* This will render the child routes here */}
                </div>
            </div>
            
        </div>
    );
}

export default Dashboard;

