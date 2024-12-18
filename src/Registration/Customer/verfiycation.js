import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './verfiy.css'; // Import the corrected styles.css file
import axios from 'axios';
function EmailVerification() {




    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [bdate, setBDate] = useState('');
    const [userName, setUserName] = useState('');
    const [userPNum, setPHONE] = useState('');
    const [userEmail, setEmail] = useState('');
    const [userPass, setPassword] = useState('');
    const [userAddID, setUserAddID] = useState('');
    const [isTrueVerfiy, setIsTrueVerfy] = useState(false);
    const [submitted, setSubmitted] = useState(false);




    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

        if (userData) {
            setFName(userData.fname || '');
            setLName(userData.lname || '');
            setBDate(userData.bdate || '');
            setUserName(userData.userName || '');
            setPHONE(userData.userPNum || '');
            setEmail(userData.userEmail || '');
            setPassword(userData.userPass || '');
            setUserAddID(userData.userAddID || '');
        }
    }, [location]);

    const verifyCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://172.19.44.242:8080/user/verifycode', {
                userEmail: userEmail,
                verificationCode: code


            });

            console.log(response.status);

            setSubmitted(false);

            setIsTrueVerfy(true);
            setCode('');


        } catch (error) {
            console.log("error: " + error);
            setIsTrueVerfy(false);
            setSubmitted(true);



        }



    };
    const resendCode = async (e) => {
        e.preventDefault();
        setCode('');
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
                    bdate: bdate
                }
            });
            console.log(response.status);
            console.log(fname);




        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create account. Please try again.');
        }

    };


    const goToAddress = () => {
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
        window.location.href = `/addresscustomer?data=${encodeURIComponent(JSON.stringify(userData))}`;
    }

    return (
        <div className="signup-page_box confirmation-email-box">
            <div className="signup-page_content">
                <h1 className="email-verification-header">Verify <strong>email</strong></h1>
                <form
                    id="email_verification_form"
                    autoComplete="off"
                    noValidate
                    onSubmit={(e) => e.preventDefault()} // Prevent default form submission
                >
                    <p>
                        Please enter the 6-digit code we sent to <br />
                        <span className="email-address_cont" title="nammmotaz@gmail.com">
                            <strong>{'`' + userEmail + '`'}</strong>
                        </span>
                    </p>
                    <div className="form-rowVerify verification-code-field">
                        <label htmlFor="code">Verification code</label>
                        <input className='input-input'
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            size="6"
                            minLength="6"
                            maxLength="6"
                        /><div>

                            <Link to="/signupcustomer">
                                <button className='button' type="button" >Back</button>

                            </Link>

                            <button className='button' type="button" onClick={verifyCode}>Verify</button>

                        </div>


                    </div>

                    <div>
                        {
                            !submitted && isTrueVerfiy && (
                                <p> Code is true can add address  <strong><Link style={{ color: "red" }} onClick={goToAddress} >add address</Link> </strong> or <strong><Link style={{ color: "red" }} to="/signin">Sign in</Link></strong> </p>
                            )
                        }

                        {
                            submitted &&
                            !isTrueVerfiy && (
                                <p> Code is not  true  <strong><Link style={{ color: "red" }} onClick={resendCode} >resend code</Link> </strong> </p>

                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    );

}

export default EmailVerification;
