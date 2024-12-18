import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Changepassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const changePassword = async () => {
        const password = Cookies.get('password');
        const id = Cookies.get('userid');

        if (oldPassword === password) {
            if (newPassword === confirmNewPassword) {
                try {
                    const response = await axios.patch(`http://172.19.44.242:8080/user/changePassword/${id}`, {
                        oldPass: oldPassword,
                        newPass: newPassword,
                        newPass2: confirmNewPassword
                    });
                    console.log(response.status);
                    if (response.status === 200) {
                        toast.success("Password changed successfully!");
                        window.location.href = `/shopowner?data=${encodeURIComponent(JSON.stringify(''))}`;


                    }
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');

                    Cookies.remove('password');
                    Cookies.set('password', newPassword, { expires: 7, path: '/' });

                } catch (error) {
                    console.log("Error:", error);
                    toast.error("Error changing password");
                }
            } else {
                toast.error("New password and confirmation do not match");
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } else {
            toast.error("Old password is incorrect");
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
    }

    return (
        <div className="AppSetter">
            <ToastContainer />
            <div className="containerSetterChangingPass">
                <h2 style={{ color: "orange", padding: "20px" }}>Change password</h2>
                <div className="form-row" style={{ padding: "20px" }}>
                    <label className="form-label" htmlFor="oldPassword">Old password</label>
                    <input
                        style={{ borderRadius: "10px" }}
                        type="password"
                        className="form-input"
                        placeholder="Old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div className="form-row" style={{ padding: "20px" }}>
                    <label className="form-label" htmlFor="newPassword">New password</label>
                    <input
                        style={{ borderRadius: "10px" }}
                        type="password"
                        className="form-input"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="form-row" style={{ padding: "20px" }}>
                    <label className="form-label" htmlFor="confirmNewPassword">Confirm New password</label>
                    <input
                        style={{ borderRadius: "10px" }}
                        type="password"
                        className="form-input"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Link to="/shopowner">
                        <button className="BackButton" style={{}}>Back</button>
                    </Link>
                    <button onClick={changePassword} className="updateButton" style={{}}>Change</button>
                </div>
            </div>
        </div>
    );
}

export default Changepassword;
