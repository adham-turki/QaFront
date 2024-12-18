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
import Alert from '@mui/material/Alert';

function CheckOut() {
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
            } catch (error) {
                console.log(error);
            }
        };

        const fetchAddress = async () => {
            try {
                // console.log(customerid);
                const response = await axios.get(`http://172.19.44.242:8080/address/getaddresses/${customerid}`);
                // console.log(response.data);
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
        // Add logic to remove the item from the cart
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
        window.location.href = `/cartcustomer?data=${encodeURIComponent(JSON.stringify(''))}`;
    };

    const checkoutClick = async () => {
        let address = addressDropdown ? selectedAddress : newAddress;

        if (!address) {
            alert("Please select or enter an address.");
            return;
        }

        const orderItems = cartItems.map(item => ({
            product: {
                product: { productBarcode: item.product.ProductBarcode },
                shop: { shopName: item.product.ShopName },
                quantity: item.product.ProductQuantity
            }
        }));

  
        const orderData = {
            user: { userid: id },
            orderItem: orderItems,
            address: address
        };

        console.log("Order Data:", orderData); // Print order data to console

        try {
            const response = await axios.post('http://172.19.44.242:8080/orderitem/makeNewOrder', orderData);
            if (response.status === 200) {
                <Alert severity="success">This is a success Alert.</Alert>
                window.location.href = `/feedback?data=${encodeURIComponent(JSON.stringify(''))}`;
            }
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    return (
        <div className='checkout-container'>
            <div className='checkout-back-button' onClick={backToCart}>
                <FaBackspace />
            </div>
            <div className='checkout-window'>
                <div className='checkout-order-info'>
                    <div className='checkout-order-info-content'>
                        <h2>Product <span style={{ color: "orange" }}>'S</span></h2>
                        <div className='checkout-line'></div>
                        <div className='checkout-table-container'>
                            <table className='checkout-order-table'>
                                <tbody>
                                    {
                                        cartItems.map(item => (
                                            <tr key={item.product.ProductBarcode}>
                                                <td style={{ position: 'relative' }}>
                                                    <img
                                                        src={imagesForCart[item.product.ProductBarcode]}
                                                        className='checkout-full-width'
                                                        alt={item.product.ProductName}
                                                    />
                                                </td>
                                                <td>
                                                    <br /> <span className='checkout-thin'>{renderStars(item.product.ProductRate)}</span>
                                                    <br /> {item.product.ProductName}<br /> <span className='checkout-thin checkout-small'> {item.product.ProductCategory}<br /><br /> </span>
                                                </td>
                                                <td>
                                                    <div style={{ marginLeft: "100px", marginTop: "50px", color: "orange" }} > {item.product.ProductPrice}</div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className='checkout-line'></div>
                        </div>
                        <div className='checkout-total'>
                            <span style={{ float: 'left' }}>
                                <div className='checkout-thin checkout-dense'>Item</div>
                                TOTAL
                            </span>
                            <span style={{ float: 'right', textAlign: 'right', marginBottom: "80px" }}>
                                <div className='checkout-thin checkout-dense'>({cartItems.length})</div>
                                ${cartItems.reduce((acc, item) => acc + item.product.ProductPrice, 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='checkout-credit-info'>
                    <div className='checkout-credit-info-content'>
                        <img src={cardImage} height='80' className='checkout-credit-card-image' alt='Credit Card'></img>
                        Card Number
                        <input className='checkout-input-field'></input>
                        Card Holder
                        <input className='checkout-input-field'></input>
                        <table className='checkout-half-input-table'>
                            <tr>
                                <td>Expires
                                    <input
                                        className='checkout-input-field'
                                        value={expires}
                                        onChange={handleExpiresChange}
                                        maxLength="5"
                                        placeholder="MM/YY"
                                    ></input>
                                </td>
                                <td>CVC
                                    <input className='checkout-input-field'></input>
                                </td>
                            </tr>
                        </table>
                        {addressDropdown ? (
                            <div>
                                <select
                                    className='checkout-input-field'
                                    value={selectedAddress}
                                    onChange={(e) => setSelectedAddress(e.target.value)}
                                >
                                    <option value="">Select Address</option>
                                    {addresses.map((address) => {
                                        return (
                                            <option key={address.addID} value={`${address.governorate} -> ${address.city} -> ${address.town} -> ${address.streetNo} -> ${address.depNo}`}>
                                                {`${address.governorate} -> ${address.city} -> ${address.town} -> ${address.streetNo} -> ${address.depNo}`}
                                            </option>
                                        );
                                    })}
                                </select>
                                <p onClick={toggleAddressInput} className='checkout-add-address-btn'>
                                    <Link style={{ color: "white" }}>
                                        Add another address
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <div>
                                <input
                                    className='checkout-input-field'
                                    value={selectedAddress}

                                    onChange={(e) => setSelectedAddress(e.target.value)}
                                    placeholder="Enter new address"

                                ></input>
                                <Link style={{ color: "white" }} onClick={toggleAddressInput} className='checkout-add-address-btn'>
                                    Cancel
                                </Link>
                            </div>
                        )}
                        <button onClick={checkoutClick} className='checkout-pay-btn'>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckOut;
