import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import './Shopowner/sweet.css'; // Adjust the path as necessary

function Addresspage() {
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [streetNo, setStreetCOde] = useState('');
  const [departmentNumber, setDepartmentNumber] = useState('');
  const [moreDetails, setMoreDetals] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [id, setID] = useState('');
  const location = useLocation();
  const swalRef = useRef();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

    if (userData) {
      setID(userData || '');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    console.log("User Data:");
    console.log("Street:", governorate);
    console.log("City:", city);
    console.log("State:", town);
    console.log("Postal Code:", streetNo);
    console.log("Country:", departmentNumber);
    console.log("id is " + id);

    try {
      const response = await axios.post(`http://172.19.44.242:8080/user/addNewAddress/${id}`, {
        governorate: governorate,
        city: city,
        town: town,
        streetNo: streetNo,
        depNo: departmentNumber,
        moreDetails: moreDetails
      });

      console.log(response.status);

      // Display success message using SweetAlert2
      swalRef.current = Swal.fire({
        icon: 'success',
        title: 'Added successfully',
        html: '<a href="#" id="addAnother">Add Another Address</a> <strong>Or</strong> <a href="/signin">Sign In</a>',
        showConfirmButton: false,
        allowOutsideClick: true,
        didOpen: () => {
          document.getElementById('addAnother').addEventListener('click', addanotherAddress);
        },
        customClass: {
          container: 'my-swal-container',
          popup: 'my-swal-popup',
          header: 'my-swal-header',
          title: 'my-swal-title',
          closeButton: 'my-swal-close-button',
          icon: 'my-swal-icon',
          image: 'my-swal-image',
          content: 'my-swal-content',
          input: 'my-swal-input',
          actions: 'my-swal-actions',
          confirmButton: 'my-swal-confirm-button',
          cancelButton: 'my-swal-cancel-button',
          footer: 'my-swal-footer'
        }
      });

    } catch (error) {
      console.log("error " + error);
    }
  };

  const addanotherAddress = () => {
    setGovernorate('');
    setStreetCOde('');
    setCity('');
    setDepartmentNumber('');
    setMoreDetals('');
    setSubmitted(false);
    Swal.close();
  }

  return (
    <div className="body">
      <div className="container">
        <form className="formof" onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <h1 className="h1">Enter Address</h1>
          <hr />
          <input className="input" type="text" placeholder="governorate" value={governorate} onChange={(e) => setGovernorate(e.target.value)} required />
          <input className="input" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
          <input className="input" type="text" placeholder="town" value={town} onChange={(e) => setTown(e.target.value)} required />
          <input className="input" type="text" placeholder="Street number" value={streetNo} onChange={(e) => setStreetCOde(e.target.value)} required />
          <input className="input" type="number" placeholder="departrment number" value={departmentNumber} onChange={(e) => setDepartmentNumber(e.target.value)} required />
          <input className="input" type="text" placeholder="More Details" value={moreDetails} onChange={(e) => setMoreDetals(e.target.value)} required />
          <div>
            <Link to="/signupshop"><button className="buttonNextBack">Back</button></Link>
            {!submitted && <button type="submit" className="buttonNextBack">Submit</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Addresspage;
