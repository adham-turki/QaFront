import React, { useEffect, useState } from "react";
import '../HomePage/homepage.css';
import imagePlaceholder from '../HomePage/imgs/01.jpg'; // Placeholder image for shops without an image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faQuestionCircle, faSignOutAlt, faL, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { FaUser, FaStore, FaBox, FaSign } from 'react-icons/fa';
import { faHome, faLaptop, faTv, faMobileAlt, faCamera, faHeadphones, faGamepad, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { IoHomeOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineLocalShipping,MdFavorite, MdFavoriteBorder,MdLogin,MdLogout } from "react-icons/md"; // Import both filled and outlined heart icons
import photo from '../Registration/Shop/Shopowner/photo.png';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaGithub, FaHome, FaEnvelope, FaPhone, FaPrint } from 'react-icons/fa';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import { BiShekel } from "react-icons/bi";


function HomePageCustomer() {
    const [cardsForTrending, setCardsForTrending] = useState([]);
    const [imagesProduct, setImagesProduct] = useState([]);
    const [cardsForNewProduct, setCardsForNewProduct] = useState([]);
    const [imageForNewProduct, setImageForNewProduct] = useState([]);
    const [shops, setShops] = useState([]);
    const [shopImages, setShopImages] = useState({});
    const [searchText, setSearchText] = useState("");
    const [username, setUsername] = useState('');
    const [main, setMain] = useState(true);
    const [cart, setCart] = useState(false);
    const [favorites, setFavorites] = useState({}); // State to manage favorite status
    const location = useLocation();
    const[id,setId]=useState('');
    
    const [backgroundImage, setBackgroundImage] = useState('');
    const[cardForRecProduct,setCardForRecProduct]=useState([]);
    const[imageforReacProduct,setImageForReacProduct]=useState([]);

   
        useEffect(() => {
            const LandingPage1 = () => {
                const imgsArray = [
                    require('../HomePage/imgs/01.jpg'),
                    require('../HomePage/imgs/02.jpg'),
                    require('../HomePage/imgs/03.jpg'),
                    require('../HomePage/imgs/04.jpg'),
                    require('../HomePage/imgs/05.jpg')
                  ];
          let backgroundOption = true;
          let backgroundInterval;
      
          const randomizeImgs = () => {
            if (backgroundOption) {
              backgroundInterval = setInterval(() => {
                // Get Random Number
                let randomNumber = Math.floor(Math.random() * imgsArray.length);

                setBackgroundImage(`url("../HomePage/imgs/${imgsArray[randomNumber]}")`);
                // Change Background Image Url 
              }, 10000);
            }
          };
      
          randomizeImgs();
      
          // Cleanup interval on component unmount
          return () => clearInterval(backgroundInterval);
       
    };
    LandingPage1();

},);





    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        const customerid = Cookies.get('userid');
        setId(customerid);
        const customername=Cookies.get('customer');
        
        setUsername(customername);
        if (userData) {
            setUsername(userData.userName || '');
        }

        const fetchNewProduct = async () => {
            try {
                const responseforNew = await axios.get(`http://172.19.44.242:8080/productShop/getNewProducts`);
                setCardsForNewProduct(responseforNew.data);

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
                setImageForNewProduct(imagesMap2);
            } catch (error) {
                console.log("error " + error);
            }
        };

        const fetchTrendingProducts = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/productShop/getTrendingProducts`);
                setCardsForTrending(response.data);

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
                console.error('Error fetching trending products:', error);
            }
        };

        const fetchShops = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/shop/getTopVisitedShops`);
                setShops(response.data);

                const imagesMap = {};
                for (const shop of response.data) {
                    try {
                        const response = await axios.get(`http://172.19.44.242:8080/image/${shop.shopName}`, { responseType: 'arraybuffer' });
                        const blob = new Blob([response.data], { type: 'image/jpg' });
                        const url = URL.createObjectURL(blob);
                        imagesMap[shop.shopName] = url;
                    } catch (error) {
                        console.error(`Error fetching image for shop ${shop.shopName}:`, error);
                    }
                }
                setShopImages(imagesMap);
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        };

        const RecommendationProduct=async()=>{

          try{


            const response=await axios.get(`http://172.19.44.242:8080/productShop/getRelatedProds/${customerid}`);
            console.log(response.status);
            console.log(response.data);
            setCardForRecProduct(response.data);

            
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
            setImageForReacProduct(imagesMap2);


          }catch(error){
            console.logg(error);
          }
        }

        fetchNewProduct();
        fetchTrendingProducts();
        fetchShops();
        RecommendationProduct();
    }, []);

    

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
                        alert("Product removed from wishlist");
                    }
                } catch (error) {
                    console.log(error);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

   {/* //////////////////////////////////////////////////////////////////////////////////// */}

    const renderCards1 = () => {
        return cardsForTrending.map((data, index) => {
          const base64Image = imagesProduct[data.ProductBarcode];
          const imageUrl = base64Image ? `${base64Image}` : null;
          const isFavorite = favorites[data.ProductBarcode];
          return (
            <div
             className="cardForNewProduct" key={index}>
              {imageUrl && (
                <div className="image-container">
                  <img className="image" src={imageUrl} alt="" />
                  {isFavorite ? (
                    <MdFavorite className="IconFavorite" onClick={() => handleFavoriteClick(data.ShopName, data.ProductBarcode)} style={{ }} />
                  ) : (
                    <MdFavoriteBorder className="IconFavorite" onClick={() => handleFavoriteClick(data.ShopName, data.ProductBarcode)} style={{  }} />
                  )}
                </div>
              )}
              <div className="card-contentforNewProduct">
                <Link onClick={() => { window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(data))}`; }} className='btnfornewproduct'>View Product</Link>
              </div>
              <div style={{marginBottom:"20px"}}>

                    <p className="product-name3"><span><b>{data.ProductName}</b></span></p>
                      <p className="product-price3"><span>{data.ProductPrice} <BiShekel />  </span></p>
                      <p className="product-rate3"> {data.ShopName}</p>

                      <p className="product-rate3"> {renderStars(data.ProductRate)}</p>
                      


                    </div>
            </div>
          );
        });
      };
    
      useEffect(() => {
        const galleryImages = document.querySelectorAll(".image-container img");
    
        galleryImages.forEach(img => {
          img.addEventListener('click', (e) => {
            // Create Overlay Element
            let overlay = document.createElement("div");
            overlay.className = 'popup-overlay';
            document.body.appendChild(overlay);
    
            // Create The Popup Box
            let popupBox = document.createElement("div");
            popupBox.className = 'popup-box';
    
            // Create The Image
            let popupImage = document.createElement("img");
            popupImage.src = img.src;
            popupBox.appendChild(popupImage);
            document.body.appendChild(popupBox);
    
            // Create The Close Span
            let closeButton = document.createElement("span");
            let closeButtonText = document.createTextNode("X");
            closeButton.appendChild(closeButtonText);
            closeButton.className = 'close-button';
            popupBox.appendChild(closeButton);
          });
        });
    
        const closePopup = (e) => {
          if (e.target.className === 'close-button') {
            e.target.parentNode.remove();
            document.querySelector(".popup-overlay").remove();
          }
        };
    
        document.addEventListener("click", closePopup);
    
        // Cleanup event listeners on component unmount
        return () => {
          galleryImages.forEach(img => {
            img.removeEventListener('click', this);
          });
          document.removeEventListener("click", closePopup);
        };
      }, []);


         {/* //////////////////////////////////////////////////////////////////////////////////// */}


    const renderCards2 = () => {
        return cardForRecProduct.map((data, index) => {
            const base64Image = imageforReacProduct[data.ProductBarcode];
            const imageUrl = base64Image ? `${base64Image}` : null;
            const isFavorite = favorites[data.ProductBarcode];
            return (
                <div className="cardForNewProduct" key={index}>
                    {imageUrl && (
                        
                        <div className="image-container">
                            <img className="image" src={imageUrl} alt="" />
                            {isFavorite ? (
                                <MdFavorite className="IconFavorite" onClick={() => handleFavoriteClick(data.ShopName, data.ProductBarcode)} style={{ }} />
                            ) : (
                                <MdFavoriteBorder className="IconFavorite" onClick={() => handleFavoriteClick(data.ShopName, data.ProductBarcode)} style={{  }} />
                            )}
                        </div>
                    )}
                    <div className="card-contentforNewProduct">
                    
                        <Link onClick={() => { window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(data))}`; }} className='btnfornewproduct'>View Product</Link>
                    </div>
                    <div style={{marginBottom:"20px"}}>

                    <p className="product-name3"><span><b>{data.ProductName}</b></span></p>
                      <p className="product-price3"><span>{data.ProductPrice} <BiShekel />  </span></p>
                      <p className="product-rate3"> {data.ShopName}</p>

                      <p className="product-rate3"> {renderStars(data.ProductRate)}                      </p>


                    </div>
                                    </div>
            );
        });
    };

    
    const renderCards3 = () => {
      return cardsForNewProduct.map((data, index) => {
          const base64Image = imageForNewProduct[data.ProductBarcode];
          const imageUrl = base64Image ? `${base64Image}` : null;
          const isFavorite = favorites[data.ProductBarcode];
          return (
              <div className="cardForNewProduct" key={index}>
                  {imageUrl && (
                      
                      <div className="image-container">
                          <img className="image" src={imageUrl} alt="" />
                          {isFavorite ? (
                              <MdFavorite className="IconFavorite" onClick={() => handleFavoriteClick(data.ShopName, data.ProductBarcode)} style={{ }} />
                          ) : (
                              <MdFavoriteBorder className="IconFavorite" onClick={() => handleFavoriteClick(data.ShopName, data.ProductBarcode)} style={{  }} />
                          )}
                      </div>
                  )}
                  <div className="card-contentforNewProduct">
                  
                      <Link onClick={() => { window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(data))}`; }} className='btnfornewproduct'>View Product</Link>
                  </div>
                  <div style={{marginBottom:"20px"}}>

<p className="product-name3"><span><b>{data.ProductName}</b></span></p>
  <p className="product-price3"><span>{data.ProductPrice} <BiShekel />  </span></p>
  <p className="product-rate3"> {data.ShopName}</p>

  <p className="product-rate3"> {renderStars(data.ProductRate)
    }                      
    
    </p>


</div>
                                  </div>
          );
      });
  };

    const renderShops = () => {
        return shops.map((shop, index) => {
            const imageUrl = shopImages[shop.shopName] || imagePlaceholder;
            return (
                <div onClick={() => {
                    window.location.href = `/shopforcustomer?data=${encodeURIComponent(JSON.stringify(shop))}`;
                }} className="shop" key={index}>
                    <img src={imageUrl} alt={`Shop ${shop.shopName}`} className="shop-image" />
                    <div className="shop-name">{shop.shopName}</div>
                </div>
            );
        });
    };
    

    const MdLogoutClick = () => {
        setCart(false);
        setMain(true);
    };

    const MainClick = () => {
        setCart(false);
        setMain(true);
    };
    

    const cartclick = () => {
        window.location.href = `/cartcustomer?data=${encodeURIComponent(JSON.stringify(searchText))}`;
    };

    const handleSearch = () => {
        window.location.href = `/searchbynamecustomer?data=${encodeURIComponent(JSON.stringify(searchText))}`;
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


    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [addProduct, setAddproduct] = useState(false);
    const [product, setProducts] = useState(true);
    const [Home, setHome] = useState(false);
    const [shopname, setShopname] = useState('');
    const [shopID, setShopId] = useState('');


  
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
      console.log("shop name " + shopname);
      console.log("email " + email);
      console.log("phone  " + phone);
      console.log("shop id " + shopID);
      console.log("user id " + id);
      const pass = Cookies.get('password');
      setPassword(pass);
    };

    const handleLabtobs = () => { window.location.href = `/categoryforcustomer?data=${encodeURIComponent(JSON.stringify("Laptops"))}`; };
    const handleCamera = () => { window.location.href = `/categoryforcustomer?data=${encodeURIComponent(JSON.stringify("Camera"))}`; };
    const handleGamming = () => { window.location.href = `/categoryforcustomer?data=${encodeURIComponent(JSON.stringify("Gaming"))}`; };
    const handleHeadPhone = () => { window.location.href = `/categoryforcustomer?data=${encodeURIComponent(JSON.stringify("headphones"))}`; };
    const handleMobile = () => { window.location.href = `/categoryforcustomer?data=${encodeURIComponent(JSON.stringify("Phons"))}`; };
    const handleOthers = () => { window.location.href = `/categoryforcustomer?data=${encodeURIComponent(JSON.stringify("Others"))}`; };
    const handleTV = () => { window.location.href = `/categoryforcustomer?data=${encodeURIComponent(JSON.stringify("TV"))}`; };
    const advanceSerach = () => { window.location.href = `/advancesearchforcustomer?data=${encodeURIComponent(JSON.stringify(""))}`; };
    const WishListpage=()=>{window.location.href = `/wishlist?data=${encodeURIComponent(JSON.stringify(""))}`;}
    return (
        <div className="App">
            <div className="landing-page1" style={{backgroundImage:backgroundImage}}>
                <div className="overlay1"></div>
                <div className="containerHome">

                    <div className="header-area">
                        <Link to='/homepagecustomer'>
                            <div className="logo1"><span style={{ color: "#F66023", fontSize: "20px" }}>Tech</span ><span style={{ color: "orange", fontStyle: "italic" }}>Spotter</span> </div>
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

                                <div className="iconsss">
                                    <li onClick={MainClick}><a href="#" data-section="Main"><IoHomeOutline style={{ fontSize: "20px",color:"orange" }} /></a></li>
                                    <li onClick={cartclick}><a href="#" data-section="Cart"><FiShoppingCart style={{ fontSize: "20px" }} /></a></li>
                                    <li ><a href="#" data-section="Cart"><MdFavoriteBorder style={{ fontSize: "20px" }} onClick={WishListpage} className="colorFava"/></a></li>
                                    <li ><a href="#" data-section="Cart"><MdOutlineLocalShipping onClick={()=>{

                                    window.location.href = `/orderforcustomer?data=${encodeURIComponent(JSON.stringify(''))}`;          


                                        }} style={{ fontSize: "20px" }} /></a></li>                                   

                                </div>
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
                    <div className="introduction-textHome">
                        <h1 className='h1Home'>We Are <span className='spaneHome'>Creative</span> Tech Spotter</h1>
                        <p className='pHome'>
                            Tech Spotter is a web application that aims to help hardware store
                            owners to save time and energy finding customers and gives them a way
                            to advertise their store.
                        </p>
                    </div>
                </div>
            </div>

            <section id="categoriesHome">
                <div className="">
                    <h2>Browse By Category</h2>
                    <div className="dashboard">
                        <div onClick={handleLabtobs} className="carddashbord2">
                            <FontAwesomeIcon icon={faLaptop} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                            <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Laptops</div>
                        </div>
                        <div onClick={handleTV} className="carddashbord2">
                            <FontAwesomeIcon icon={faTv} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                            <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">TV</div>
                        </div>
                        <div onClick={handleMobile} className="carddashbord2">
                            <FontAwesomeIcon icon={faMobileAlt} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                            <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Mobile</div>
                        </div>
                        <div onClick={handleCamera} className="carddashbord2">
                            <FontAwesomeIcon icon={faCamera} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                            <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Camera</div>
                        </div>
                        <div onClick={handleHeadPhone} className="carddashbord2">
                            <FontAwesomeIcon icon={faHeadphones} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                            <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Head Phone</div>
                        </div>
                        <div onClick={handleGamming} className="carddashbord2">
                            <FontAwesomeIcon icon={faGamepad} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                            <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Gaming</div>
                        </div>
                        <div onClick={handleOthers} className="carddashbord2">
                            <FontAwesomeIcon icon={faEllipsisH} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                            <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Others</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shops Section */}
            <div className="skills">
                <div className="">
                    <h2>Shops</h2>
                    <div className="shop-images-container">
                        {renderShops()}
                    </div>
                </div>
            </div>
   {/* //////////////////////////////////////////////////////////////////////////////////// */}
            {/* gallery1 Section */}
            <div className="gallery1">
                <div className="containerHome">
                    <h2 style={{ paddingTop: "70px" }}>Trending Products</h2>
                    <div className="heading-underline"></div>
                    <div className="images-box">
                        <div className="cardcontanerForNewProduct">
                            {renderCards1()}
                        </div>
                    </div>
                </div>
            </div>
   {/* //////////////////////////////////////////////////////////////////////////////////// */}

            <div className="gallery1">
                <div className="containerHome">
                    <h2 style={{ paddingTop: "70px" }}>New Products</h2>
                    <div className="heading-underline"></div>
                    <div className="images-box">
                        <div className="cardcontanerForNewProduct">
                        {renderCards3()}
                          
                        </div>
                    </div>
                </div>
            </div>

            <div className="gallery1">
                <div className="containerHome">
                    <h2 style={{ paddingTop: "70px" }}>Recommendation product</h2>
                    <div className="heading-underline"></div>
                    <div className="images-box">
                        <div className="cardcontanerForNewProduct">
                        {renderCards2()}
                        </div>
                    </div>
                </div>
            </div>

             {/* Testimonials Section */}
      <div className="testimonials">
        {/* <div className="container"> */}
        
          <h2>Testimonials</h2>
          <div className="ts-box">
            <p>Iam very happy with the product its amazing and i recieve it very fast and the price was amazing.</p>
            <div className="person-info">
              <img src="https://placehold.it/80/DDD" alt="" />
              <h4>Motaz Nammorah</h4>
              <p>Developer</p>
            </div>
          </div>

          <div className="ts-box">
            <p>Iam very happy with the product its amazing and i recieve it very fast and the price was amazing.</p>
            <div className="person-info">
              <img src="https://placehold.it/80/EEE" alt="" />
              <h4>Laith Nader</h4>
              <p>Developer</p>
            </div>
          </div>
          <div className="ts-box">
            <p>Iam very happy with the product its amazing and i recieve it very fast and the price was amazing.</p>
            <div className="person-info">
              <img src="https://placehold.it/80/AAA" alt="" />
              <h4>Mohamad Obaid</h4>
              <p>Developer</p>
            </div>
          </div>
        {/* </div> */}
        <div className="clearfix"></div>
      </div>

            <div className="contact">
       
         {/* Footer */}
         <footer className='footercontact'>
      <section className='social-section'>
        <div className='social-text'>
          <span>Get connected with us on social networks:</span>
        </div>
        <div className='social-icons' style={{ }}>
          <a href='#' className='social-icon'>
            <FaFacebookF />
          </a>
          <a href='#' className='social-icon'>
            <FaTwitter />
          </a>
          <a href='#' className='social-icon'>
            <FaGoogle />
          </a>
          <a href='#' className='social-icon'>
            <FaInstagram />
          </a>
          <a href='#' className='social-icon'>
            <FaLinkedin />
          </a>
          <a href='#' className='social-icon'>
            <FaGithub />
          </a>
        </div>
      </section>

      <section className='links-section'>
        <div className='links-container'>
          <div className='links-column'>
          <Link to='/homepagecustomer'>

          <div className="logo1"><span style={{ color: "#F66023", fontSize: "25px" }}>Tech</span ><span style={{ color: "orange", fontStyle: "italic" }}>Spotter</span> </div>
         </Link>
          <p>
             
            </p>
          </div>

          <div className='links-column'>
            <h6 className='links-title'>Categories</h6>
            <p><a  onClick={handleLabtobs}>Laptops</a></p>
            <p><a  onClick={handleTV}>TV</a></p>
            <p><a  onClick={handleMobile}>Mobile</a></p>
            <p><a onClick={handleGamming}>Gamming </a></p>
            <p><a  onClick={handleHeadPhone}>Headphones</a></p>

          </div>

          <div className='links-column'>
            <h6 className='links-title'>Useful links</h6>
            <p><a >Home</a></p>
            <p><a onClick={WishListpage}>wishlist</a></p>
            <p><a onClick={WishListpage} >Cart</a></p>
            <p><a  onClick={WishListpage}>Order</a></p>
            <p><a onClick={WishListpage} >Help</a></p>
          </div>

          <div className='links-column'>
          <Link to="mailto:nammmotaz@gmail.com">
                        <h2>Contact Us</h2>
            </Link>            
            <p><FaHome /> Ramallah, NN 10012, PL</p>
            <p><FaEnvelope /> nammmotaz@gmail.com</p>
            <p><FaPhone /> +972 59-306-1566</p>
            <p><FaPrint /> +972 59-306-1566</p>
          </div>
        </div>
      </section>

    </footer>
    </div>


      
    </div>

    );
}

export default HomePageCustomer;
