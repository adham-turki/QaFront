import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import '../Shop/signupsho.css';

function Signupcustomer() {
  const [userName, setUserName] = useState('');
  const [userPNum, setUserPNum] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userAddID, setUserAddID] = useState('');
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [bdate, setBDate] = useState('');
  

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!userName || !userPNum || !userEmail || !userPass || !userAddID || !fname || !lname || !bdate) {
      alert("Please fill in all fields.");
      return;
    }

    const userData = {
      userName,
      userPNum,
      userEmail,
      userPass,
      userAddID,
      status: 0,
        fname,
        lname,
        bdate
      
    };

    try {
      const response = await axios.post('http://172.19.44.242:8080/user/addnewuser', {
        userName: userName,
  userPNum: userPNum,
  userEmail: userEmail,
  userPass: userPass,
  userAddID: userAddID,
  status: 0,
  customer: {
    fname: fname,
    lname: lname,
    bdate:bdate
  }
      });
      console.log(response.status);
    window.location.href = `/verfiy?data=${encodeURIComponent(JSON.stringify(userData))}`;



      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="body">
  <div className="container">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <form className="formof" onSubmit={handleSignUp} style={{ padding: '20px' }}>
          <h1 className="h1">Create Account</h1>
<input className="input" type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
<input className="input"  type="tel" placeholder="Phone Number" value={userPNum} onChange={(e) => setUserPNum(e.target.value)} />
<input  className="input"  type="email" placeholder="Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
<input  className="input"  type="password" placeholder="Password" value={userPass} onChange={(e) => setUserPass(e.target.value)} />
<input className="input"  type="text" placeholder="Address ID" value={userAddID} onChange={(e) => setUserAddID(e.target.value)} />
<input className="input"  type="text" placeholder="First Name" value={fname} onChange={(e) => setFName(e.target.value)} />
<input className="input"  type="text" placeholder="Last Name" value={lname} onChange={(e) => setLName(e.target.value)} />
<input className="input"  type="text" placeholder="Birth Date " value={bdate} onChange={(e) => setBDate(e.target.value)} />

          <hr />
          <div>
            <Link to="/signin"><button className="buttonNextBack" type="button">Back</button></Link>
            <button className="buttonNextBack" type="submit" style={{ paddingTop: '10px', top: '20px' }}>Next</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  
  );
};

export default Signupcustomer;
