import React, { useEffect, useState, useRef } from "react";
import './shoppage.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShekelSign } from '@fortawesome/free-solid-svg-icons';
import { FaPlusCircle } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ExistingProduct() {
    const [images, setImages] = useState([null, null, null]);
    const inputRefs = [useRef(null), useRef(null), useRef(null)];
    const [nameproduct, setNameProduct] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [publicDate, setPublicDate] = useState('');
    const [barCode, setBarCode] = useState('');
    const [price, setPrice] = useState('');
    const [shopname, setShopname] = useState('');
    const location = useLocation();
    const [quantity, setQuantity] = useState('');
    const [shopId, setShopId] = useState('');
    const [submit1, setSubmit1] = useState(true);
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

        if (userData.shopid) {
            setShopId(userData.shopid || '');
            setBarCode(userData.productbarcode || '');
            setShopname(userData.shopname || '');
        }
    }, [location]);

    const ImagesForProduct = (index) => {
        if (inputRefs[index].current) {
            inputRefs[index].current.click();
        }
    };

    const imageForProductOnChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...images];
            newImages[index] = file;
            setImages(newImages);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
    };

    const AddproductOnClick = async (e) => {
        e.preventDefault();

        const id = Cookies.get('userid');
        try {
            const res = await axios.get(`http://172.19.44.242:8080/user/${id}`);
            setShopId(res.data.shopOwner.shopID);
            console.log("res " + res.status);

            if (images.every(image => image === null)) {
                toast.error("Please insert at least one image.");
                return;
            }

            try {
                console.log("shop id " + shopId);
                console.log("barcode " + barCode);

                const response = await axios.post(`http://172.19.44.242:8080/productShop/AddanExistingProductbyBarcodeToShop`, {
                    shop: { shopID: shopId },
                    product: { productBarcode: barCode },
                    quantity: quantity,
                    productPrice: price,
                    productDescription: description
                });

                console.log("response2 " + response.status);
                const formData = new FormData();
                images.forEach((image, index) => {
                    if (image) {
                        formData.append('images', image);
                    }
                });

                try {
                    console.log("bar code " + barCode);
                    const response2 = await axios.post(`http://172.19.44.242:8080/productImage/${barCode}/${shopname}`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    console.log("response2 " + response2.status);

                    if (response2) {
                        setSubmit1(true);
                        toast.success("Product added successfully!");
                        window.location.href = `/shopowner?data=${encodeURIComponent(JSON.stringify(''))}`;

                    }
                } catch (error) {
                    toast.error("Error uploading images. Please check your images or barcode.");
                    console.error("Error uploading image:", error);
                }
            } catch (error) {
                console.log("error " + error);
                toast.error("Item already exists.");
                return;
            }

        } catch (error) {
            console.log("error " + error);
            toast.error("Error fetching user data.");
        }
    };

    const addanotherProduct = () => {
        setNameProduct('');
        setCategory('');
        setPrice('');
        setBarCode('');
        setDescription('');
        setImages([null, null, null]);
        setPublicDate('');
        setQuantity('');
        setSubmit1(false);
    };

    return (
        <div className="app-body">
            <ToastContainer />
            <div className="app-container">
                <Link to="/shopowner" className="form-link back-link">
                    <IoMdArrowRoundBack style={{ fontSize: "35px" }} />
                </Link>

                <form className="add-product-form">
                    <div className="form-row-addproduct">
                        <label className="form-label" htmlFor="price">Price</label>
                        <div className="input-group">
                            <input
                                type="number"
                                id="price"
                                className="form-input"
                                value={price}
                                min="0"
                                step="0.01"
                                onChange={(e) => {
                                    const value = Math.max(0, parseFloat(e.target.value));
                                    setPrice(value);
                                }}
                            />
                            <FontAwesomeIcon className="Dolar" icon={faShekelSign} />
                        </div>
                    </div>

                    <div className="form-row-addproduct">
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea id="description" className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className="form-row-addproduct">
                        <label className="form-label" htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            className="form-input"
                            value={quantity}
                            min="0"
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value));
                                setQuantity(value);
                            }}
                        />
                    </div>

                    {images.map((image, index) => (
                        <div key={index} className="form-row-addproduct image-containerforProduct" onClick={() => ImagesForProduct(index)}>
                            <input type="file" ref={inputRefs[index]} style={{ display: "none" }} onChange={(e) => imageForProductOnChange(e, index)} />
                            {image ? (
                                <>
                                    <img src={URL.createObjectURL(image)} alt="Selected" />
                                    <span className="close-icon" onClick={(e) => { e.stopPropagation(); removeImage(index); }}>&times;</span>
                                </>
                            ) : (
                                <div>
                                    <FaPlusCircle size={40} />
                                    <p>Click to add image</p>
                                </div>
                            )}
                        </div>
                    ))}

                    <button type="button" className="form-button" onClick={AddproductOnClick}>Add Product</button>
                </form>
                {!submit1 && (
                    <div className="add-another-product">
                        <button className="form-button" onClick={addanotherProduct}>Add Another Product</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExistingProduct;
