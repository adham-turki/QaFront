import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import '../Customer/verfiy.css'; // Import the corrected styles.css file

function Verfiy() {


    const [code, setCode] = useState('');
    const [shopName, setShopName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isTrueVerfiy, setIsTrueVerfy] = useState(false);
    const [submitted, setSubmitted] = useState(false);



    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

        if (userData) {

            setShopName(userData.shopName || '');
            setPhoneNumber(userData.phoneNumber || '');
            setEmail(userData.email || '');
            setUserName(userData.userName || '');
            setPassword(userData.password || '');


        }
    }, [location]);

    const verifyCode = async (e) => {
        e.preventDefault();
        try {

            console.log(email);
            console.log(code);
            const response = await axios.post('http://172.19.44.242:8080/user/verifycode', {
                userEmail: email,
                verificationCode: code


            });
            if (response.status == 200) {
                const response2 = await axios.post(`http://172.19.44.242:8080/user/getUserByEmail`, {
                    userNameOrEmail: email,
                    password: password
                });

                console.log(response2.data);
                console.log(response2.data.userid);
                window.location.href = `/address?data=${encodeURIComponent(JSON.stringify(response2.data.userid))}`;

            }



            console.log(response.status);

            setSubmitted(false);


            setIsTrueVerfy(false);
            console.log("res " + response.data.id);

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


    };




    return (
        <body className=".bodyelemnt">
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
                                <strong>{'`' + email + '`'}</strong>
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

                                <Link to="/signupshop">
                                    <button className='button' >Back</button>

                                </Link>

                                <button className='button' type="button" onClick={verifyCode}>Verify</button>

                            </div>


                        </div>

                        <div>
                            {
                                !submitted && isTrueVerfiy && (
                                    <p> Code is true  <Link style={{ color: "red" }} to="/signin">Sign in</Link> </p>
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

        </body>

    );

}

export default Verfiy;
