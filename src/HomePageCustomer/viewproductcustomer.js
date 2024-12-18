import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import photo from '../HomePage/imgs/01.jpg';
import { Link } from "react-router-dom";
import { LiaShekelSignSolid } from "react-icons/lia";
import { TiPlusOutline, TiMinusOutline, TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"; // Import star icons
import axios from "axios";
import Cookies from 'js-cookie';
import Alert from '@mui/material/Alert';
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineLocalShipping, MdFavorite, MdFavoriteBorder, MdLogin, MdLogout } from "react-icons/md"; // Import both filled and outlined heart icons
import { IoHomeOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiShekel } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";

function Viewproductcustomer() {
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState('');
    const [barCode, setBarCode] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [shopName, setShopName] = useState('');
    const [productRate, setProductRate] = useState(3.6);
    const [productname, setPRoductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image1, setImage1] = useState(photo);
    const [image2, setImage2] = useState(photo);
    const [image3, setImage3] = useState(photo);
    const [mainImage, setMainImage] = useState(null);
    const [cardsForProduct, setCardsForProduct] = useState([]);
    const [imagesProduct, setImageForProduct] = useState([]);
    const [id, setId] = useState('');
    const [customerid, setcustomerid] = useState('');
    const [flag, setFlag] = useState(false);
    const [array, setArray] = useState([]);
    const [feedback, setFeedback] = useState([]);

    const location = useLocation();
    const hasSavedRecommendation = useRef(false); // Add this line

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        const idcustomer = Cookies.get('userid');
        setcustomerid(idcustomer);
        setArray(userData);

        if (userData) {
            setPRoductName(userData.ProductName || '');
            setCategory(userData.ProductCategory || '');
            setBarCode(userData.ProductBarcode || '');
            setPublishDate(userData.publishDate || '');
            setPrice(userData.ProductPrice || '');
            setDescription(userData.ProductDescription || '');
            setProductRate(userData.ProductRate || '');
            setShopName(userData.ShopName || '');
        }

        const fetchNewProduct = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/product/getProductbyBarcode/${userData.ProductBarcode}`);
                setId(response.data.productId);

                try {
                    const responseforNew = await axios.get(`http://172.19.44.242:8080/productShop/recommendations/${response.data.productId}`);
                    setCardsForProduct(responseforNew.data);

                    const imagesMap2 = {};

                    for (const j of responseforNew.data) {
                        try {
                            const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.ProductBarcode}/${j.ShopName}`);
                            const images = response3.data;
                            if (images.length > 0) {
                                let base64Image = images[0];
                                imagesMap2[j.ProductBarcode] = base64Image;
                            }
                        } catch (error) {
                            console.log("error" + error);
                        }
                    }
                    setImageForProduct(imagesMap2);
                } catch (error) {
                    console.log("error " + error);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const saveRecommendedProduct = async () => {
            console.log("customer id " + idcustomer);
            console.log(userData.ShopName);
            console.log(userData.ProductBarcode);

            try {
                const response = await axios.post(`http://172.19.44.242:8080/productShop/saveRecommended/${idcustomer}/${userData.ShopName}/${userData.ProductBarcode}`);
                console.log("ress " + response.status);
                console.log(response.data);
            } catch (error) {
                console.error("Error saving recommended product:", error);
            }
        };

        fetchNewProduct();

        if (!hasSavedRecommendation.current) {
            saveRecommendedProduct();
            hasSavedRecommendation.current = true; // Update the flag
        }

    }, []);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${barCode}/${shopName}`);
                const images = response.data;

                if (images.length > 0) {
                    setImage1(images[0]);
                    setMainImage(images[0]);
                }

                if (images.length > 1) {
                    setImage2(images[1]);
                }
                if (images.length > 2) {
                    setImage3(images[2]);
                }
            } catch (error) {
                console.error("Error fetching user image:", error);
            }
        };

        if (barCode) {
            fetchUserImage();
        }
    }, [barCode, shopName]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
             
                const response = await axios.get(`http://172.19.44.242:8080/productShop/getFeedback/${shopName}/${barCode}/${customerid}`);
                setFeedback(  response.data);
            } catch (error) {

                console.error("Error fetching feedback:", error);
            }
        };

        if (barCode && shopName && customerid) {
            fetchFeedback();
        }
    }, [barCode, shopName, customerid]);

    const MainClick = () => {
        window.location.href = `/homePageCustomer?data=${encodeURIComponent(JSON.stringify(""))}`;
    };
    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

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

    const ReportHandle = () => {
        window.location.href = `/reportitem?data=${encodeURIComponent(JSON.stringify(array))}`;
    };
    const setImageByFirst = () => {
        setMainImage(image1);
    };
    const setImageBySecound = () => {
        setMainImage(image2);
    };
    const setImageByThired = () => {
        setMainImage(image3);
    };

    const renderCards1 = () => {
        return cardsForProduct.slice(0, 5).map((data, index) => { // Limit to 5 cards
            const base64Image = imagesProduct[data.ProductBarcode];
            const imageUrl = base64Image ? `${base64Image}` : null;

            return (
                <div key={index} className="product-card3" onClick={() => {
                    window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(data))}`;
                }}>
                    {imageUrl && <img className="product-image3" src={imageUrl} alt={data.ProductName} />}
                    <hr className="divider3" />
                    <div className="card-content3">
                        <p className="product-rate3"><b>{data.ShopName}</b></p>
                        <p className="product-name3"><span><b>{data.ProductName}</b></span></p>
                        <p className="product-price3"><span>{data.ProductPrice}<BiShekel /> </span></p>
                        <p className="product-rate3">{renderStars(data.ProductRate)}</p>

                        <button
                            className="view-product-button3"
                            onClick={() => {
                                window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(data))}`;
                            }}
                        >
                            View Product
                        </button>
                    </div>
                </div>
            );
        });
    };

    const cartclick = () => {
        window.location.href = `/cartcustomer?data=${encodeURIComponent(JSON.stringify(''))}`;
    };

    const addToCart = async () => {
        try {
            const response = await axios.post(`http://172.19.44.242:8080/shoppingCart/addProductToCart/${customerid}/${shopName}/${barCode}`);
            if (response.status === 200) {
                toast.success("Product added to cart ");
                window.location.href = `/cartcustomer?data=${encodeURIComponent(JSON.stringify(''))}`;
            }
        } catch (error) {
            toast.error("Failed to add to cart");
            console.log(error);
        }
    };

    const WishListpage = () => { window.location.href = `/wishlist?data=${encodeURIComponent(JSON.stringify(""))}`; };

    return (
        <div>
            <ToastContainer />
            <div className="header-area">
                <Link to='/homepagecustomer'>
                    <div className="logo1"><span style={{ color: "red", fontSize: "20px" }}>Tech</span><span style={{ color: "orange", fontStyle: "italic" }}>Spotter</span></div>
                </Link>
                <div className="linksHome-containerHome">
                    <ul className="linksHome">
                        <li></li>
                        <div className="iconsss">
                            <li onClick={MainClick}><a href="#" data-section="Main"><IoHomeOutline style={{ fontSize: "20px", color: "orange" }} /></a></li>
                            <li onClick={cartclick}><a href="#" data-section="Cart"><FiShoppingCart style={{ fontSize: "20px" }} /></a></li>
                            <li><a href="#" data-section="Cart"><MdFavoriteBorder style={{ fontSize: "20px" }} onClick={WishListpage} className="colorFava" /></a></li>
                            <li><a href="#" data-section="Cart"><MdOutlineLocalShipping onClick={() => {
                                window.location.href = `/orderforcustomer?data=${encodeURIComponent(JSON.stringify(''))}`;
                            }} style={{ fontSize: "20px" }} /></a></li>
                        </div>
                    </ul>
                    <button className="toggle-menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="linksHome-containerHome1">
                    <ul className="linksHome"></ul>
                </div>
            </div>

            <div className="product-container10">
                <div className="product-image10">
                    <img src={mainImage} alt="Main Product" />
                    <div className="orange-line"></div>
                    <div className="sub-images10">
                        <img onClick={setImageByFirst} src={image1} alt="View 1" />
                        <img onClick={setImageBySecound} src={image2} alt="View 2" />
                        <img onClick={setImageByThired} src={image3} alt="View 3" />
                    </div>
                </div>
                <div className="product-details10">
                    <Link onClick={ReportHandle} style={{ marginLeft: "500px", color: "black", textDecoration: "underline" }}>
                        Report this item <TbReportSearch style={{ color: "orange", fontSize: "20px" }} />
                    </Link>
                    <h1>{productname}</h1>
                    <p style={{ fontSize: "20px" }}>{price}<BiShekel /> </p>
                    <div className="additional-details">
                        <div style={{ fontFamily: "bold", fontSize: "20px", paddingTop: "10px" }}>Category: <span>{category}</span></div>
                        <p style={{ fontFamily: "bold", fontSize: "20px", paddingTop: "10px" }}>BarCode: <span>{barCode}</span></p>
                        <div>Rating: {renderStars(3.6)}</div>
                    </div>
                    <div className="quantity10">
                        <label htmlFor="quantity10">Quantity:</label>
                        <input type="number" id="quantity10" name="quantity" min="1" style={{ backgroundColor: "#FFDBAC", borderRadius: "10px" }} value={quantity} readOnly />
                        <TiPlusOutline onClick={incrementQuantity} style={{ cursor: 'pointer' }} />
                        <TiMinusOutline onClick={decrementQuantity} style={{ cursor: 'pointer' }} />
                    </div>
                    <button onClick={addToCart} className="add-to-cart10">ADD TO CART</button>
                    <div className="description10">
                        <h2>Product Details</h2>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
            <div style={{marginLeft:"140px",marginBottom:"50px", width: "80%", height: "fit-content", background: "#F0F8FF" }}>
                <h2 style={{ textAlign: 'center', padding: '10px' }}>Customer Feedback</h2>
                <div style={{ overflowX: 'scroll' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Rating</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.map((fb, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{renderStars(fb.rate)}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{fb.feedBackContent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="category-line" style={{ marginBottom: "20px" }}>
                <span className="category-text" style={{ color: "black", fontSize: "15px", fontFamily: "Arial" }}>Related product <span style={{ color: "#A9A9A9" }}>'S</span></span>
            </div>
            <div className="cardcontanerForNewProduct">
                {renderCards1()}
            </div>
        </div>
    );
}

export default Viewproductcustomer;
