import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShekelSign } from '@fortawesome/free-solid-svg-icons';

function AdvanceSearch() {
    const [nameProduct, setNameProduct] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const clickOnSearch = (e) => {
        e.preventDefault(); // Prevent the default form submit action
        const searchData = {
            nameProduct,
            category,
            condition,
            minPrice,
            maxPrice
        };
       
        window.location.href = `/searchProducts?data=${encodeURIComponent(JSON.stringify(searchData))}`;

    }

    return (
        <div className="app-body">
            <div className="app-containerAdvance">
                <Link to="/homepage" className="form-link back-link">
                    <IoMdArrowRoundBack style={{ fontSize: "35px", marginBottom: "50px" }} />
                </Link>
                <h2 style={{ marginLeft: "20px", fontFamily: "Times New Roman" }}>Find Product</h2>
                <div className="orange-line" style={{ marginBottom: "50px" }}></div>
                <form className="search-advance-product">
                    <div className="form-row" style={{ marginTop: "40px" }}>
                        <label style={{ padding: "10px", fontFamily: "Arial" }} className="form-label" htmlFor="name-input">Name</label>
                        <input style={{ marginRight: "200px" }} type="text" id="name-input" placeholder="Product name" className="form-input" value={nameProduct} onChange={(e) => setNameProduct(e.target.value)} />
                    </div>

                    <div className="form-row" style={{ marginTop: "40px" }}>
                        <label style={{ padding: "10px", fontFamily: "Arial" }} className="form-label" htmlFor="category-select">Category</label>
                        <select style={{ marginRight: "200px" }} id="category-select" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select category</option>
                            <option value="Laptops">Laptops</option>
                            <option value="TV">TV</option>
                            <option value="Phones">Phones</option>
                            <option value="Camera">Camera</option>
                            <option value="Headphones">Headphones</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div className="form-row" style={{ marginTop: "40px" }}>
                        <label style={{ padding: "10px", fontFamily: "Arial" }} className="form-label" htmlFor="condition-select">Condition</label>
                        <select style={{ marginRight: "200px" }} id="condition-select" className="form-input" value={condition} onChange={(e) => setCondition(e.target.value)}>
                            <option value="anycondition">Any Condition</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>

                    <div style={{ marginTop: "30px" }}>
                        <label style={{ padding: "10px", fontFamily: "Arial", marginRight: '550px' }} className="form-label">Price:</label>
                    </div>

                    <div className="form-row" style={{ marginBottom: "50px" }}>
                        <FontAwesomeIcon icon={faShekelSign} style={{ paddingTop: "5px", fontSize: "20px" }} />
                        <input placeholder="Min price" style={{ marginRight: "10px" }} type="text" id="min-price-input" className="form-input" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                        to
                        <FontAwesomeIcon icon={faShekelSign} style={{ paddingTop: "5px", fontSize: "20px" }} />
                        <input style={{ marginLeft: "10px" }} placeholder="Max price" type="text" id="max-price-input" className="form-input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                    </div>

                    <button onClick={clickOnSearch} type="submit" className="form-button">Search</button>
                </form>
            </div>
        </div>
    );
}

export default AdvanceSearch;
