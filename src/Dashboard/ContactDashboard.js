'use client';

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// const ContactDashboard = () => {
//   const [contacts, setContacts] = useState([]);
//   const [error, setError] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showShortlistedOnly, setShowShortlistedOnly] = useState(false);

//   const fetchContacts = async () => {
//     try {
//       const response = await axios.get(
//         "https://3pcommunicationsserver.vercel.app/api/contacts"
//       );
//       setContacts(response.data);
//     } catch (err) {
//       console.error("Error fetching contacts:", err);
//       setError(true);
//     }
//   };

//   const handleDelete = async (id) => {
//     // Show confirmation alert before deletion
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This will permanently delete the contact.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#007bff", // Green color for confirm button
//       cancelButtonColor: "#dc3545", // Red color for cancel button
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, keep it",
//     });

//     if (result.isConfirmed) {
//       try {
//         await axios.delete(
//           `https://3pcommunicationsserver.vercel.app/api/contacts/${id}`
//         );
//         fetchContacts(); // Refresh contacts after deletion
//         Swal.fire({
//           icon: "success",
//           title: "Deleted successfully!",
//           text: "The contact has been deleted.",
//           confirmButtonText: "OK",
//           confirmButtonColor: "#28a745", // Green color for confirm button
//         });
//       } catch (err) {
//         console.error("Error deleting contact:", err);
//         setError(true);
//         Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text: "There was an error deleting the contact.",
//         });
//       }
//     }
//   };

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleShortlistToggle = async (contact) => {
//     try {
//       const updatedContact = {
//         ...contact,
//         shortlisted: !contact.shortlisted, // Toggle shortlisted status
//       };

//       await axios.put(
//         `https://3pcommunicationsserver.vercel.app/api/contacts/${contact._id}/shortlisted`,
//         {
//           shortlisted: updatedContact.shortlisted,
//         }
//       );

//       fetchContacts(); // Refresh contacts to reflect changes
//     } catch (err) {
//       console.error("Error updating shortlisted status:", err);
//       setError(true);
//     }
//   };

//   const filteredContacts = contacts.filter(
//     (contact) =>
//       contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.message.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const renderContacts = () => {
//     const contactsToDisplay = showShortlistedOnly
//       ? filteredContacts.filter((contact) => contact.shortlisted)
//       : filteredContacts;

//     return contactsToDisplay.map((contact) => (
//       <tr key={contact._id}>
//         <td>{contact.name}</td>
//         <td>{contact.email}</td>
//         <td>{contact.phoneNumber}</td>
//         <td>{contact.message}</td>
//         <td>
//           {/* Bootstrap toggle switch */}
//           <div className="form-check form-switch">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id={`shortlistSwitch${contact._id}`}
//               checked={contact.shortlisted}
//               onChange={() => handleShortlistToggle(contact)}
//             />
//             <label
//               className="form-check-label"
//               htmlFor={`shortlistSwitch${contact._id}`}
//             >
//               {contact.shortlisted ? "Shortlisted" : "Not Shortlisted"}
//             </label>
//           </div>
//         </td>
//         <td>
//           <button
//             onClick={() => handleDelete(contact._id)}
//             className="btn btn-danger"
//           >
//             Delete
//           </button>
//         </td>
//       </tr>
//     ));
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   return (
//     <div className="container">
//       <h2 className="mt-4 text-center mb-4">Contact Messages</h2>

//       {error && (
//         <div className="alert alert-danger">Error loading contacts</div>
//       )}

//       <div className="row mb-4 align-items-center">
//         <div className="col-md-8">
//           <input
//             type="text"
//             className="form-control form-control-lg"
//             placeholder="Search by name, email, phone, or message..."
//             value={searchTerm}
//             onChange={handleSearch}
//             style={{ borderRadius: "0.375rem", border: "1px solid #ced4da" }} // For a more polished look
//           />
//         </div>
//         <div className="col-md-4 text-md-end text-center mt-3 mt-md-0">
//           <button
//             className={`btn btn-lg ${
//               showShortlistedOnly ? "btn-primary" : "btn-outline-secondary"
//             }`}
//             onClick={() => setShowShortlistedOnly(!showShortlistedOnly)}
//             style={{ width: "100%" }} // Makes the button full-width on smaller screens for a clean layout
//           >
//             {showShortlistedOnly
//               ? "Show All Contacts"
//               : "Show Shortlisted Only"}
//           </button>
//         </div>
//       </div>

//       <table className="table table-hover table-bordered align-middle">
//         <thead className="table-light">
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone Number</th>
//             <th>Message</th>
//             <th>Shortlist</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>{renderContacts()}</tbody>
//       </table>
//     </div>
//   );
// };

// export default ContactDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import "./Loader.css"; // Ensure you have the loader CSS file

const ContactDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [showShortlistedOnly, setShowShortlistedOnly] = useState(false);

  // Loader Component
  const Loader = () => (
    <div className="loader-container text-center mt-5">
      <div className="custom-loader"></div>
    </div>
  );

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        "https://3pcommunicationsserver.vercel.app/api/contacts"
      );
      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(true);
    } finally {
      setLoading(false); // Set loading to false when data is fetched
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the contact.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://3pcommunicationsserver.vercel.app/api/contacts/${id}`
        );
        fetchContacts();
        Swal.fire({
          icon: "success",
          title: "Deleted successfully!",
          text: "The contact has been deleted.",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",
        });
      } catch (err) {
        console.error("Error deleting contact:", err);
        setError(true);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error deleting the contact.",
        });
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShortlistToggle = async (contact) => {
    try {
      const updatedContact = {
        ...contact,
        shortlisted: !contact.shortlisted,
      };

      await axios.put(
        `https://3pcommunicationsserver.vercel.app/api/contacts/${contact._id}/shortlisted`,
        {
          shortlisted: updatedContact.shortlisted,
        }
      );

      fetchContacts();
    } catch (err) {
      console.error("Error updating shortlisted status:", err);
      setError(true);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContacts = () => {
    const contactsToDisplay = showShortlistedOnly
      ? filteredContacts.filter((contact) => contact.shortlisted)
      : filteredContacts;

    return contactsToDisplay.map((contact) => (
      <tr key={contact._id}>
        <td>{contact.name}</td>
        <td>{contact.email}</td>
        <td>{contact.phoneNumber}</td>
        <td>{contact.message}</td>
        <td>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id={`shortlistSwitch${contact._id}`}
              checked={contact.shortlisted}
              onChange={() => handleShortlistToggle(contact)}
            />
            <label
              className="form-check-label"
              htmlFor={`shortlistSwitch${contact._id}`}
            >
              {contact.shortlisted ? "Shortlisted" : "Not Shortlisted"}
            </label>
          </div>
        </td>
        <td>
          <button
            onClick={() => handleDelete(contact._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return <Loader />; // Show loader while loading
  }

  return (
    <div className="container card shadow-lg">
      <h2 className="mt-4 text-center mb-4">Contact Messages</h2>

      {error && <div className="alert alert-danger">Error loading contacts</div>}

      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control form-control"
            placeholder="Search by name, email, phone, or message..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ borderRadius: "0.375rem", border: "1px solid #ced4da", outline: "none", boxShadow: "none"}}
          />
        </div>
        <div className="col-md-4 text-md-end text-center mt-3 mt-md-0 ">
          <button
            className={`btn  ${
              showShortlistedOnly ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setShowShortlistedOnly(!showShortlistedOnly)}
            style={{ width: "100%", outline: "none", boxShadow: "none" }}
          >
            {showShortlistedOnly
              ? "Show All Contacts"
              : "Show Shortlisted Only"}
          </button>
        </div>
      </div>

      <table className="table table-hover table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Message</th>
            <th>Shortlist</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderContacts()}</tbody>
      </table>
    </div>
  );
};

export default ContactDashboard;

