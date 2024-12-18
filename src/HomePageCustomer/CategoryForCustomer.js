

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";

function CategoryForCustomer() {
    const [category, setCategory] = useState('');
    const location = useLocation();
    const [cardsForProduct, setCardsForProduct] = useState([]);
    const [imagesProduct, setImageForProduct] = useState([]);
    const [counter, setCounter] = useState(0);
    const [isHaveData, setIsHaveData] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        if (userData) {
            setCategory(userData);
        }

        const fetchData = async () => {


            try{

                const response=await axios.get(`http://172.19.44.242:8080/productShop/getNumOfPagesWhenSearchingByCatteg/${userData}`);
                console.log(response.data);
                console.log(response.status);
                if(response.data>0){
                    setIsHaveData(true);
                }
                setCounter(response);
                
            }catch(error){
                console.log(error);
            }


            try {
                const response1 = await axios.get(`http://172.19.44.242:8080/productShop/SearchByCategory/${userData}/${0}`);
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
        window.location.href = `/homepagecustomer?data=${encodeURIComponent(JSON.stringify(""))}`;
    };

    const handlePageClickforMobile = async(index) => {
       
        try {
            const response1 = await axios.get(`http://172.19.44.242:8080/productShop/SearchByCategory/${category}/${index}`);
            const data = response1.data;

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
        return cardsForProduct.map((data, index) => {
            const base64Image = imagesProduct[data.ProductBarcode];
            const imageUrl = base64Image ? `${base64Image}` : null;

 
            return (
                <div  onClick={() => {
                    window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(data))}`;
                  }}
                  key={index} className="product-card3">
                    {imageUrl && <img className="product-image3" src={imageUrl} alt={data.ProductName} />}
                    <hr className="divider3" />
                    <div className="card-content3">
                        <p className="product-name3">name: <span>{data.ProductName}</span></p>
                        <p className="product-price3">price: <span>{data.ProductPrice}</span></p>
                        <p className="product-rate3">Rate: {renderStars(data.productRate)}</p>
                        {/* <button
                            className="view-product-button3"
                            onClick={() => {
                                window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(data))}`;
                            }}
                        >
                            View Product
                        </button> */}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="category-container">
            <div className="back-icon-container">
                <Link to="/homepagecustomer"> {/* Update with the actual path to navigate back */}
                    <FontAwesomeIcon onClick={handleMoveToMain} style={{ color: "orange", fontSize: "30px", paddingLeft: "20px" }} icon={faArrowLeft} />
                </Link>
            </div>
            <div className="category-line">
                <span className="category-text">{category}'S</span>
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

export default CategoryForCustomer;
