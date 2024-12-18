

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import { data } from "autoprefixer";


function SearchProductByName(){
    const [nameproduct, setNameProdoct] = useState('');
    const location = useLocation();
    const [sortOption, setSortOption] = useState('');
    const [orderOption, setOrderOption] = useState('');
    const [cardsForProduct, setCardsForProduct] = useState([]);
    const [imagesProduct, setImageForProduct] = useState([]);
    const [counter, setCounter] = useState(0);
    const [isHaveData, setIsHaveData] = useState(false);
 
    useEffect(() => {
       const searchParams = new URLSearchParams(location.search);
       const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
       if (userData) {
          setNameProdoct(userData || '');
        
         
       }
 
       
         const fetchData = async () => {
             const requestBody = {
                 productName: userData,
             };
 
           
 
             try {
                 const response = await axios.post(`http://172.19.44.242:8080/productShop/search/numOfPages`, requestBody);
                 if (response.data > 0) {
                     setIsHaveData(true);
                     setCounter(response.data);
                 }
                 setCounter(response.data);
             } catch (error) {
                 console.error("Error in POST request:", error);
             }
 
 
 
             try {
                 const response1 = await axios.post(`http://172.19.44.242:8080/productShop/search/0`,requestBody);
 
                 
                 const data = response1.data;
                 const productsArray = data.map(item => ({
                     barCode: item.ProductBarcode,
                     category: item.ProductCategory,
                     description: item.ProductDescription,
                     productname: item.ProductName,
                     price: item.ProductPrice,
                     quantity: item.ProductQuantity,
                     productRate: item.productRate,
                     numberOfRate: item.numOfRates,
                     publishDate: item.productPublishDate,
                     shopname1: item.ShopName,
                     companyname: item.ProductCompanyName
                 }));
                 setCardsForProduct(data);
 
                 const imagesMap = {};
                 for (const i of data) {
                     try {
                         const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.ProductBarcode}/${i.ShopName}`);
                         const images = response3.data;
                         if (images.length > 0) {
                             let base64Image = images[0];
                             imagesMap[i.ProductBarcode] = base64Image;
                         }
                     } catch (error) {
                         console.log("error" + error);
                     }
                 }
                 setImageForProduct(imagesMap);
 
             } catch (error) {
                 console.log("error " + error);
             }
         };
 
         fetchData();
    }, [location]);
 
    const handleMoveToMain = () => {
       window.location.href = `/homepage?data=${encodeURIComponent(JSON.stringify(""))}`;
    };
 
    const renderStars = (rate) => {
       if (isNaN(rate) || rate < 0) rate = 0;
       if (rate > 5) rate = 5;
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
 
  
    
   const renderCards1 = () => {
    const sortedCards = [...cardsForProduct].sort(
        (a, b) => {
        if (sortOption === "productPrice") {
            return orderOption === "true" ? a.ProductPrice - b.ProductPrice : b.ProductPrice - a.ProductPrice;
        } else if (sortOption === "ProductRate") {
            return orderOption === "true" ? a.productRate - b.productRate : b.productRate - a.productRate;
        } else if (sortOption === "ProductName") {
            return orderOption === "true" ? a.ProductName.localeCompare(b.ProductName) : b.ProductName.localeCompare(a.ProductName);
        } else if (sortOption === "ProductPublishDate") {
            return orderOption === "true" ? new Date(a.productPublishDate) - new Date(b.productPublishDate) : new Date(b.productPublishDate) - new Date(a.productPublishDate);
        } else if (sortOption === "NumOfSales") {
            return orderOption === "true" ? a.NumOfSales - b.NumOfSales : b.NumOfSales - a.NumOfSales;
        }
        return 0;
    }
);

    return sortedCards.map((data, index) => {
        const base64Image = imagesProduct[data.ProductBarcode];
        const imageUrl = base64Image ? `${base64Image}` : null;

        return (
            <div onClick={() => {
                window.location.href = `/viewproductforcustomer?data=${encodeURIComponent(JSON.stringify(data))}`;
            }}
                key={index} className="product-card3">
                {imageUrl && <img className="product-image3" src={imageUrl} alt={data.ProductName} />}
                <hr className="divider3" />
                <div className="card-content3">
                    <p className="product-name3">name: <span>{data.ProductName}</span></p>
                    <p className="product-price3">price: <span>{data.ProductPrice}</span></p>
                    <p className="product-rate3">Rate: {renderStars(data.productRate)}</p>
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

 
     const SearchUsingSort=async()=>{
 
 
        console.log("sort " + sortOption);
        console.log("Ass " + orderOption);
 
         const requestBody = {
             productName: nameproduct,
             sortBy: sortOption, //sort by ProductRate,ProductName,ProductPrice,ProductPublishDate,NumOfSales,....etc
               isAsc: orderOption //true or false
         };
 
 
         try {
             const response = await axios.post(`http://172.19.44.242:8080/productShop/search/numOfPages`, requestBody);
             if (response.data > 0) {
                 setIsHaveData(true);
                 setCounter(response.data);
             }
             setCounter(response.data);
         } catch (error) {
             console.error("Error in POST request:", error);
         }
 
 
 
         try {
             const response1 = await axios.post(`http://172.19.44.242:8080/productShop/search/0`,requestBody);
 
             
             const data = response1.data;
             console.log(data);
             const productsArray = data.map(item => ({
                 barCode: item.ProductBarcode,
                 category: item.ProductCategory,
                 description: item.ProductDescription,
                 productname: item.ProductName,
                 price: item.ProductPrice,
                 quantity: item.ProductQuantity,
                 productRate: item.productRate,
                 numberOfRate: item.numOfRates,
                 publishDate: item.productPublishDate,
                 shopname1: item.ShopName,
                 companyname: item.ProductCompanyName
             }));
             setCardsForProduct(data);
 
             const imagesMap = {};
             for (const i of data) {
                 try {
                     const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.ProductBarcode}/${i.ShopName}`);
                     const images = response3.data;
                     if (images.length > 0) {
                         let base64Image = images[0];
                         imagesMap[i.ProductBarcode] = base64Image;
                     }
                 } catch (error) {
                     console.log("error" + error);
                 }
             }
             setImageForProduct(imagesMap);
 
         } catch (error) {
             console.log("error " + error);
         }
 
         
     }
 
 
     const handlePageClickforMobile = async(index) => {
 
 
         
 
         try {
             const response1 = await axios.post(`http://172.19.44.242:8080/productShop/search/${index}`,{
                 productName: nameproduct,
             });
             const data = response1.data;
             const productsArray = data.map(item => ({
                 barCode: item.ProductBarcode,
                 category: item.ProductCategory,
                 description: item.ProductDescription,
                 productname: item.ProductName,
                 price: item.ProductPrice,
                 quantity: item.ProductQuantity,
                 productRate: item.productRate,
                 numberOfRate: item.numOfRates,
                 publishDate: item.productPublishDate,
                 shopname1: item.ShopName,
                 companyname: item.ProductCompanyName
             }));
             setCardsForProduct(data);
 
             const imagesMap = {};
             for (const i of data) {
                 try {
                     const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.ProductBarcode}/${i.ShopName}`);
                     const images = response3.data;
                     if (images.length > 0) {
                         let base64Image = images[0];
                         imagesMap[i.ProductBarcode] = base64Image;
                     }
                 } catch (error) {
                     console.log("error" + error);
                 }
             }
             setImageForProduct(imagesMap);
 
         } catch (error) {
             console.log("error " + error);
         }
 
     }
    return (
       <div className="category-container">
          <div className="back-icon-container">
             <Link to="/previousPage">
                <FontAwesomeIcon onClick={handleMoveToMain} style={{ color: "orange", fontSize: "30px", paddingLeft: "20px" }} icon={faArrowLeft} />
             </Link>
          </div>
          <div className="sort-container" style={{marginLeft:"1000px"}}>
             <label style={{fontFamily:"Arial"}} htmlFor="sortOption">Sort by: </label>
             <select style={{border:"1px solid orange",borderRadius:"4px"}} id="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
             <option value="">Select</option>
                <option value="productPrice">product Price</option>
                <option value="ProductRate">Product Rate</option>
                <option value="ProductName">Product Name</option>
                <option value="ProductPublishDate">Product PublishDate</option>
                <option value="NumOfSales">Number Of Sales</option>
 
 
             </select>
             <label style={{marginLeft:"40px"}} htmlFor="orderOption">Order: </label>
             <select style={{border:"1px solid orange",borderRadius:"4px"}} id="orderOption" value={orderOption} onChange={(e) => setOrderOption(e.target.value)}>
             <option value="">Select</option>
             <option value="true">Descending</option>
                <option value="false">Ascending</option>
             </select>
             <Link onClick={SearchUsingSort} style={{fontSize:"12px",marginLeft:"10px",color:"red",fontFamily:"Arial"}}>
                 Search
             </Link>
          </div>
         
          <div className="category-line">
             <span className="category-text">product <span style={{ color: "red", fontSize: "20px" }}>'S</span> </span>
          </div>
          <div className="cardcontanerForNewProduct">
             {renderCards1()}
             {
                 isHaveData&&(
                     <div className="pagination">
                     
                     <h1 style={{color:"orange"}}> {"<"}</h1> 
                     {[...Array(counter).keys()].map((index) => (
                     <div key={index + 1} className="pagination-card">
                      <button style={{color:"orange"}} className="pagination-button" onClick={() => handlePageClickforMobile(index )}>
                        {index + 1}
                      </button>
                     </div>
                     ))}
                     <h1 style={{color:"orange"}}>
                     {">"}
                     
                     </h1>
                     
                     </div>
                     )
             }
          </div>
       </div>
    );
}

export default  SearchProductByName;