import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import '../signup.css';
import axios from "axios";

function Addresscustomer() {
  const [FName, setFName] = useState('');
  const [LName, setLName] = useState('');
  const [cartid, setCartId] = useState('');
  const [BDate, setBDate] = useState('');
  const [userName, setUserName] = useState('');
  const [PHONE, setPHONE] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [submitted, setSubmitted] = useState(false); 
  const[deteles,setDetels]=useState('');
  

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

    if (userData) {
      setFName(userData.fname || '');
      setLName(userData.lname || '');
      setCartId(userData.cartid || '');
      setBDate(userData.bdate || '');
      setUserName(userData.userName || '');
      setPHONE(userData.userPNum || '');
      setEmail(userData.userEmail || '');
      setPassword(userData.userPass || '');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Set submitted to true when form is submitted
  
    console.log("User Data:");
    console.log("First Name:", FName);
    console.log("Last Name:", LName);
    console.log("Cart ID:", cartid);
    console.log("Birth Date:", BDate);
    console.log("Username:", userName);
    console.log("Phone Number:", PHONE);
    console.log("Email:", email);
    console.log("Street:", street);
    console.log("City:", city);
    console.log("State:", state);
    console.log("Postal Code:", postalCode);
    console.log("Country:", country);
    console.log(password);


    try {
      const response = await axios.post('http://172.19.44.242:8080/user/getUserByEmail', {
  
          userNameOrEmail: email,
          password: password
        
      });
      const id=response.data.userid;


      try{

        const response1=await axios.post(`http://172.19.44.242:8080/user/addNewAddress/${id}`,{
        governorate:state ,
  city: city,
  town: country,
  streetNo: street,
  depNo: postalCode,
  moreDetails: deteles
        })

        console.log("consle 2 " + response1.status);
        setSubmitted(true);

        setCountry('');
        setCity('');
        setStreet('');
        setPostalCode('');
        setDetels('');
        setState('');

      }catch(error){
        console.log("error " + error);
      }

    } catch (error) {
      console.error('Error fetching user:', error);
    }
     
      
  
   
  };
 

  return (
    <div className="body">
      <div className="container">
        <form onSubmit={handleSubmit} className="formof" style={{padding: '20px'}}>
          <div></div>
          <h1 className="h1">Enter Address</h1>
          <hr />
          <input className="input" type="text" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} required />
          <input className="input" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
          <input className="input" type="text" placeholder="governorate" value={state} onChange={(e) => setState(e.target.value)} required />
          <input className="input" type="text" placeholder="department name " value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
          <input className="input" type="text" placeholder="town" value={country} onChange={(e) => setCountry(e.target.value)} required />
          <input className="input" type="text" placeholder="more Details" value={deteles} onChange={(e) => setDetels(e.target.value)} required />
          


          <div>
            <Link to="/signupcustomer"><button className="buttonNextBack">Back</button></Link>
            {<button type="submit" className="buttonNextBack">Submit</button>}
          </div>
          <div>
            {
                submitted&&
                (
                    <p> Address is added  <strong><Link  style={{color:"red"}}  to="/signin">Sign in</Link> </strong> </p>
            
                )
              
            } 
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default Addresscustomer;
