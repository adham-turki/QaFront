import React, { useState, useEffect, useRef } from "react";
import './setter.css';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Photo from './photo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Setting() {
    const [image, setImage] = useState(Photo);
    const [prevousImage, setPrevousImage] = useState(Photo);
    const [isUpdate, setIsUpdate] = useState(false);
    const [changeButton, setChangeButton] = useState(false);
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [shopname, setShopname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [userid, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [changePicture, setChangePicture] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

        if (userData) {
            setUsername(userData.username || '');
            setEmail(userData.email || '');
            setShopname(userData.shopname || '');
            setPhone(userData.phone || '');
            setUserID(userData.userId || '');
            setPassword(userData.password || '');
        }
    }, [location]);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/image/${shopname}`, { responseType: 'arraybuffer' });
                if (response.data) {
                    const blob = new Blob([response.data], { type: 'image/jpg' });
                    setPrevousImage(URL.createObjectURL(blob));
                    setImage(URL.createObjectURL(blob));
                }
            } catch (error) {
                console.error("Error fetching user image:", error);
            }
        };

        console.log(userid + " user id");

        if (userid) {
            fetchUserImage();
        }
    }, [userid, shopname]);

    const handleChangePhoto = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = () => {
        const file = fileInputRef.current.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setChangePicture(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitPhoto = async () => {
        const file = fileInputRef.current.files[0];
        console.log("file " + file);
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const response = await axios.post(`http://172.19.44.242:8080/image/${shopname}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setChangeButton(false);
                setChangePicture(true);
                console.log(response.status);
                toast.success('Photo uploaded successfully!');
            } catch (error) {
                console.error("Error uploading photo:", error);
                toast.error("Error uploading photo");
            }
        }
    };

    const updateProfile = async () => {
        console.log("password " + password);
        try {
            const response = await axios.patch(`http://172.19.44.242:8080/user/updateShopOwner/${userid}`, {
                userName: username,
                userPNum: phone,
                userEmail: email,
                userPass: password,
                shopowner: {
                    shopName: shopname
                }
            });
            console.log(response.status);
            toast.success("Update is done");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile");
        }
    };

    const back1 = () => {
        setChangeButton(false);
        setIsUpdate(false);
    };

    const backOnThePicture = () => {
        setChangePicture(false);
        setImage(prevousImage);
    };

    const updateProfile1 = () => {
        setIsUpdate(true);
        setChangeButton(true);
    }

    const back2 = () => {
        window.location.href = `/shopowner?data=${encodeURIComponent(JSON.stringify(''))}`;
    }

    return (
        <div className="AppSetter">
            <ToastContainer />
            <div className="containerSetter">
                <img src={image} alt="Your Image" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                {!changePicture ? (
                    <button onClick={handleChangePhoto}>Change Photo</button>
                ) : (
                    <div>
                        <button onClick={backOnThePicture} style={{}}>Back</button>
                        <button onClick={handleSubmitPhoto}>Submit</button>
                    </div>
                )}
                <hr />
                <div className="form-row">
                    <label className="form-label" htmlFor="username">User name</label>
                    {!isUpdate ? (
                        <label className="form-input">{username}</label>
                    ) : (
                        <input
                            style={{ borderRadius: "10px" }}
                            type="text"
                            className="form-input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    )}
                </div>
                <div className="form-row">
                    <label style={{}} className="form-label" htmlFor="shopname">Shop name</label>
                    {!isUpdate ? (
                        <label className="form-input">{shopname}</label>
                    ) : (
                        <input
                            style={{ borderRadius: "10px" }}
                            type="text"
                            id="shopname"
                            placeholder="Shop name"
                            className="form-input"
                            value={shopname}
                            onChange={(e) => setShopname(e.target.value)}
                        />
                    )}
                </div>
                <div className="form-row">
                    <label className="form-label" htmlFor="phone">Phone</label>
                    {!isUpdate ? (
                        <label className="form-input">{phone}</label>
                    ) : (
                        <input
                            style={{ borderRadius: "10px" }}
                            type="text"
                            className="form-input"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    )}
                </div>
                <div className="form-row">
                    <label style={{}} className="form-label" htmlFor="email">Email</label>
                    {!isUpdate ? (
                        <label className="form-input">{email}</label>
                    ) : (
                        <input
                            style={{ borderRadius: "10px" }}
                            type="text"
                            className="form-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    )}
                </div>
                <Link to="/changepassword" style={{ color: "orange", position: "relative", top: "32px" }}>Change password</Link>
                <div>
                    {!changeButton ? (
                        <div>
                            <button className="BackButton" onClick={back2}>back</button>
                            <button className="updateButton" onClick={updateProfile1}>Update</button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={back1} className="BackButton">back</button>
                            <button className="updateButton" onClick={updateProfile}>Submit</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Setting;
