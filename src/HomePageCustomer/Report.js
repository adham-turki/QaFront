import React from 'react';
import image from '../HomePage/imgs/01.jpg'
import { useEffect, useState } from "react";
import '../HomePage/homepage.css';
import imagePlaceholder from '../HomePage/imgs/01.jpg'; // Placeholder image for shops without an image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { IoHomeOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import Cookies from 'js-cookie';
import { LiaShekelSignSolid } from "react-icons/lia";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md"; // Import filled heart icon
import { FaCartShopping } from "react-icons/fa6";
import { MdOutlineLocalShipping } from "react-icons/md";
import { TiPlusOutline, TiMinusOutline, TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"; // Import star icons
import { TbCurrencyShekel } from "react-icons/tb";
import Alert from '@mui/material/Alert';
import { Toast } from 'bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ReportForCustomer() {


    const [searchText, setSearchText] = useState("");
    const [username, setUsername] = useState('');
    const location = useLocation();
    const [category, setCategory] = useState('');
    const [barCode, setBarCode] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [shopName, setShopName] = useState('');
    const [productRate, setProductRate] = useState(3.6); 
    const[productname,setPRoductName]=useState('');
    const[description,setDescription]=useState('');
    const[price,setPrice]=useState('');
    const[image1,setImage1]=useState(image);
    const[reportTitle,setReportTitle]=useState('');
    const [resonseofreport,setResonsOfreport]=useState('');
    const[id,setId]=useState('');


    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        const idcustomer=Cookies.get('userid');
        setId(idcustomer);
        

        if (userData) {
            setPRoductName(userData.ProductName || '');
            setCategory(userData.ProductCategory || '');
            setBarCode(userData.ProductBarcode || '');
            setPublishDate(userData.publishDate || '');
            setPrice(userData.ProductPrice || '');
            setDescription(userData.ProductDescription|| '');
            setProductRate(userData.ProductRate || '');
            setShopName(userData.ShopName||'');



        }

        



    }, [location.search]);


    
  
    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${barCode}/${shopName}`);
                const images = response.data;
               
  
                if (images.length > 0) {
                   setImage1(images[0]);
                }
  
              
             
            } catch (error) {
                console.error("Error fetching user image:", error);
            }
        };
  
        if (barCode) {
            fetchUserImage();
        }
    }, [barCode, shopName]);
  
    const handleSearch = () => {
        window.location.href = `/searchbynamecustomer?data=${encodeURIComponent(JSON.stringify(searchText))}`;
      };

      const advanceSerach = () => { window.location.href = `/advancesearchforcustomer?data=${encodeURIComponent(JSON.stringify(""))}`; }


      const MainClick = () => {
        window.location.href = `/homePageCustomer?data=${encodeURIComponent(JSON.stringify(""))}`;
      };

      const wishlistpage = () => {
        window.location.href = `/wishlist?data=${encodeURIComponent(JSON.stringify(''))}`;
      }

      const renderStars = (rate) => {
        const fullStars = Math.floor(rate);
        const halfStar = rate % 1 > 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        return (
          <>
            {[...Array(fullStars)].map((_, i) => <TiStarFullOutline key={i} color="orange" />)}
            {halfStar === 1 && <TiStarHalfOutline color="yellow" />}
            {[...Array(emptyStars)].map((_, i) => <TiStarOutline key={i} />)}
          </>
        );
      };
    

      const handleTheReport=async()=>{

        try{

            const response=await axios.post(`http://172.19.44.242:8080/report/submitReport`,{
                 reportTitle:reportTitle,
                reportContent: resonseofreport,
                user: {userid: id},
                product: {
                            shop: {
                            shopName: shopName
                            },
                            product: {
                            productBarcode: barCode
                            }
                }
            });

            if (response.status === 200) {
              toast.success("Report Sent Successfully");
            }
          } catch (error) {
            console.log(error);
            toast.error("Failed to Submit Report");
          }


      }
    

    return (
        <div>

<div className="header-area">
<ToastContainer/>
        <Link to='/homepagecustomer'>
          <div className="logo1"><span style={{ color: "red", fontSize: "20px" }}>Tech</span ><span style={{ color: "orange", fontStyle: "italic" }}>Spotter</span> </div>
        </Link>
        <div className="linksHome-containerHome">
          <ul className="linksHome">
            <li>
              <div className="search-bar-containerforhome">
                <input
                  type="text"
                  className="search-inputforhome"
                  placeholder="Search for anything"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearch} />
                <button onClick={advanceSerach} className="advance-button">Advance</button>
              </div>
            </li>
            <li onClick={MainClick}><a href="#" data-section="Main"><IoHomeOutline style={{ fontSize: "20px" }} /></a></li>
            <li ><a href="#" data-section="Cart"><FiShoppingCart style={{ fontSize: "20px" }}  />            </a></li>
            <li onClick={wishlistpage} ><a href="#" data-section="Cart"><MdFavoriteBorder style={{ fontSize: "20px" }} /></a></li>
            <li ><a href="#" data-section="Cart"><MdOutlineLocalShipping onClick={()=>{

window.location.href = `/orderforcustomer?data=${encodeURIComponent(JSON.stringify(''))}`;          


}} style={{ fontSize: "20px" }} /></a></li>
            <li><a href="#" data-section=".about-us">About</a></li>
            
          </ul>
        </div>
        <div className="linksHome-containerHome1">
          <ul className="linksHome">
            <li><a style={{ color: 'red', fontSize: "13px" }} href="#" data-section=".gallery1">{username}</a></li>
          </ul>
        </div>
      </div>



<div className="containerreport">
            <p className='titleforareport'>File a report </p>
            <div className="headerreport">
                <img 
                    alt="Product" 
                    className="imagereport"
                    src={image1}
                />
                <div className="inforeport">
                    <p>{productname}</p>
                    <p>barcode: {barCode}</p>
                    <p> {price}<TbCurrencyShekel />      </p>
                    <p>{renderStars(productRate)}</p>
                </div>
            </div>
            <hr className="linereport" />
            <div className="formreport">
                <label className="labelreport" htmlFor="reportCategory">Report Title</label>
               <input style={{width:"100%",height:"30px",border:".3px solid",margin:"10px 0px 10px 0px",borderRadius:"2px"}} value={reportTitle} onChange={(e)=>setReportTitle(e.target.value)} type='text'></input>
                <label className="labelreport" htmlFor="reasonForReport">Reason for Report</label>
                <textarea style={{width:"100%",height:"30px",border:".3px solid",margin:"10px 0px 10px 0px",borderRadius:"2px"}} value={resonseofreport} onChange={(e)=>setResonsOfreport(e.target.value)} >

                </textarea>
                <button onClick={handleTheReport} className="buttonreport">Continue</button>
            </div>
        </div>
        </div>
      
    );
}

export default ReportForCustomer;
