import React, { useEffect, useState, useRef } from "react";
import './addnewproduct.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShekelSign } from '@fortawesome/free-solid-svg-icons';
import { FaPlusCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddNewProduct() {
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
    const [isProductAdded, setIsProductAdded] = useState(false);
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));
        setShopname(userData);
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

            if (images.every(image => image === null)) {
                toast.error("Please insert an image");
                return;
            }

            try {
                const response = await axios.post(`http://172.19.44.242:8080/productShop/AddanNewProductToaShop`, {
                    shop: { shopID: res.data.shopOwner.shopID },
                    product: {
                        productName: nameproduct,
                        productBarcode: barCode,
                        productCategory: category,
                        productCompanyName: companyName
                    },
                    quantity: quantity,
                    productPrice: price,
                    productDescription: description
                });

                const formData = new FormData();
                images.forEach((image, index) => {
                    if (image) {
                        formData.append('images', image);
                    }
                });

                try {
                    const response2 = await axios.post(`http://172.19.44.242:8080/productImage/${barCode}/${shopname}`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    if (response2) {
                        setIsProductAdded(true);
                        toast.success("Product added successfully");
                        window.location.href = `/shopowner?data=${encodeURIComponent(JSON.stringify(''))}`;

                    }
                } catch (error) {
                    toast.error("Error uploading image or barcode");
                    console.error("Error uploading image:", error);
                }
            } catch (error) {
                toast.error("Error adding product, check the barcode");
                return;
            }

        } catch (error) {
            toast.error("Error retrieving user information");
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
        setIsProductAdded(false);
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
                        <label className="form-label" htmlFor="name">Name</label>
                        <input type="text" id="name" className="form-input" value={nameproduct} onChange={(e) => setNameProduct(e.target.value)} />
                    </div>
                    <div className="form-row-addproduct">
                        <label className="form-label" htmlFor="category">Category</label>
                        <select id="category" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select category</option>
                            <option value="Laptops">Laptops</option>
                            <option value="TV">TV</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Camera">Camera</option>
                            <option value="Headphones">Headphones</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className="form-row-addproduct">
                        <label className="form-label" htmlFor="price">Price  </label>
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
                        <label className="form-label" htmlFor="barcode">Barcode</label>
                        <input
                            type="text"
                            id="barcode"
                            className="form-input"
                            min="0"

                            value={barCode}
                            onChange={(e) => setBarCode(e.target.value)}
                        />                    </div>
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
                        />   </div>
                    <div className="form-row-addproduct">
                        <label className="form-label" htmlFor="companyName">Company Name</label>
                        <input type="text" id="companyName" className="form-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className="form-row-addproduct image-containerforProduct" onClick={() => ImagesForProduct(0)}>
                        <input type="file" ref={inputRefs[0]} style={{ display: "none" }} onChange={(e) => imageForProductOnChange(e, 0)} />
                        {images[0] ? (
                            <>
                                <img src={URL.createObjectURL(images[0])} alt="Selected" />
                                <span className="close-icon" onClick={(e) => { e.stopPropagation(); removeImage(0); }}>&times;</span>
                            </>
                        ) : (
                            <div>
                                <FaPlusCircle size={40} />
                                <p>Click to add image</p>
                            </div>
                        )}
                    </div>
                    <div className="form-row-addproduct image-containerforProduct" onClick={() => ImagesForProduct(1)}>
                        <input type="file" ref={inputRefs[1]} style={{ display: "none" }} onChange={(e) => imageForProductOnChange(e, 1)} />
                        {images[1] ? (
                            <>
                                <img src={URL.createObjectURL(images[1])} alt="Selected" />
                                <span className="close-icon" onClick={(e) => { e.stopPropagation(); removeImage(1); }}>&times;</span>
                            </>
                        ) : (
                            <div>
                                <FaPlusCircle size={40} />
                                <p>Click to add image</p>
                            </div>
                        )}
                    </div>
                    <div className="form-row-addproduct image-containerforProduct" onClick={() => ImagesForProduct(2)}>
                        <input type="file" ref={inputRefs[2]} style={{ display: "none" }} onChange={(e) => imageForProductOnChange(e, 2)} />
                        {images[2] ? (
                            <>
                                <img src={URL.createObjectURL(images[2])} alt="Selected" />
                                <span className="close-icon" onClick={(e) => { e.stopPropagation(); removeImage(2); }}>&times;</span>
                            </>
                        ) : (
                            <div>
                                <FaPlusCircle size={40} />
                                <p>Click to add image</p>
                            </div>
                        )}
                    </div>
                    <button className="form-button" onClick={AddproductOnClick}>
                        {isProductAdded ? "Add Another Product" : "Add Product"}
                    </button>
                    {isProductAdded && (
                        <button className="form-button" onClick={addanotherProduct}>
                            Add Another Product
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AddNewProduct;
