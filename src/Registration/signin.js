import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './signup.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdHome } from "react-icons/io";

function Signin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    try {
      const response = await axios.post(`http://172.19.44.242:8080/user/getUserByEmail`, {
        userNameOrEmail: email,
        password: password
      });
      setStatus(response.data); 
      console.log(response.data);
      if (response.status === 200) {
        if (response.data.status === 1) {
          Cookies.set('userid', response.data.userid, { expires: 7, path: '/' });
          Cookies.set('shopname', response.data.shopOwner.shopName, { expires: 7, path: '/' });
          Cookies.set('password', password, { expires: 7, path: '/' });
          window.location.href = `/shopowner?data=${encodeURIComponent(JSON.stringify(response.data))}`;
        } else {
          console.log(response.data);
          Cookies.set('userid', response.data.userid, { expires: 7, path: '/' });
          Cookies.set('customer', response.data.userName, { expires: 7, path: '/' });
          Cookies.set('password', password, { expires: 7, path: '/' });
          window.location.href = `/homepagecustomer?data=${encodeURIComponent(JSON.stringify(response.data))}`;
        }
      } else {
        toast.error('Invalid email or password.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setStatus('Error');
      toast.error('An error occurred while signing in.');
    }
    setEmail(''); 
    setPassword('');
  }

  return (
    <body className="body">
      <Link to="/homepage" className="form-link home-link">
      <IoMdHome style={{ fontSize: "60px", marginBottom: "30px", color:"#FF4B2B"  }} />
    </Link>
      <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
        <div className="form-container sign-up-container">
          <form className="formof" action="#">
            <h1 className="h1">Create Account</h1>
            <hr></hr>
            <Link to="/signupshop">
              <button className="button" id="b1">Shop Owner</button>
            </Link>          
            <Link to="/signupcustomer"> 
              <button className="button" id="b1">Customer</button>
            </Link>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form className="formof" onSubmit={handleSignIn}>
            <h1 className="h1" style={{fontSize:"30px"}}>Sign in</h1>
            <hr></hr>
            <input className="input" style={{borderRadius:"20px" }} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" style={{borderRadius:"20px" }} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="buttonsign" type="submit" style={{borderRadius:"20px",margin:"10px"}}>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
        {status && (
          <div className="status">
            {/* {status === 'Error' ? 'Error occurred while signing in' : `Status: ${status}`} */}
          </div>
        )}
        <ToastContainer />
      </div>
    </body>
  );
};

export default Signin;
