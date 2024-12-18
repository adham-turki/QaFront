import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

function UpdateAddress() {
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [streetNo, setStreetCOde] = useState('');
  const [departmentNumber, setDepartmentNumber] = useState('');
  const [moreDetails, setMoreDetals] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [id, setID] = useState('');
  const [addressid, setAddressId] = useState('');

  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const idFromCookies = Cookies.get('userid');
    console.log("user id from cookies " + idFromCookies);
    const searchParams = new URLSearchParams(location.search);
    const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

    if (userData) {
      setID(userData.userid || '');
      setGovernorate(userData.governorate || '');
      setCity(userData.city || '');
      setDepartmentNumber(userData.departmentNumber || '');
      setStreetCOde(userData.streetNo || '');
      setID(userData.userid || '');
      setTown(userData.town || '');
      setMoreDetals(userData.moreInformation || '');
      setAddressId(userData.addID || '');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Set submitted to true when form is submitted

    console.log("User Data:");
    console.log("Street:", governorate);
    console.log("City:", city);
    console.log("State:", town);
    console.log("Postal Code:", streetNo);
    console.log("Country:", departmentNumber);
    console.log("id is " + id);

    try {
      console.log("user id " + id);
      console.log("address id " + addressid);
      const response = await axios.patch(`http://172.19.44.242:8080/user/updateAddress/${id}/${addressid}`, {
        governorate: governorate,
        city: city,
        town: town,
        streetNo: streetNo,
        depNo: departmentNumber,
        moreDetails: moreDetails
      });

      console.log("status: " + response.status);

      // Show success alert
      toast.success("Address updated successfully!");

      // Redirect to the address page
      navigate('/shopowner');

    } catch (error) {
      console.log("error " + error);

      // Show error alert
      toast.error("Error updating address. Please try again.");
    }
  };

  const addanotherAddress = () => {
    setGovernorate('');
    setStreetCOde('');
    setCity('');
    setDepartmentNumber('');
    setMoreDetals('');
    setSubmitted(false);
  };

  return (
    <div className="body">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <form className="formof" onSubmit={handleSubmit} style={{ padding: '20px' }}>
            <h1 className="h1">Update</h1>
            <hr />
            <input className="input" type="text" placeholder="Governorate" value={governorate} onChange={(e) => setGovernorate(e.target.value)} required />
            <input className="input" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <input className="input" type="text" placeholder="Town" value={town} onChange={(e) => setTown(e.target.value)} required />
            <input className="input" type="text" placeholder="Street Number" value={streetNo} onChange={(e) => setStreetCOde(e.target.value)} required />
            <input className="input" type="text" placeholder="Department Number" value={departmentNumber} onChange={(e) => setDepartmentNumber(e.target.value)} required />
            <input className="input" type="text" placeholder="More Details" value={moreDetails} onChange={(e) => setMoreDetals(e.target.value)} required />
            <div>
              <button className="button" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
      {/* ToastContainer for displaying toasts */}
      <ToastContainer />
    </div>
  );
}

export default UpdateAddress;
