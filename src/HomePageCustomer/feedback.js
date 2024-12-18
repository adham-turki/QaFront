import React, { useEffect, useState } from "react";
import '../HomePage/homepage.css';
import imagePlaceholder from '../HomePage/imgs/01.jpg'; // Placeholder image for shops without an image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { IoHomeOutline } from "react-icons/io5";
import { TiPlusOutline, TiMinusOutline, TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"; // Import star icons
import Cookies from 'js-cookie';
import { FaCartShopping } from "react-icons/fa6";
import { FaBackspace } from "react-icons/fa";
import { CiSquareRemove } from "react-icons/ci";
import { CiStar } from 'react-icons/ci';
import Alert from '@mui/material/Alert';
import { FaStar } from 'react-icons/fa';

function Feedback() {
    const [currentCard, setCurrentCard] = useState('Visa');
    const [cardImage, setCardImage] = useState('https://dl.dropboxusercontent.com/s/ubamyu6mzov5c80/visa_logo%20%281%29.png');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [expires, setExpires] = useState('');
    const [addressDropdown, setAddressDropdown] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [imagesForCart, setImagesForCart] = useState({});
    const [addresses, setAddresses] = useState([]);
    const location = useLocation();
    const [id, setId] = useState('');
    const [rating, setRating] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null); // New state to track selected product
    const [shopname, setShopname] = useState('');
    const [barcode, setBarCode] = useState('');
    const [feedbakcontent, setFeedbackcontent] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        const customerid = Cookies.get('userid');
        setId(customerid);

        if (userData) {
            // Assuming you have some state to set the username
            // setUsername(userData.userName || '');
        }

        const fetchForCart = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/shoppingCart/getCartItems/${customerid}`);
                setCartItems(response.data);

                const imagesMap2 = {};
                for (const j of response.data) {
                    try {
                        const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.product.ProductBarcode}/${j.product.ShopName}`);
                        const images = response3.data;
                        if (images.length > 0) {
                            let base64Image = images[0];
                            imagesMap2[j.product.ProductBarcode] = base64Image;
                        }
                    } catch (error) {
                        console.log("error" + error);
                    }
                }
                setImagesForCart(imagesMap2);
                if (response.data.length > 0) {
                    setSelectedProduct(response.data[0].product.ProductBarcode);
                    setShopname(response.data[0].product.ShopName);
                    setBarCode(response.data[0].product.ProductBarcode);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const fetchAddress = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/address/getaddresses/${customerid}`);
                console.log(response.data);
                setAddresses(response.data); // Update state with fetched addresses
            } catch (error) {
                console.log(error);
            }
        };

        fetchForCart();
        fetchAddress();

    }, [location.search]);

    const handleDropdownClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const FeedBackClick = async () => {
        try {
            const response = await axios.patch(`http://172.19.44.242:8080/productShop/rateAProduct/${id}/${shopname}/${barcode}`, {
                rate: rating,
                feedBackContent: feedbakcontent
            });

            if (response.status === 200) {
                setAlertMessage('Feedback submitted successfully!');
                setTimeout(() => {
                    setAlertMessage('');
                }, 1000);

                setCartItems(cartItems.filter(item => item.product.ProductBarcode !== barcode));
                

                console.log("id d"  + id);
                console.log("shop nmame  " + shopname);
                console.log("bar code " + barcode);

                try{

                    const res=await axios.delete(`http://172.19.44.242:8080/shoppingCart/deleteProductFromACart/${id}/${shopname}/${barcode}`);
                    console.log( "lllauit "+ res.status);

                }catch(error){
                    console.log(error);
                }

                // Automatically select the next product if available
                if (cartItems.length > 1) {
                    const nextProduct = cartItems.find(item => item.product.ProductBarcode !== barcode);
                    if (nextProduct) {
                        setSelectedProduct(nextProduct.product.ProductBarcode);
                        setShopname(nextProduct.product.ShopName);
                        setBarCode(nextProduct.product.ProductBarcode);
                        setRating(0);
                        setFeedbackcontent('');
                    } else {
                        setSelectedProduct(null);
                    }
                } else {
                    setSelectedProduct(null);
                }


            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleCardSelection = (cardType) => {
        let cardSrc = '';
        switch (cardType) {
            case 'Master Card':
                cardSrc = 'https://dl.dropboxusercontent.com/s/2vbqk5lcpi7hjoc/MasterCard_Logo.svg.png';
                break;
            case 'American Express':
                cardSrc = 'https://dl.dropboxusercontent.com/s/f5hyn6u05ktql8d/amex-icon-6902.png';
                break;
            case 'Visa':
            default:
                cardSrc = 'https://dl.dropboxusercontent.com/s/ubamyu6mzov5c80/visa_logo%20%281%29.png';
                break;
        }
        setCurrentCard(cardType);
        setCardImage(cardSrc);
        setDropdownVisible(false);
    };

    const handleExpiresChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (value.length <= 2) {
            setExpires(value);
        } else if (value.length <= 4) {
            setExpires(value.slice(0, 2) + '/' + value.slice(2));
        }
    };

    const toggleAddressInput = () => {
        setAddressDropdown(!addressDropdown);
    };

    const handleRemoveItem = (productId) => {
        setCartItems(cartItems.filter(item => item.product.ProductBarcode !== productId));
        if (selectedProduct === productId) {
            setSelectedProduct(null);
            setRating(0);
        }
    };

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

    const backToCart = () => {
        window.location.href = `/homepagecustomer?data=${encodeURIComponent(JSON.stringify(''))}`;
    };

    const checkoutClick = async () => {
        try {
            window.location.href = `/feedback?data=${encodeURIComponent(JSON.stringify(''))}`;
        } catch (error) {
            console.log(error);
        }
    };

    const handleProductClick = (barcode, shopName) => {
        setSelectedProduct(barcode);
        setShopname(shopName);
        setBarCode(barcode);
        setRating(0);
    };

    return (
        <div className='feedback-container'>
            {alertMessage && (
                <div className="alert" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
                    <Alert severity="success">{alertMessage}</Alert>
                </div>
            )}
            <div className='feedback-back-button' onClick={backToCart}>
                <FaBackspace />
            </div>
            <div className='feedback-window'>
                <div className='feedback-order-info'>
                    <div className='feedback-order-info-content'>
                        <h2 style={{ marginLeft: "200px", fontFamily: "Arial" }}>Feedback</h2>
                        <div className='feedback-line'></div>
                        <div className='feedback-table-container'>
                            <table className='feedback-order-table'>
                                <tbody>
                                    {
                                        cartItems.map(item => (
                                            <tr key={item.product.ProductBarcode} onClick={() => handleProductClick(item.product.ProductBarcode, item.product.ShopName)}
                                                className={selectedProduct === item.product.ProductBarcode ? 'selected' : ''}>
                                                <td style={{ position: 'relative' }}>
                                                    <img
                                                        src={imagesForCart[item.product.ProductBarcode]}
                                                        className='feedback-full-width'
                                                        alt={item.product.ProductName}
                                                    />
                                                </td>
                                                <td>
                                                    <br /> {item.product.ProductName}<br /> <span className='feedback-thin feedback-small'> {item.product.ProductCategory}<br /><br /> </span>
                                                </td>
                                                <td>
                                                    <div style={{ marginLeft: "100px", marginTop: "50px", color: "orange" }} onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.product.ProductBarcode); }}>
                                                        <CiSquareRemove style={{ fontSize: "20px" }} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div className='feedback-line'></div>
                        </div>
                    </div>
                </div>
                <div className='feedback-credit-info' style={{ background: "white" }}>
                    <div className='feedback-credit-info-content'>
                        {selectedProduct && (
                            <div className="feedback-starRating" style={{ marginTop: "80px" }}>
                                {[...Array(5)].map((star, index) => (
                                    <div
                                        key={index}
                                        className={`star-box ${index < rating ? 'active' : ''}`}
                                        onClick={() => handleStarClick(index)}
                                    >
                                        {index < rating ? (
                                            <FaStar style={{ color: 'orange', fontSize: "40px" }} />
                                        ) : (
                                            <CiStar style={{ color: 'black', fontSize: "30px" }} />
                                        )}
                                    </div>
                                ))}
                                <div className="form-row" style={{ marginTop: "50px" }}>
                                    <label style={{ color: "black" }} htmlFor="title">
                                        Feedback
                                    </label>
                                    <textarea
                                        style={{ width: "300px", height: "100px", background: "#fff", border: "solid .5px black", borderRadius: "10px" }}
                                        type="text"
                                        name="title"
                                        id="title"
                                        placeholder="Example: easy to use"
                                        value={feedbakcontent} onChange={(e) => setFeedbackcontent(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        <button style={{ marginBottom: "20px" }} onClick={FeedBackClick} className='feedback-pay-btn'>Submit Feedback</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
