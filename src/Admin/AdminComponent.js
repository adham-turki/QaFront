import { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
    const [createAdmin, setCreateAdmin] = useState(false);
    const [pendingReport, setPendingReport] = useState(false);
    const [acceptedReport, setAcceptedReport] = useState(false);
    const [websitedeley, setWebSiteDealy] = useState(false);
    const [pendingReportsData, setPendingReportsData] = useState([]);
    const [acceptedReportsData, setAcceptedReportsData] = useState([]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const ClickOnCreateNewAdmin = () => {
        setCreateAdmin(true);
        setPendingReport(false);
        setAcceptedReport(false);
        setWebSiteDealy(false);
    };

    const clickOnPendingReports = async () => {
        setCreateAdmin(false);
        setPendingReport(true);
        setAcceptedReport(false);
        setWebSiteDealy(false);
        try {
            const response = await axios.get("http://172.19.44.242:8080/admin/getPendingReports");
            setPendingReportsData(response.data);
        } catch (error) {
            console.error("Error fetching pending reports:", error);
        }
    };

    const clickOnAcceptingReport = async () => {
        setCreateAdmin(false);
        setPendingReport(false);
        setAcceptedReport(true);
        setWebSiteDealy(false);
        try {
            const response = await axios.get("http://172.19.44.242:8080/admin/getReports");
            setAcceptedReportsData(response.data);
        } catch (error) {
            console.error("Error fetching accepted reports:", error);
        }
    };

    const ClickOnwebsitedeley = () => {
        setCreateAdmin(false);
        setPendingReport(false);
        setAcceptedReport(false);
        setWebSiteDealy(true);
    };

    const handleCreateAdmin = async () => {
        if (!username || !password || !email || !phone) {
            alert("Please fill all fields");
            return;
        }

        const adminData = {
            userName: username,
            userPNum: phone,
            userEmail: email,
            userPass: password,
            admin: {
                adminName: username
            }
        };

        try {
            const response = await axios.post("http://172.19.44.242:8080/admin/create", adminData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200 || response.status === 201) {
                alert("Admin created successfully!");
            } else {
                alert("Failed to create admin");
            }
        } catch (error) {
            console.error("Error creating admin:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleAcceptReport = async (report) => {
        try {
            await axios.post(`http://172.19.44.242:8080/admin/AcceptReport/${report.reportID}`);
            alert("Report accepted successfully!");
            // Refresh the pending reports data
            clickOnPendingReports();
        } catch (error) {
            console.error("Error accepting report:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="dashboard-container20">
            <div style={{ marginTop: "100px" }}>
                <h1 style={{ fontFamily: "Arial" }}>Admin</h1>
            </div>
            <div className="dashboard120">
                <div className="carddashbord20" style={{ marginRight: "40px" }}>
                    <div className="card-contentdashbord20" onClick={ClickOnCreateNewAdmin}>
                        <p style={{ fontSize: "20px", marginTop: "50px" }}>Create new Admin</p>
                    </div>
                </div>
                <div className="carddashbord20" style={{ marginRight: "40px" }} onClick={clickOnPendingReports}>
                    <div className="card-contentdashbord20">
                        <p style={{ fontSize: "20px", marginTop: "50px" }}>Pending reports</p>
                    </div>
                </div>
                <div className="carddashbord20" style={{ marginRight: "40px" }} onClick={clickOnAcceptingReport}>
                    <div className="card-contentdashbord20">
                        <p style={{ fontSize: "20px", marginTop: "50px" }}>Accepted report</p>
                    </div>
                </div>
                <div className="carddashbord20" style={{ marginRight: "40px" }} onClick={ClickOnwebsitedeley}>
                    <div className="card-contentdashbord20">
                        <p style={{ fontSize: "20px", marginTop: "50px" }}>Web site Daily</p>
                    </div>
                </div>
            </div>

            {createAdmin && !pendingReport && !acceptedReport && !websitedeley && (
                <div className="create-admin-container">
                    <h2>Create New Admin</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateAdmin(); }}>
                        <label>
                            User Name:
                            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </label>
                        <label>
                            Password:
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            Phone Number:
                            <input type="text" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </label>
                        <button type="submit">Create Admin</button>
                    </form>
                </div>
            )}

            {pendingReport && !createAdmin && !acceptedReport && !websitedeley && (
                <div className="pending-reports-container" style={{ width: '80%', marginTop: '20px' }}>
                    <h2>Pending Reports</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: "40px", marginBottom: "40px" }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Product Barcode</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Customer ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Title</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Shop Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Content</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Status</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody >
                            {pendingReportsData.map((reportData, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.productBarcode}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.customerID}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.Title}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.shopName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.content}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.status}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <button
                                            onClick={() => handleAcceptReport(reportData.Report)}
                                            style={{
                                                padding: '5px 10px',
                                                fontSize: '14px',
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Accept
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {acceptedReport && !createAdmin && !pendingReport && !websitedeley && (
                <div className="accepted-reports-container" style={{ width: '80%', marginTop: '20px' }}>
                    <h2>Accepted Reports</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: "40px", marginBottom: "40px" }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Product Barcode</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Customer ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Title</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Shop Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Content</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody >
                            {acceptedReportsData.map((reportData, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.productBarcode}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.customerID}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.Title}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.shopName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.content}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reportData.Report.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Admin;
