'use client';

import React, { useState } from 'react';

const ChangeImage = () => {
    // State to handle selected page
    const [selectedPage, setSelectedPage] = useState('interior');

    // States for handling images
    const [topImage, setTopImage] = useState(null);
    const [projectImages, setProjectImages] = useState([]);
    
    // Dummy data to represent previously uploaded images for different pages
    const [previousImages, setPreviousImages] = useState({
        interior: [
            { id: 1, url: 'path/to/interior1.jpg' },
            { id: 2, url: 'path/to/interior2.jpg' }
        ],
        exterior: [
            { id: 3, url: 'path/to/exterior1.jpg' },
            { id: 4, url: 'path/to/exterior2.jpg' }
        ],
        event: [
            { id: 5, url: 'path/to/event1.jpg' },
            { id: 6, url: 'path/to/event2.jpg' }
        ]
    });

    // Handlers for file changes
    const handleTopImageChange = (e) => {
        setTopImage(e.target.files[0]);
    };

    const handleProjectImagesChange = (e) => {
        setProjectImages([...e.target.files]);
    };

    const handleDeleteImage = (id) => {
        setPreviousImages((prev) => {
            const updatedImages = { ...prev };
            updatedImages[selectedPage] = updatedImages[selectedPage].filter(image => image.id !== id);
            return updatedImages;
        });
        // Handle server-side deletion here
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // FormData to send images
        const formData = new FormData();
        if (topImage) {
            formData.append('topImage', topImage);
        }
        projectImages.forEach((file) => formData.append('projectImages', file));

        // Simulate sending data to a server
        console.log(`Uploading images for ${selectedPage}...`, formData);

        // Example: Use fetch or axios to send formData to your backend
        // const response = await fetch(`/api/update-images/${selectedPage}`, {
        //     method: 'POST',
        //     body: formData,
        // });
        
        // const data = await response.json();
        // console.log('Server response:', data);
    };

    return (
        <div className="change-image">
            <h2>Update Images</h2>
            
            {/* Page selection */}
            <div className="form-group">
                <label htmlFor="pageSelect" className="form-label">Select Page</label>
                <select
                    id="pageSelect"
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="form-control"
                >
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="event">Event</option>
                </select>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topImage" className="form-label">Top Section Image</label>
                    <input
                        type="file"
                        id="topImage"
                        accept="image/*"
                        onChange={handleTopImageChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="projectImages" className="form-label">Add New Project Images</label>
                    <input
                        type="file"
                        id="projectImages"
                        accept="image/*"
                        multiple
                        onChange={handleProjectImagesChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-primary">Upload Images</button>
            </form>

            <div className="previous-images">
                <h3>Previously Uploaded Images for {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}</h3>
                <div className="image-gallery">
                    {previousImages[selectedPage].map((image) => (
                        <div key={image.id} className="image-item">
                            <img src={image.url} alt={`${selectedPage} project`} />
                            <button 
                                className="btn btn-danger"
                                onClick={() => handleDeleteImage(image.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChangeImage;

