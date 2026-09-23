'use client';

// //src\pages\Home\Banner\Banner.js
// import React from 'react'; // Import React
// import './Banner.css'; // Import your CSS
// import { Link } from 'react-router-dom';
// import Marquee from 'react-fast-marquee';

// function Banner() {

//     const notices = [
//         "আমাদের ওয়েবসাইট মেনটেনেন্স এর কাজ চলছে সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত",
//         "নতুন আপডেট আসছে শীঘ্রই, দয়া করে নজর রাখুন!",
//         "বিশেষ অফার: সীমিত সময়ের জন্য আমাদের বিশেষ অফারটি উপভোগ করুন!"
//     ];




//     // Use &nbsp; for extra spaces between notices
//     const separator = "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  "; // Adjust the number of spaces here
//     const scrollingNotices = notices.join(separator);


//     return (
//         <>




//             <Marquee
//                 gradient="true"
//                 gradientWidth="0"
//                 className='mt-5 pb-3 bg-neutral font-bold text-xl text-dark'
//                 speed="40"
//             >
//                 {/* Use dangerouslySetInnerHTML to handle HTML (like &nbsp;) */}
//                 <span dangerouslySetInnerHTML={{ __html: scrollingNotices }} />
//             </Marquee>


//             {/* Banner Section */}
//             <div className='banner_section'>
//                 <div className='banner_content'>
//                     <h1>Transform Your Space With <span>3P Communication</span></h1>
//                     <p>Innovative designs for a modern lifestyle</p>
//                     <Link to="/interior"><button className='cta_button'>Explore Now</button></Link>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Banner;





// import React, { useEffect, useState } from 'react'; 
// import './Banner.css'; 
// import { Link } from 'react-router-dom';

// import axios from 'axios';

// function Banner() {
//     const [notices, setNotices] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchNotices();
//     }, []);

//     const fetchNotices = async () => {
//         try {
//             const response = await axios.get('https://3pcommunicationsserver.vercel.app/api/headlines/active');
//             setNotices(response.data);
//         } catch (error) {
//             console.error('Error fetching notices:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     // If there are no notices, skip the Marquee section
//     if (notices.length === 0) {
//         return (
//             <div className='banner_section'>
//                 <div className='banner_content'>
//                     <h1>Transform Your Space With <span>3P Communication</span></h1>
//                     <p>Innovative designs for a modern lifestyle</p>
//                     <Link to="/interior"><button className='cta_button'>Explore Now</button></Link>
//                 </div>
//             </div>
//         );
//     }

//     const separator = "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ";
//     const scrollingNotices = notices.map(notice => notice.content).join(separator);

//     return (
//         <>
           

//             <div className='banner_section'>
//                 <div className='banner_content'>
//                     <h1>Transform Your Space With <span>3P Communication</span></h1>
//                     <p>Innovative designs for a modern lifestyle</p>
//                     <Link to="/interior"><button className='cta_button'>Explore Now</button></Link>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Banner;



import React, { useEffect, useState } from 'react'; 
import './Banner.css'; 
import { Link } from 'react-router-dom';

import { Typewriter } from 'react-simple-typewriter'; // Import the Typewriter component

function Banner() {
    

    // If there are no notices, skip the Marquee section
    
    //     return (
    //         <div className='banner_section'>
    //             <div className='banner_content'>
    //                 <h1>
    //                     Transform Your Space With{' '}
    //                     <span>
    //                         {/* Use the Typewriter effect for "3P Communication" */}
    //                         <Typewriter
    //                             words={['3P Communication']}
    //                             loop={false}
    //                             cursor
    //                             cursorStyle='|'
    //                             typeSpeed={70}
    //                             deleteSpeed={50}
    //                             delaySpeed={1000}
    //                         />
    //                     </span>
    //                 </h1>
    //                 <p>Innovative designs for a modern lifestyle</p>
    //                 <Link to="/interior"><button className='cta_button'>Explore Now</button></Link>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <>
  
            <div className='banner_section'>
                <div className='banner_content'>
                    <h1>
                        Transform Your 
                        <span className='banner-text-1'> 
                            <Typewriter
                                words={[' Space',' Home',' Office',' Events']}
                                loop={false}
                                cursor
                                cursorStyle='|'
                                typeSpeed={70}
                                deleteSpeed={50}
                                delaySpeed={1000}
                            />
                            </span> {' '}
                         With <br /> {' '}
                        <span className='banner_text'>
                        3P Communication
                        </span>
                    </h1>
                    <p>Innovative designs for a modern lifestyle</p>
                    <Link to="/interior"><button className='cta_button'>Explore Now</button></Link>
                </div>
            </div>
        </>
    );
}

export default Banner;
