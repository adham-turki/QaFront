

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import photo from '../HomePage/imgs/01.jpg';
import { Link } from "react-router-dom";
import { LiaShekelSignSolid } from "react-icons/lia";
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import axios from "axios";
import { data } from "autoprefixer";
import { BiRightArrowAlt } from "react-icons/bi";
import { MdOutlineMailLock } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";


function ShopForCustomer() {
    const [shopName, setShopName] = useState('alnemer');
    const [shopRate, setShopRate] = useState(0.0);
    const [numOfVisits, setNumOfVisits] = useState(0);
    const [numOfRates, setNumOfRates] = useState(0);
    const [mainImage, setMainImage] = useState(photo);
    const [address,setAddress]=useState([]);
    const[email,setEmail]=useState('');
    const[phone,setPhone]=useState('');

    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

        if (userData) {
            console.log(userData.length);
            setShopName(userData.shopName);
            setShopRate(userData.shopRate);
            setNumOfVisits(userData.numOfVisits);
            setNumOfRates(userData.numOfRates);

            const fetchImage = async () => {
                try {
                    const imageResponse = await axios.get(`http://172.19.44.242:8080/image/${userData.shopName}`);
                    setMainImage(imageResponse.config.url);
                } catch (imageError) {
                    setMainImage(photo); // Set default image if fetching fails
                }
            };

            const fetchAddress=async()=>{
                try{
                    const response=await axios.get(`http://172.19.44.242:8080/address/getaddresses/${userData.shopID}`);
                    setAddress(response.data);

                }catch(error){
                    console.log(error);
                }
            }
            const fetchUserInfo=async()=>{
                try{
                    const response=await axios.get(`http://172.19.44.242:8080/user/${userData.shopID}`);
                    setEmail(response.data.userEmail);
                    setPhone(response.data.userPNum);

                }catch(error){
                    console.log(error);
                }
            }

            fetchImage();
            fetchAddress();
            fetchUserInfo();
        }
    }, [location]);

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
    const renderAddress=()=>{
        return address.map( (data,index)=>{

            return (

               <div className="additional-details">
                <h4>Address {index}</h4>
                        <div style={{fontFamily:"bold", fontSize:"20px", paddingTop:"10px",margin:"30px"}}> {data.city} <BiRightArrowAlt  style={{marginLeft:"30px"}}/> {data.town}<BiRightArrowAlt style={{marginLeft:"30px"}}/> {data.streetNo} <BiRightArrowAlt style={{marginLeft:"30px"}} /> {data.depNo}   </div>
                        <div className="orange-line1"></div>
                       
                    </div>

            );
        } );
    }

    return (
        <div>
            <div className="header-area">
                <Link to='/homepagecustomer'>  
                    <div className="logo1">
                        <span style={{color:"red", fontSize:"20px"}}>Shop</span>
                        <span style={{color:"orange", fontStyle:"italic"}}>Page</span>
                    </div>
                </Link>
            </div>

            <div className="product-container10">
                <div className="product-image10">
                    <img src={mainImage} alt="Main Product" />
                    
                    <div className="form-row" style={{paddingTop:"120px"}}>
                    <Link to='/homepagecustomer' style={{color:"black"}}>
                    <button style={{marginTop:"250px"}} className="form-label" htmlFor="description">
                           Back
                           </button>
                    </Link>
                       
                    </div>
                </div>
                
                <div className="product-details10">
                    <h1 style={{fontFamily:"Arial",margin:"20px"}}> {shopName}</h1>
                    <div className="orange-line1" ></div>
                    <p style={{fontSize:"20px",margin:"20px"}}>Rate: {renderStars(3.6)} </p>
                    <div className="orange-line1"></div>
                    <div className="additional-details">
                        <div style={{fontFamily:"bold", fontSize:"20px", paddingTop:"10px",margin:"20px"}}><MdOutlineMailLock style={{color:"black",fontSize:"23px"}} />  <span style={{marginLeft:"10px"}}>{email}</span></div>
                        <div className="orange-line1"></div> 
                        <p style={{fontFamily:"bold", fontSize:"20px", paddingTop:"10px",margin:"20px"}}><MdOutlineLocalPhone style={{color:"black",fontSize:"23px"}}  />

                        <span style={{marginLeft:"10px"}}> {phone}</span></p>
                        <div className="orange-line1"></div>
                        <div>

                        {
                            renderAddress()
                        }
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopForCustomer;
