import axios from "axios";
import React, { useState } from "react";
import './signupsho.css';
import { Link } from "react-router-dom";

function Signupshop() {
  const [shopName, setShopName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmpassword] = useState('');


  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!shopName || !phoneNumber || !email || !username || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password != confirmPassword) {
      alert("mismatch in password ");
      return;
    }
    const userData = {
      shopName,
      phoneNumber,
      email,
      username,
      password
    };

    try {
      const response = await axios.post('http://172.19.44.242:8080/user/addnewuser', {
        userName: username,
        userPNum: phoneNumber,
        userEmail: email,
        userPass: password,
        userAddID: "",
        status: 1,
        shopowner: {
          shopName: shopName
        }
      });

      console.log(response.status);


    } catch (error) {
      console.log("error " + error);
    }


    window.location.href = `/verfiycation?data=${encodeURIComponent(JSON.stringify(userData))}`;
  }

  return (
    <div className="body">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <form className="formof" onSubmit={handleSignUp} style={{ padding: '20px' }}>
            <h1 className="h1">Create Account</h1>
            <hr />
            <input className="input" type="text" placeholder="Shop Name" value={shopName} onChange={(e) => setShopName(e.target.value)} />
            <input className="input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="input" type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Password" min={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="input" type="password" placeholder="confirm password" min={8} value={confirmPassword} onChange={(e) => setConfirmpassword(e.target.value)} />

            <div>
              <Link to="/signin">< button className="buttonNextBack" type="submit">Back</button></Link>

              <button className="buttonNextBack" type="submit" style={{ paddingTop: '10px', top: '20px' }}>Next</button>
            </div>




          </form>
        </div>
      </div>
    </div>

  );
};

export default Signupshop;
