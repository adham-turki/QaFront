import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import photo from './imgs/im.jpg';
import { Link } from "react-router-dom";
import { LiaShekelSignSolid } from "react-icons/lia";
import { TiPlusOutline, TiMinusOutline, TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"; // Import star icons
import axios from "axios";
// import Photo from '../Registration/Shop/Shopowner/photo.png';
// import Cookies from "js-cookie";


function ViewproductForCustomer() {

  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('');
  const [barCode, setBarCode] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [shopName, setShopName] = useState('');
  const [productRate, setProductRate] = useState(3.6); 
  const[productname,setPRoductName]=useState('');
  const[description,setDescription]=useState('');
  const[price,setPrice]=useState('');
  const[image1,setImage1]=useState(photo);
  const[image2,setImage2]=useState(photo);
  const[image3,setImage3]=useState(photo);
  const[mainImage,setMainImage]=useState(null);
  const [cardsForProduct, setCardsForProduct] = useState([]);
  const [imagesProduct, setImageForProduct] = useState([]);
  const[id,setId]=useState('');



   const location = useLocation(); 



  
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        // console.log(userData);
        // console.log(userData);

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


        const fetchNewProduct = async () => {

          try{
           const  response=await axios.get(`http://172.19.44.242:8080/product/getProductbyBarcode/${userData.ProductBarcode}`);
            setId(response.data.productId);

            try{

              const responseforNew=await axios.get(`http://172.19.44.242:8080/productShop/recommendations/${response.data.productId}`);
              // console.log(responseforNew.data);
              setCardsForProduct(responseforNew.data);
              
        
           
              
            
        
            const imagesMap2 = {};
            
            for (const j of responseforNew.data) {
          
        
        
        
              try {
                const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.ProductBarcode}/${j.ShopName}`);
                // console.log(response3.status);
                const images=response3.data;
                // console.log(images);
                if(images.length>0){
                  let base64Image = images[0];
                  imagesMap2[j.ProductBarcode]=base64Image;
        
                }
        
              } catch (error) {
                console.log("error" + error);
              }
            }
            setImageForProduct(imagesMap2);
          
            
            
            
            }catch(error){
              console.log("error " + error);
            }
          }catch(error){
            console.log(error);
          }

         
      
          
        };
      
        fetchNewProduct();

        
    }, [location]);

  

    useEffect(() => {
      const fetchUserImage = async () => {
          try {
              const response = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${barCode}/${shopName}`);
              const images = response.data;
              // console.log(images.length);

              if (images.length > 0) {
                 setImage1(images[0]);
                 setMainImage(images[0]);
              }

              if(images.length>1){
                setImage2(images[1]);
              }
              if(images.length>2){
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

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  // Renders stars based on the rating
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



  const setImageByFirst=()=>{
    setMainImage(image1);
  }
  const setImageBySecound=()=>{
    setMainImage(image2);
  }
  const setImageByThired=()=>{
    setMainImage(image3);
  }

  const renderCards1 = () => {
    return cardsForProduct.slice(0, 5).map((data, index) => { // Limit to 5 cards
        const base64Image = imagesProduct[data.ProductBarcode];
        const imageUrl = base64Image ? `${base64Image}` : null;

        return (
            <div key={index} className="product-card3" onClick={() => {
                window.location.href = `/viewproductforcustomer?data=${encodeURIComponent(JSON.stringify(data))}`;
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



    return(
        <div>

    <div className="header-area">

    <Link to='/homepage'>  
    <div className="logo1"><span style={{color:"red",fontSize:"20px"}}>Tech</span ><span style={{color:"orange",fontStyle:"italic"}}>Spotter</span> </div>

    </Link>
    <div className="linksHome-containerHome">
      <ul className="linksHome">


      <li> 
        <div className="search-bar-containerforhome">
    <input
    type="text"
    className="search-inputforhome"
    placeholder={"Search on product"}
    style={{
    color: 'white',      // Placeholder text color
    fontStyle: 'italic' // Placeholder text style
    }}

    />
    </div>
          
          
          </li>
          

        <li><a href="#" data-section=".skills">Shops</a></li>
        <li><a href="#" data-section=".about-us">About</a></li>

        
      

      </ul>
      <button className="toggle-menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div className="linksHome-containerHome1">
      <ul className="linksHome">
        
        <li><a  style={{color:'red',fontSize:"13px"}} href="#" data-section=".gallery1">SignIn/SignUp</a></li>
      </ul>
    </div>
    </div>

    <div className="product-container10">
    <div className="product-image10">
              <img src={mainImage} alt="Main Product" />
              <div className="orange-line"></div>
              <div className="sub-images10">
                <img onClick={setImageByFirst}  src={image1} alt="View 1" />
                <img onClick={setImageBySecound}  src={image2} alt="View 2" />
                <img  onClick={setImageByThired} src={image3} alt="View 3" />
              </div>
            </div>
                    <div className="product-details10">
                        <h1>{productname}</h1>
                        <p style={{fontSize:"20px"}}>  {price}  <LiaShekelSignSolid  style={{paddingTop:"5px"}}/></p>
                        <div className="additional-details">
                            <div style={{fontFamily:"bold",fontSize:"20px",paddingTop:"10px"}}> <span> {category}</span>  </div>
                            {/* <p style={{fontFamily:"bold",fontSize:"20px",paddingTop:"10px"}}>BarCode: <span>{barCode}</span></p> */}
                            {/* <p style={{fontFamily:"bold",fontSize:"20px",paddingTop:"10px"}} >Publish Date: <span>{publishDate}</span> </p> */}
                            <p style={{fontFamily:"bold",fontSize:"20px",paddingTop:"10px"}} > <span>{shopName}</span> </p>
                            <div>Rating: {renderStars(3.6)}</div>
                        </div>
                        <div className="quantity10">
                            <label htmlFor="quantity10">Quantity:</label>
                            <input type="number" id="quantity10" name="quantity" min="1" style={{ backgroundColor: "#FFDBAC", borderRadius: "10px" }} value={quantity} readOnly />
                            <TiPlusOutline onClick={incrementQuantity} style={{ cursor: 'pointer' }} />
                            <TiMinusOutline onClick={decrementQuantity} style={{ cursor: 'pointer' }} />
                        </div>
                        <button className="add-to-cart10">ADD TO CART</button>
                        <div className="description10">
                            <h2>Product Details</h2>
                            <p>{description}</p>
                        </div>
                    </div>
                </div>

                <div className="category-line" style={{marginBottom:"20px"}}>
                <span className="category-text" style={{color:"black",fontSize:"15px",fontFamily:"Arial"}}>Related product <span style={{color:"#A9A9A9"}}>'S</span></span>
            </div>
            <div className="cardcontanerForNewProduct">
              {
              renderCards1()

              }
            </div>
            </div>

       
      
    );



}

export default ViewproductForCustomer;
