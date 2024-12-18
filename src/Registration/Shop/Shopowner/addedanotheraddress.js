import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
// import '../../signup.css';

function AddAnotherAddress() {
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [streetNo, setStreetNo] = useState('');
  const [departmentNumber, setDepartmentNumber] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [id, setID] = useState('');

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

    console.log(userData);
    if (userData) {
      setID(userData || '');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    console.log("User Data:");
    console.log("Governorate:", governorate);
    console.log("City:", city);
    console.log("Town:", town);
    console.log("Street Number:", streetNo);
    console.log("Department Number:", departmentNumber);
    console.log("More Details:", moreDetails);
    console.log("ID:", id);

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
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const resetForm = () => {
    setGovernorate('');
    setStreetNo('');
    setCity('');
    setTown('');
    setDepartmentNumber('');
    setMoreDetails('');
    setSubmitted(false);
  };

  return (
    <div className="body">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <form className="formof" onSubmit={handleSubmit} style={{ padding: '20px' }}>
            <h1 className="h1">Enter Address</h1>
            <hr />
            <input className="input" type="text" placeholder="Governorate" value={governorate} onChange={(e) => setGovernorate(e.target.value)} required />
            <input className="input" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <input className="input" type="text" placeholder="Town" value={town} onChange={(e) => setTown(e.target.value)} required />
            <input className="input" type="text" placeholder="Street Number" value={streetNo} onChange={(e) => setStreetNo(e.target.value)} required />
            <input className="input" type="text" placeholder="Department Number" value={departmentNumber} onChange={(e) => setDepartmentNumber(e.target.value)} required />
            <input className="input" type="text" placeholder="More Details" value={moreDetails} onChange={(e) => setMoreDetails(e.target.value)} required />
            <div>
              <Link to="/shopowner"><button className="button" type="button">Back</button></Link>
              {!submitted && <button type="submit" className="button">Submit</button>}
            </div>
            <div>
              {submitted && (
                <div style={{ paddingTop: "20px" }}>
                  <p>Added successfully <Link onClick={resetForm} style={{ color: "red" }}>Add Another Address</Link> </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAnotherAddress;
