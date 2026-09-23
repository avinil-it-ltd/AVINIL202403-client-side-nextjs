'use client';

import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2"; // Import SweetAlert2

function ContactModal(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);

  const clickSubmit = async (event) => {
    event.preventDefault();

    // Form Validation
    if (!name || !email || !phoneNo || !interest) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      // Submit form data to backend
      const response = await axios.post("https://3pcommunicationsserver.vercel.app/api/contact", {
        name,
        email,
        phoneNumber: phoneNo,
        message: interest,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Thank you. Our team will contact you soon.",
          position: "center",
          showConfirmButton: true,
          confirmButtonColor: "#28a745",
        });

        // Reset form fields
        setName("");
        setEmail("");
        setPhoneNo("");
        setInterest("");
        props.onHide(); // Close the modal
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
        position: "center",
        showConfirmButton: true,
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactForm = () => (
    <div className="modal_design px-2 py-3  py-md-4">
      <div className="col-12 col-md-8 mx-auto" style={{ opacity: "0.9" }}>
        <form onSubmit={clickSubmit}>
          <div className="form-group mb-3">
            <label className="text-dark">Name:</label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              value={name}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label className="text-dark">Email:</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              value={email}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label className="text-dark">Phone No:</label>
            <input
              onChange={(e) => setPhoneNo(e.target.value)}
              type="text"
              className="form-control"
              value={phoneNo}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label className="text-dark">Message:</label>
            <textarea
              rows="4"
              onChange={(e) => setInterest(e.target.value)}
              className="form-control"
              value={interest}
              required
            />
          </div>

          <Button style={{ outline: "none", boxShadow: "none" }} type="submit" className="mt-3 outline-0 text-white col-12 btn dashboard_all_button" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Contact Us</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        {contactForm()}
      </Modal.Body>
    </Modal>
  );
}

export default ContactModal;


// import React, { useState, useEffect } from "react";
// import emailjs from '@emailjs/browser';
// import { Modal, Button } from "react-bootstrap"


// function ContactModal(props) {

//   const theme = '#191919'
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [phoneNo, setPhoneNo] = useState("")
//   const [interest, setInterest] = useState("")
//   const [success, setSuccess] = useState(false)

//   var templateParams = {
//     name: name,
//     email: email,
//     phoneNo: phoneNo,
//     message: interest
//   };

//   const clickSubmit = (event) => {
//     event.preventDefault();
//     emailjs.send('service_lbmx95i', 'template_5nhl4y6', templateParams, 'dfTY7TgQqsuNivbMT')
//       .then(function (response) {
//         console.log('SUCCESS!', response.status, response.text);
//       }, function (error) {
//         console.log('FAILED...', error);
//       });

//     setSuccess(true)
//     setName("");
//     setEmail("");
//     setPhoneNo("");
//     setInterest("");
//   }


//   const showSuccess = () => (
//     <div className="alert alert-warning text-dark" style={{ display: success ? "" : "none" }}>
//       Thank You. Soon our team will contact you.
//     </div>
//   )


//   const contactForm = () => (
//     <div className="modal_design py-3" >
//       <div >
//         <div className="col-6 col-md-9 mx-auto" style={{ opacity: "0.9" }}>
//           <div className="row">
//             <div className="">
//               <p className="h2 text-danger text-center" style={{ fontFamily: "'Aref Ruqaa', serif" }}>Contact Us</p>
//               {showSuccess()}
//               <form >
//                 <div className="form-group mb-2">
//                   <label className="text-danger">Name:</label>
//                   <input onChange={(e) => { setName(e.target.value) }} type="text" className="form-control col-6" value={name} required></input>
//                 </div>
//                 <div className="form-group mb-2">
//                   <label className="text-danger">Email:</label>
//                   <input onChange={(e) => { setEmail(e.target.value) }} type="text" className="form-control col-6" value={email} required></input>
//                 </div>
//                 <div className="form-group mb-2">
//                   <label className="text-danger">Phone No:</label>
//                   <input onChange={(e) => { setPhoneNo(e.target.value) }} type="text" className="form-control col-6" value={phoneNo} required></input>
//                 </div>
//                 <div className="form-group mb-2">
//                   <label className="text-danger">Message:</label>
//                   <textarea rows="4" onChange={(e) => { setInterest(e.target.value) }} type="text" className="form-control col-6" value={interest} required></textarea>
//                 </div>

//                 <button onClick={clickSubmit} type="submit" className="mt-3 col-12 btn special_button btn-lg btn-block ">Submit</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <Modal
//       {...props}
//       className="modal_size"
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//       </Modal.Header>
//       <Modal.Body>
//         <div>{contactForm()}</div>
//       </Modal.Body>
//     </Modal>

//   );
// }

// export default ContactModal
