import React, { useEffect, useState } from "react";
import './homepage.css';
import imagePlaceholder from './imgs/01.jpg'; // Placeholder image for shops without an image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faQuestionCircle, faSignOutAlt, faL, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { FaUser, FaStore, FaBox } from 'react-icons/fa';
import { faHome, faLaptop, faTv, faMobileAlt, faCamera, faHeadphones, faGamepad, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaGithub, FaHome, FaEnvelope, FaPhone, FaPrint } from 'react-icons/fa';

const HomePage = () => {
  const [cardsForTrending, setCardsForTrending] = useState([]);
  const [imagesProduct, setImagesProduct] = useState([]);
  const [cardsForNewProduct, setCardsForNewProduct] = useState([]);
  const [imageForNewProduct, setImageForNewProduct] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopImages, setShopImages] = useState({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
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

    fetchNewProduct();
    fetchTrendingProducts();
    fetchShops();
  }, []);

  const renderCards1 = () => {
    return cardsForTrending.map((data, index) => {
      const base64Image = imagesProduct[data.ProductBarcode];
      const imageUrl = base64Image ? `${base64Image}` : null;
      return (
        <div className="cardForNewProduct" key={index}>
          {imageUrl && <img className="image" src={imageUrl} alt="" />}
          <div className="card-contentforNewProduct">
            <Link onClick={() => { window.location.href = `/viewproductforcustomer?data=${encodeURIComponent(JSON.stringify(data))}`; }} className='btnfornewproduct'>View Product</Link>
          </div>
        </div>
      );
    });
  };

  const renderCards2 = () => {
    return cardsForNewProduct.map((data, index) => {
      const base64Image = imageForNewProduct[data.ProductBarcode];
      const imageUrl = base64Image ? `${base64Image}` : null;
      return (
        <div className="cardForNewProduct" key={index}>
          {imageUrl && <img className="image" src={imageUrl} alt="" />}
          <div className="card-contentforNewProduct">
            <Link onClick={() => { window.location.href = `/viewproductforcustomer?data=${encodeURIComponent(JSON.stringify(data))}`; }} className='btnfornewproduct'>View Product</Link>
          </div>
        </div>
      );
    });
  };

  const renderShops = () => {
    return shops.map((shop, index) => {
      const imageUrl = shopImages[shop.shopName] || imagePlaceholder;
      return (
        <div onClick={()=>{
          window.location.href = `/profileshop?data=${encodeURIComponent(JSON.stringify(shop))}`;

        }} className="shop" key={index}>
          <img src={imageUrl} alt={`Shop ${shop.shopName}`} className="shop-image" />
          <div className="shop-name">{shop.shopName}</div>
        </div>
      );
    });
  };

  const handleSearch = () => {
    console.log(searchText);
    window.location.href = `/searchbyname?data=${encodeURIComponent(JSON.stringify(searchText))}`;
  };

  const handleLabtobs = () => { window.location.href = `/category?data=${encodeURIComponent(JSON.stringify("Laptops"))}`; }
  const handleCamera = () => { window.location.href = `/category?data=${encodeURIComponent(JSON.stringify("Camera"))}`; }
  const handleGamming = () => { window.location.href = `/category?data=${encodeURIComponent(JSON.stringify("Gaming"))}`; }
  const handleHeadPhone = () => { window.location.href = `/category?data=${encodeURIComponent(JSON.stringify("headphones"))}`; }
  const handleMobile = () => { window.location.href = `/category?data=${encodeURIComponent(JSON.stringify("Phons"))}`; }
  const handleOthers = () => { window.location.href = `/category?data=${encodeURIComponent(JSON.stringify("Others"))}`; }
  const handleTV = () => { window.location.href = `/category?data=${encodeURIComponent(JSON.stringify("TV"))}`; }
  const SignInOrSignOut = () => { window.location.href = `/signin?data=${encodeURIComponent(JSON.stringify("TV"))}`; }
  const advanceSerach = () => { window.location.href = `/advancesearch?data=${encodeURIComponent(JSON.stringify(""))}`; }

  return (
    <div className="App">
      <div className="landing-page1">
        <div className="overlay1"></div>
        <div className="containerHome">
          <div className="header-area">
            <Link to='/homepage'>
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

                {/* <li><a href="#" data-section=".about-us">About
                  
                  </a></li> */}
              </ul>
              <button className="toggle-menu">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
            <div className="linksHome-containerHome1">
              <ul className="linksHome">
                <li><a onClick={SignInOrSignOut} style={{ color: 'red', fontSize: "13px" }} href="#" data-section=".gallery1">SignIn/SignUp</a></li>
              </ul>
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

      {/* categoriesHome Section */}
      <section id="categoriesHome">
        <div className="">
          <h2 >Browse By Category</h2>
          <div className="dashboard">
            <div onClick={handleLabtobs} className="carddashbord2">
              <FontAwesomeIcon icon={faLaptop} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
              <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Labtobs</div>
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

      {/* gallery1 Section */}
      <div className="gallery1">
        <div className="containerHome">
          <h2>Trending Products</h2>
          <div className="heading-underline"></div>
          <div className="cardcontanerForNewProduct">
            {renderCards1()}
          </div>
        </div>
      </div>

      <div className="gallery1">
        <div className="containerHome">
          <h2 style={{ paddingTop: "70px" }}>New Products</h2>
          <div className="heading-underline"></div>
          <div className="images-box">
            <div className="cardcontanerForNewProduct">
              {renderCards2()}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {/* <div className="features">
        <h2>Our Features</h2>
        <div className="containerHome">
          <div className="feat-box">
            <img src="imgs/programming.svg" alt="" />
            <h4>Development</h4>
            <p>We are professional marketeers, we will do anything you imagine in no time.</p>
          </div>
          <div className="feat-box">
            <img src="imgs/advertising.svg" alt="" />
            <h4>Marketing</h4>
            <p>We are professional marketeers, we will do anything you imagine in no time.</p>
          </div>
          <div className="feat-box">
            <img src="imgs/hosting-icon.svg" alt="" />
            <h4>Hosting</h4>
            <p>We are professional marketeers, we will do anything you imagine in no time.</p>
          </div>
          <div className="feat-box">
            <img src="imgs/mobile-app.svg" alt="" />
            <h4>Mobile Develop</h4>
            <p>We are professional marketeers, we will do anything you imagine in no time.</p>
          </div>
          <div className="feat-box">
            <img src="imgs/graphic-design.svg" alt="" />
            <h4>Cloud and Servers</h4>
            <p>We are professional marketeers, we will do anything you imagine in no time.</p>
          </div>
          <div className="feat-box">
            <img src="imgs/web-design.svg" alt="" />
            <h4>Seo</h4>
            <p>We are professional marketeers, we will do anything you imagine in no time.</p>
          </div>
          <div className="clearfix"></div>
        </div>
      </div> */}

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
            <p><a href="#">Home</a></p>
            <p><a href="#">wishlist</a></p>
            <p><a href="#" >Cart</a></p>
            <p><a href="#">Order</a></p>
            <p><a href="#" >Help</a></p>
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

export default HomePage;
