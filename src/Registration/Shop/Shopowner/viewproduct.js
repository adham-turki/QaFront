
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import photo from '../../../HomePage/imgs/01.jpg';
import { Link } from "react-router-dom";
import { LiaShekelSignSolid } from "react-icons/lia";
import { TiPlusOutline, TiMinusOutline, TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"; // Import star icons
import axios from "axios";
import { Button } from "bootstrap";

function Viewproduct() {

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
    const [clickOnUpdate, setClickOnUpdate] = useState(false);


    const location = useLocation();




    useEffect(() => {
        // const searchParams = new URLSearchParams(location.search);
        //         const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        //         console.log(userData);

        //         if (userData) {
        //             setProductName(userData.productname || '');
        //             setCategory(userData
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        console.log(userData);

        if (userData) {

            /*
              setProductName(userData.productname || '');
//             setCategory(userData.category || '');
//             setBarCode(userData.barCode || '');
//             setPublishDate(userData.publishDate || '');
//             setPrice(userData.price || '');
//             setDescription(userData.description || '');
//             // setProductRate(userData.productRate || '');
//             setShopname(userData.shopname1 || '');
//             setQuantity(userData.quantity || '');
//             setCompanyName(userData.companyname||'');

            */
            setPRoductName(userData.productname || '');
            setCategory(userData.category || '');
            setBarCode(userData.barCode || '');
            setPublishDate(userData.publishDate || '');
            setPrice(userData.price || '');
            setDescription(userData.description || '');
            setProductRate(userData.productRate || '');
            setShopName(userData.shopname1 || '');
            setQuantity(userData.quantity || '');
        }
    }, [location]);



    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const response = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${barCode}/${shopName}`);
                const images = response.data;
                console.log(images.length);

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



    const setImageByFirst = () => {
        setMainImage(image1);
    }
    const setImageBySecound = () => {
        setMainImage(image2);
    }
    const setImageByThired = () => {
        setMainImage(image3);
    }

    const updateProduct = () => {
        setClickOnUpdate(!clickOnUpdate);
    }
    const submitUpdateProduct = async () => {
        try {
            const response = await axios.patch(`http://172.19.44.242:8080/productShop/updateProduct/${shopName}/${barCode}`, {
                quantity: quantity,
                productPrice: price
            });

            alert("Update Successful");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    const deleteProduct = async () => {
        const confirmDelete = window.confirm("Do you want to delete this product?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://172.19.44.242:8080/productShop/deleteAProductByBarcodeFromAShop/${barCode}/${shopName}`);
                alert("Delete successful");
                window.location.href = `/shopowner?data=${encodeURIComponent(JSON.stringify(''))}`;
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        } else {
            console.log("Deletion canceled");
        }
    };

    return (
        <div>


            <div className="header-area">

                <Link to='/shopowner'>
                    <div className="logo1"><span style={{ color: "red", fontSize: "20px" }}>Shop</span ><span style={{ color: "orange", fontStyle: "italic" }}>Page</span> </div>

                </Link>


            </div>

            <div className="product-container10" >
                <div className="product-image10" style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "-180px",
                    marginTop: "10px"
                }}>
                    <img src={mainImage} alt="Main Product" />
                    <div className="orange-line" style={{ margin: "4px 215px 0 2px" }}>

                    </div>
                    <div className="sub-images10">
                        <img onClick={setImageByFirst} src={image1} alt="View 1" />
                        <img onClick={setImageBySecound} src={image2} alt="View 2" />
                        <img onClick={setImageByThired} src={image3} alt="View 3" />
                        <div>
                        </div>
                    </div>
                    {
                        !clickOnUpdate && (
                            <div className="form-row" style={{ paddingTop: "120px", flexDirection: "row" }}>



                                <Link to='/shopowner' style={{ color: "White" }}>
                                    <button className="button">
                                        Back
                                    </button>
                                </Link>
                                <button onClick={updateProduct} className="button" htmlFor="description">Update</button>

                                <button onClick={deleteProduct} className="button" htmlFor="description">
                                    Delete
                                </button>
                            </div>
                        )
                    }



                    {
                        clickOnUpdate && (
                            <div className="form-row" style={{ paddingTop: "120px", flexDirection: "row" }}>

                                <button onClick={updateProduct} className="button" htmlFor="description">
                                    Back
                                </button>
                                <button onClick={submitUpdateProduct} className="button" htmlFor="description">Submit</button>
                            </div>


                        )
                    }

                </div>
                <div className="product-details10">
                    {
                        !clickOnUpdate && (
                            <h1>{productname}</h1>

                        )
                    }

                    {
                        !clickOnUpdate && (
                            <p style={{ fontSize: "20px" }}>Price : {price}  <LiaShekelSignSolid style={{ paddingTop: "5px" }} /></p>

                        )
                    }
                    {
                        !clickOnUpdate && (
                            <div className="additional-details">
                                <div style={{ fontFamily: "bold", fontSize: "20px", paddingTop: "10px" }}>Category: <span> {category}</span>  </div>
                                <p style={{ fontFamily: "bold", fontSize: "20px", paddingTop: "10px" }}>BarCode: <span>{barCode}</span></p>
                                <p style={{ fontFamily: "bold", fontSize: "20px", paddingTop: "10px" }} >Publish Date: <span>{publishDate}</span> </p>
                                <p style={{ fontFamily: "bold", fontSize: "20px", paddingTop: "10px" }} >Shop Name: <span>{shopName}</span> </p>
                                {/* <div>Rating: {renderStars(3.6)}</div> */}
                            </div>
                        )
                    }

                    {
                        !clickOnUpdate && (

                            <div className="quantity10">
                                <label htmlFor="quantity10">Quantity:</label>
                                <input type="number" id="quantity10" name="quantity" min="1" style={{ backgroundColor: "#FFDBAC", borderRadius: "10px" }} value={quantity} readOnly />
                                {/* <TiPlusOutline onClick={incrementQuantity} style={{ cursor: 'pointer' }} />
                            <TiMinusOutline onClick={decrementQuantity} style={{ cursor: 'pointer' }} /> */}
                            </div>
                        )
                    }

                    {
                        !clickOnUpdate && (
                            <div className="description10">
                                <h2>Product Details</h2>
                                <p>{description}</p>
                            </div>

                        )
                    }
                    <div className="product-details10update">
                        {
                            clickOnUpdate && (
                                <div className="form-row" style={{ paddingTop: "120px", flexDirection: "row" }}>
                                    <label className="form-label" htmlFor="numberOfRate">Price</label>
                                    <input
                                        style={{ borderRadius: "10px" }}
                                        type="number"
                                        className="form-input"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            )
                        }




                        {
                            clickOnUpdate && (
                                <div className="form-row" style={{ paddingTop: "120px", flexDirection: "row" }} >
                                    <label className="form-label" htmlFor="numberOfRate">Quantity</label>
                                    <input
                                        style={{ borderRadius: "10px" }}
                                        type="number"
                                        className="form-input"
                                        placeholder="Quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                            )
                        }

                    </div>





                    <div>


                    </div>
                </div>

            </div>
        </div>



    );

}

export default Viewproduct;


























