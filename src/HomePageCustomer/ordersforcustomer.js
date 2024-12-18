


import React, { useEffect, useState } from "react";
import '../HomePage/homepage.css';
import imagePlaceholder from '../HomePage/imgs/01.jpg'; // Placeholder image for shops without an image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { IoHomeOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { TiPlusOutline, TiMinusOutline, TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"; // Import star icons
import Cookies from 'js-cookie';
import { LiaShekelSignSolid } from "react-icons/lia";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md"; // Import filled heart icon
import { FaCartShopping } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import photo from '../Registration/Shop/Shopowner/photo.png';
import { faEdit, faCog, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function OrderForCustomer() {
  const [imagesProduct, setImagesProduct] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [username, setUsername] = useState('');
  const [main, setMain] = useState(true);
  const [cart, setCart] = useState(false);
  const location = useLocation();
  const [cardForCart, setCardForCart] = useState([]);
  const [imageforcardcart, setImageFOrCardCart] = useState([]);
  const [cardsForProduct, setCardsForProduct] = useState([]);
  const [id, setId] = useState('');
  const [favorites, setFavorites] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
const [image, setImage] = useState(null);
    const [email, setEmail] = useState('');    

    const toggleDropdown = () => { 
      setDropdownOpen(!dropdownOpen);
    };

  const handleLogout = () => {
    Cookies.remove('userid');
    Cookies.remove('shopname');
    window.location.href = `/signin?data=${encodeURIComponent(JSON.stringify(''))}`;
  };

  const moveToSetting = () => {
    console.log("user name " + username);
    console.log("user id " + id);
    const pass = Cookies.get('password');
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
    const customerid = Cookies.get('userid');
    setId(customerid);

    if (userData) {
      setUsername(userData.userName || '');
    }

    const fetchForCart = async () => {
        try {
          const response = await axios.get(`http://172.19.44.242:8080/order/getordersforCust/${customerid}/0`);
          setCardForCart(response.data);
      
          const imagesMap2 = {};
          for (const order of response.data) {
            for (const item of order.orderItem) {
              try {
                const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${item.product.ProductBarcode}/${item.product.ShopName}`);
                const images = response3.data;
                if (images.length > 0) {
                  let base64Image = images[0];
                  imagesMap2[item.product.ProductBarcode] = base64Image;
                }
              } catch (error) {
                console.log("error" + error);
              }
            }
          }
          setImageFOrCardCart(imagesMap2);
        } catch (error) {
          console.log(error);
        }
      };
      

    const fetchRecomndationProduct = async () => {
      try {
        const response = await axios.get(`http://172.19.44.242:8080/productShop/recommendations/${customerid}`);
        setCardsForProduct(response.data);

        const imagesMap2 = {};
        for (const j of response.data) {
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
        setImagesProduct(imagesMap2);

      } catch (error) {
        console.log(error);
      }
    }

    fetchForCart();
    fetchRecomndationProduct();
  }, [location.search]);

  const removeProductFromCart = async (shopname, barcode) => {
    try {
      const response = await axios.delete(`http://172.19.44.242:8080/shoppingCart/deleteProductFromACart/${id}/${shopname}/${barcode}`);
      if (response.status == 200) {
        alert("Remove product form cart ");
        try {
          const response = await axios.get(`http://172.19.44.242:8080/shoppingCart/getCartItems/${id}`);
          setCardForCart(response.data);

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
          setImageFOrCardCart(imagesMap2);
        } catch (error) {
          console.log(error);
        }

      }
    } catch (error) {
      console.log(error);
    }

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

  const handleFavoriteClick = async (shopname, productBarcode) => {
    const isFavorite = favorites[productBarcode];
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [productBarcode]: !prevFavorites[productBarcode]
    }));

    if (!isFavorite) {
      try {
        const response = await axios.post(`http://172.19.44.242:8080/wishlist/addProductToWishList/${id}/${shopname}/${productBarcode}`);
        if (response.status === 200) {
          alert("Product added to wishlist");
        }
      } catch (error) {
        console.log("Error adding product to wishlist:", error);
      }
    } else {
      try {
        const response = await axios.get(`http://172.19.44.242:8080/product/getProductbyBarcode/${productBarcode}`);
        try {
          const response2 = await axios.delete(`http://172.19.44.242:8080/wishlist/deleteProductFromWishList/${id}/${response.data.productId}`);
          if (response2.status === 200) {
            alert("product Remove from wishlist");
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const rendercardsForCart = () => {
    return cardForCart.map((order, index) => {
      return order.orderItem.map((cartItem, itemIndex) => {
        const image1 = imageforcardcart[cartItem.product.ProductBarcode];
        const image = image1 ? `${image1}` : null;
        const isFavorite = favorites[cartItem.product.ProductBarcode];
  
        return (
          <tr key={`${index}-${itemIndex}`} className="cart-item">
            <td>
              {image && (
                <img
                  onClick={() => {
                    window.location.href = `/viewprodcustomer?data=${encodeURIComponent(
                      JSON.stringify(cartItem.product)
                    )}`;
                  }}
                  className="product-image"
                  src={image}
                  alt="Placeholder"
                />
              )}
            </td>
            <td>
              <p className="cart-item-text"> {cartItem.product.ProductName} </p>
            </td>
            <td>
              <p className="cart-item-text">{renderStars(cartItem.product.ProductRate)}</p>
            </td>
            <td>
              <p className="cart-item-text">
                {cartItem.product.ProductPrice} <LiaShekelSignSolid style={{ paddingTop: "5px" }} />
              </p>
            </td>
            <td>
              <p className="cart-item-text">{cartItem.product.ProductCategory}</p>
            </td>

            <td>
              <p className="cart-item-text">{cartItem.orderItemStats}</p>
            </td>
            <td>
            
              <button
                onClick={() => {
                    window.location.href = `/viewprodcustomer?data=${encodeURIComponent(
                      JSON.stringify(cartItem.product)
                    )}`;
                  }}
                style={{ marginRight: "5px" }}
                className="btn-warning"
              >
                
                View 
              </button>
            </td>
          </tr>
        );
      });
    });
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
            <p className="product-name3">name: <span>{data.ProductName}</span></p>
            <p className="product-price3">price: <span>{data.ProductPrice}</span></p>
            <p className="product-rate3">Rate: {renderStars(3)}</p>
            <button
              className="view-product-button3"
              onClick={() => {
                window.location.href = `/viewproduct?data=${encodeURIComponent(JSON.stringify(data))}`;
              }}
            >
              View Product
            </button>
          </div>
        </div>
      );
    });
  };

  const MainClick = () => {
    window.location.href = `/homePageCustomer?data=${encodeURIComponent(JSON.stringify(""))}`;
  };

  const cartclick = () => {
    window.location.href = `/cartcustomer?data=${encodeURIComponent(JSON.stringify(searchText))}`;
  };

  const handleSearch = () => {
    window.location.href = `/searchbynamecustomer?data=${encodeURIComponent(JSON.stringify(searchText))}`;
  };

  const SignInOrSignOut = () => { window.location.href = `/signin?data=${encodeURIComponent(JSON.stringify("TV"))}`; }
  const advanceSerach = () => { window.location.href = `/advancesearchforcustomer?data=${encodeURIComponent(JSON.stringify(""))}`; }

  const wishlistpage = () => {
    window.location.href = `/wishlist?data=${encodeURIComponent(JSON.stringify(''))}`;
  }


  const handleCheckout =async () => {

    

    
    window.location.href = `/checkout?data=${encodeURIComponent(JSON.stringify(''))}`;
  }

  return (
    <div className="App">
      <div className="header-area">
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
            <li onClick={cartclick}><a href="#" data-section="Cart"><FiShoppingCart style={{ fontSize: "20px" }} /></a></li>
            <li onClick={wishlistpage} ><a href="#" data-section="Cart"><MdFavoriteBorder style={{ fontSize: "20px" }} className="colorFava"/></a></li>
            <li ><a href="#" data-section="Cart"><MdLocalShipping  style={{ fontSize: "20px",color:"orange" }} /></a></li>

          </ul>
        </div>
       
       
        <div className="linksHome-containerHome1">
                        <div className="profile-section">
        <div className="profile-button" onClick={toggleDropdown}>
          {image ?
            <img className="imageafter" src={image} width={30} alt="" />
            : <img width={30} className="imagebefor" src={photo} alt="" />
            
          }
          {/* <a style={{ color: '#F66023', fontSize: "20px",position: "fixed", top: "57px" }} href="#">{username}</a> */}
   
          {dropdownOpen && (
            <div className="dropdown-menu" style={{top: "81px", left: "91%"}}>
               
              <div className="dropdown-header">
                {image ? <img src={image} width={40} alt="" /> : <img width={40} src={photo} alt="" />}
                <div className="user-info">
                  <span className="username">{username}</span>
                  <span className="email">{email}</span>
                </div>
              </div>
              <ul>
                <li onClick={moveToSetting}>
                  <FontAwesomeIcon icon={faCog} className="icon" />
                  <span style={{color:"black"}}>Settings & Privacy</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
                  <span style={{color:"black"}}>Help & Support</span>
                </li>
                <li onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                  <span  style={{color:"black"}}>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
         </div>
      </div>

      <section className="cart-section">
        <div className="row-center">
          <div className="col-full">
            <h3 className="cart-title">Order <span className="cart-title-highlight">'S</span> </h3>
            <div className="overflow-container">
              <table className="cart-table">
                <tbody>
                  {rendercardsForCart()}
                </tbody>
              </table>
            </div>
           
          </div>
        </div>
      </section>

      <div className="category-line" style={{ marginBottom: "20px" ,marginTop:"200px"}}>
        <span className="category-text" style={{ color: "black" }}>You may like</span>
      </div>
      <div className="card-containerr">
        {renderCards1()}
      </div>
    </div>
  );
}

export default OrderForCustomer;
