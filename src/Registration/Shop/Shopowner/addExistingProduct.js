import React, { useState, useEffect } from "react";
import './addExistingProduct.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import product from './product.png';
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function AddExistingProduct() {
  const [searchbar, setSearchBar] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [productRate, setProductRate] = useState('');
  const [isExit, setIsExit] = useState(false);
  const [shopid, setShopid] = useState('');
  const [shopname, setShopname] = useState('');
  const location = useLocation();
  const [companyname, setCompanyname] = useState('');


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

    console.log(userData.shopname);

    if (userData) {
      setShopid(userData.shopID || '');
      setShopname(userData.shopname || '');
      console.log("shop id " + shopid);
      console.log("shop name " + shopname);
    }
  }, [location]);

  const fetchProducts = async (barcode) => {
    console.log(barcode);
    try {
      const response = await axios.get(`http://172.19.44.242:8080/product/getProductbyBarcode/${barcode}`);
      console.log(response.status);
      console.log(response.data);

      setName(response.data.productName);
      setCategory(response.data.productCategory);
      setProductRate(response.data.productRate);
      setSearchBar(searchbar);
      setDescription(response.data.productDescription);
      setIsExit(true);
      setCompanyname(response.data.productCompanyName);
    } catch (error) {
      setIsExit(false);
      console.error('Error ', error);
    }
  };

  useEffect(() => {
    console.log(searchbar);
    if (searchbar) {
      fetchProducts(searchbar);
    }
  }, [searchbar]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchProducts(searchbar);
    }
  };

  const SelectProduct = () => {
    const data = {
      productname: name,
      productcatefory: category,
      productbarcode: searchbar,
      productdescription: description,
      productrate: productRate,
      shopname: shopname,
      shopid: shopid
    };

    window.location.href = `/exisitproduct?data=${encodeURIComponent(JSON.stringify(data))}`;
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div>
      <Link to="shopowner" style={{ color: "black", padding: "100px", fontSize: "40px" }} className="back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <div className="search-bar-container" style={{ height: "1vh" }}>
        <input
          type="text"
          className="search-input" style={{ padding: "21px" }}
          placeholder="search by barcode"
          value={searchbar}
          onChange={(e) => setSearchBar(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <FontAwesomeIcon icon={faSearch} style={{ verticalalign: "-1.125em" }} className="search-icon" />
      </div>

      {isExit && (
        <div className="app-bodyE">
          <div className="app-container">
            <div className="cards-container">
              <div className="form-row-addExitproduct image-row-container">
                <div className="image-rowforpreoduct">
                  <div className="image-containerforProductforview">
                    <img className="image" src={product} alt="Product" />
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="form-row-addExitproduct">
                  <label className="form-label" htmlFor="barCode">Product Name</label>
                  <label className="form-input">{name}</label>
                </div>
                <div className="form-row-addExitproduct">
                  <label className="form-label" htmlFor="category">Category</label>
                  <label className="form-input">{category}</label>
                </div>
                <div className="form-row-addExitproduct">
                  <label className="form-label" htmlFor="barCode">Barcode</label>
                  <label className="form-input">{searchbar}</label>
                </div>
                <div className="form-row-addExitproduct">
                  <label className="form-label" htmlFor="companyName">Company Name</label>
                  <label className="form-input">{companyname}</label>
                </div>
                <button className="form-button" style={{ marginTop: "40px" }} onClick={SelectProduct}>Select Product</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AddExistingProduct;
