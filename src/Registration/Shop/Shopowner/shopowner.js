import React, { useEffect, useState } from "react";
import './shoppage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faQuestionCircle, faSignOutAlt, faL } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";
import photo from './photo.png';
import city from './city.jpg';
import axios from "axios";
import Cookies from 'js-cookie';
import aboutUsPhoto from './About.jpeg';
import { FaUser, FaStore, FaBox } from 'react-icons/fa';
import { faHome, faLaptop, faTv, faMobileAlt, faCamera, faHeadphones, faGamepad, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { data } from "autoprefixer";
import { GiCheckMark } from "react-icons/gi";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BiShekel } from "react-icons/bi";
import Chart from "react-apexcharts";
import { TiPlusOutline, TiMinusOutline, TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"; // Import star icons


function Shoppage() {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addProduct, setAddproduct] = useState(false);
  const [product, setProducts] = useState(true);
  const [Home, setHome] = useState(false);
  const [address, setAddress] = useState(false);
  const [dashbord1, setDashbord1] = useState(false);
  const [about, setAbout] = useState(false);
  const [id, setId] = useState('');
  const [cardData, setCardData] = useState([]);
  const [cardsForProduct, setCardsForProduct] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shopname, setShopname] = useState('');
  const location = useLocation();
  const [imagesProduct, setImagesProduct] = useState([]);
  const [shopID, setShopId] = useState('');
  const [password, setPassword] = useState('');
  const [numberOfRate, setNumberOfrate] = useState('');
  const [productRate, setProductRate] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [productId, setProductId] = useState('');
  const [shopname1, setShopname1] = useState('');
  const [shopId2, setShopId2] = useState('');
  const [numberofPersons, setNumberOfPerson] = useState('');
  const [numberofshop, setNumberOfShop] = useState('');
  const [numberofProduct, setNumberOfProduct] = useState('');
  const [Clicklabtobs, setClickLabtob] = useState(false);
  const [clickTV, setClickTV] = useState(false);
  const [clickMobile, setClickMobile] = useState(false);
  const [clickCamera, setClickCamera] = useState(false);
  const [clickHeadPhone, setClickHeadPhone] = useState(false);
  const [ClickGamming, setClickGamming] = useState(false);
  const [clickOthers, setClickOthers] = useState(false);
  const [counter, setCounter] = useState(0);
  const [categoriesForProduct, setCategoriesForProduct] = useState('');
  const [paggingnumber, setPagingnumber] = useState(0);
  const [isHaveAproduct, setIsHaveAproduct] = useState(false);
  const [mainPage, setMainPage] = useState(true);
  const [isExit, setIsExit] = useState(false);
  const [searchbar, setSearchBar] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [productname, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageForSearch, setImageForSearch] = useState(null);
  const [description, setDescription] = useState('');
  const [barcode, setBarCode] = useState('');
  const [statusoforder, setStatusOfOrder] = useState('');
  const [clickpadning, setClickPanding] = useState(false);
  const [clickAccepted, setClickAccepted] = useState(false);
  const [clickShipped, setClickShippded] = useState(false);
  const [clickAll, setClickAll] = useState(true);
  const [arrayoforder, setArrayOfOrder] = useState([]);
  const [imagefororderproduct, setImageFororderproduct] = useState([]);



  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-line"
      },
      xaxis: {
        categories: []
      }
    },
    series: [{
      name: 'Total Sales',
      data: [],
      color: '#FFA500'
    }]
  });

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get(`http://172.19.44.242:8080/orderitem/getMonthlySales/2/07`);// change to real month @Laith
        const data = response.data;

        console.log("Fetched data:", data);

        const categories = data.map(item => item.day + "/07"); //change to real Month @laith
        const seriesData = data.map(item => item.totalPrice); //add NIS Symbol @laith

        console.log("Categories:", categories);
        console.log("Series Data:", seriesData);

        setChartData({
          options: {
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories: categories
            }
          },
          series: [{
            name: 'Total Sales',
            data: seriesData
          }]
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMonthlySales();
  }, []);







  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userData = JSON.parse(decodeURIComponent(searchParams.get('data')));

    if (userData) {
      setUsername(userData.userName || '');
      setId(userData.userid);
    }
  }, [location]);

  useEffect(() => {
    if (!id) {
      const userDataId = Cookies.get('userid');
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://172.19.44.242:8080/user/${userDataId}`);
          setShopId(response.data.shopOwner.shopID);
          setEmail(response.data.userEmail);
          setUsername(response.data.userName);
          setShopname(response.data.shopOwner.shopName);
          setPhone(response.data.userPNum);
          setId(response.data.userid);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [id]);

  useEffect(() => {
    if (shopID) {
      fetchProducts();
    }
  }, [shopID]);

  useEffect(() => {
    const fetchUserImage = async () => {

      try {
        const response = await axios.get(`http://172.19.44.242:8080/image/${shopname}`, { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], { type: 'image/jpg' });
        setImage(blob);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    if (id) {
      fetchUserImage();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await axios.get(`http://172.19.44.242:8080/image/${shopname}`, { responseType: 'arraybuffer' });
        if (response.data) {
          const blob = new Blob([response.data], { type: 'image/jpg' });
          setImage(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };


    if (id) {
      fetchUserImage();
    }
  }, [id, shopname]);

  const fetchProducts = async () => {
    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getAllProductsNumOfPages/${shopID}`);
      console.log(resp.data);
      setCounter(resp.data);
      if (resp.data > 0) {
        setIsHaveAproduct(true);
      }
    } catch (error) {
      console.log("error " + error);
    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/${shopID}/${paggingnumber}`);
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
        shopname1: shopname,
        companyname: item.ProductCompanyName
      }));
      setCardsForProduct(productsArray);

      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
          }
        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }
  };




  const handleImageOnChange = async (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    const shop = Cookies.get("shopname");
    if (!shop) {
      console.error("Shop name not found in cookies");
      return;
    }

    try {
      await axios.post(`http://172.19.44.242:8080/image/${shop}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    Cookies.remove('userid');
    Cookies.remove('shopname');
    window.location.href = `/signin?data=${encodeURIComponent(JSON.stringify(''))}`;
  };

  const addproduct = () => {
    setAddproduct(true);
    setProducts(false);
    setAbout(false);
    setHome(false);
    setAddress(false);
    setDropdownOpen(false);
    setDashbord1(false);

  };

  const products = () => {
    setProducts(true);
    setCardsForProduct([]);
    setAbout(false);
    setHome(false);
    setAddress(false);
    setDropdownOpen(false);
    setDashbord1(false);

    setAddproduct(false);
  };

  const Address = async (e) => {
    e.preventDefault();
    setAddress(true);
    setDropdownOpen(false);
    setAddproduct(false);
    setDashbord1(false);

    setProducts(false);
    setAbout(false);

    try {
      const response = await axios.get(`http://172.19.44.242:8080/address/getaddresses/${id}`);
      setCardData(response.data.map(addr => ({
        addID: addr.addID,
        governorate: addr.governorate,
        city: addr.city,
        town: addr.town,
        streetNo: addr.streetNo,
        departmentNumber: addr.depNo,
        userid: id,
        moreInformation: addr.moreDetails,
        phoneNumber: phone
      })));
    } catch (error) {
      console.log(error);
    }
  };

  const AboutUs = () => {
    setAbout(true);
    setDropdownOpen(false);
    setAddress(false);
    setAddproduct(false);
    setProducts(false);
    setDashbord1(false);
  };

  const renderCards = () => {
    return cardData.map((data, index) => (
      <div key={index} className="card1">
        <img className="image" src={city} alt="" />
        <div className="card-content">
          <h1 className="h1">Address</h1>
          <p className="p"> City : <strong style={{ color: "black" }}>{data.city}</strong> </p>
          <p className="p"> Governorate :<strong style={{ color: "black" }}>{data.governorate}</strong> </p>
          <p className="p">Town : <strong style={{ color: "black" }}>{data.town}</strong> </p>
          <p className="p">Street number:  <strong style={{ color: "black" }}>{data.streetNo}</strong> </p>
          <p className="p">More Information : <strong style={{ color: "black" }}>{data.moreInformation}</strong> </p>
          <p className="p"> Phone : <strong style={{ color: "black" }}> {data.phoneNumber} </strong></p>
          <button className="button" style={{ margin: "-8px" }} onClick={() => {
            window.location.href = `/changeAddress?data=${encodeURIComponent(JSON.stringify(data))}`;
          }} >Update</button>
        </div>
      </div>
    ));
  };
  const renderCards1 = () => {
    return cardsForProduct.map((data, index) => {
      const base64Image = imagesProduct[data.barCode];
      // console.log(base64Image)
      const imageUrl = base64Image ? `${base64Image}` : null;

      return (
        <div
          onClick={() => {
            window.location.href = `/viewproduct?data=${encodeURIComponent(JSON.stringify(data))}`;
          }}
          key={index}
          className="card"
        >
          {imageUrl && <img className="image" src={imageUrl} alt={data.productname} />}
          <div className="card-content">
            <p className="p"> <strong style={{ color: "black", paddingRight: "30px" }}>{data.productname}</strong></p>
            <p className="p"> <strong style={{ color: "black", paddingRight: "30px" }}>{data.quantity}</strong></p>
            <p className="p"> <strong style={{ color: "black" }}>{data.price}</strong></p>
            <button className="view-product-button">View Product</button>
          </div>
        </div>
      );
    });
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


    const userProfile = {
      "username": username,
      "shopname": shopname,
      "email": email,
      "phone": phone,
      "shopid": shopID,
      "userId": id,
      "password": password
    }

    window.location.href = `/setting?data=${encodeURIComponent(JSON.stringify(userProfile))}`;


  }

  const moveTOAddNewProdut = () => {
    window.location.href = `/addnewproduct?data=${encodeURIComponent(JSON.stringify(shopname))}`;
  };


  const AddExistingProduct = () => {
    const data = {
      shopID: shopID,
      "shopname": shopname
    };
    window.location.href = `/addexsistingproduct?data=${encodeURIComponent(JSON.stringify(data))}`;

  }

  const dashbord = async () => {
    console.log("laith ");

    setProducts(false);
    setAddproduct(false);
    setAbout(false);
    setAddress(false);
    setDashbord1(true);
    setDropdownOpen(false);

    try {

      const response = await axios.get(`http://172.19.44.242:8080/user/users`);
      console.log(response.data);


      let countStatus0 = 0;
      let countStatus1 = 0;
      for (const i of response.data) {
        if (i.status == 1) {
          countStatus1++;
        } else {
          countStatus0++;
        }


      }

      setNumberOfShop(countStatus1);
      setNumberOfPerson(countStatus0);



    } catch (error) {
      console.log("error " + error);
    }



    try {


      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProductsForaShop/${shopID}`);


      if (Array.isArray(response1.data)) {
        const length = response1.data.length;
        setNumberOfProduct(length);
      } else {
        console.log("Data is not an array");
      }
    } catch (error) {
      console.log("error " + error);
    }



  }

  const clickOnHomePage = async () => {
    setClickTV(false);
    setCategoriesForProduct('');
    setCardsForProduct([]);
    setClickLabtob(false);
    setClickCamera(false);
    setSearchBar('');
    setClickHeadPhone(false);
    setClickOthers(false);
    setClickGamming(false);
    setClickMobile(false);
    setMainPage(true);

    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getAllProductsNumOfPages/${shopID}`);
      console.log(resp.data);
      setCounter(resp.data);
      if (resp.data > 0) {
        setIsHaveAproduct(true);

      }
    } catch (error) {
      console.log("error " + error);
    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {


        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
            // console.log("laith");
          }
        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }






  };
  const handleLabtob1 = async () => {
    setClickTV(false);
    setCategoriesForProduct('');
    setCardsForProduct([]);
    setClickLabtob(true);
    setSearchBar('');
    setClickCamera(false);
    setClickHeadPhone(false);
    setClickOthers(false);
    setClickGamming(false);
    setClickMobile(false);
    setMainPage(false);


    setCategoriesForProduct("Laptops");


    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getNumOfPages/Laptops/${shopID}`);
      setCounter(resp.data);
      // console.log(resp.status);
      if (resp.data > 0) {
        console.log("counter grater");
        setIsHaveAproduct(true);
      }

    } catch (error) {
      console.log("error " + error);

    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/Laptops/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
            console.log("laith");
          }

        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }







  }

  const handleTV = async () => {
    setClickTV(true);
    setCategoriesForProduct('');
    setCardsForProduct([]);
    setClickLabtob(false);
    setClickCamera(false);
    setMainPage(false);
    setSearchBar('');
    setClickHeadPhone(false);
    setClickOthers(false);
    setClickGamming(false);
    setClickMobile(false);
    setCategoriesForProduct("TV");


    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getNumOfPages/TV/${shopID}`);
      console.log(resp.data);
      console.log(resp.status);
      setCounter(resp.data);
      console.log("laith nemer");
      if (resp.data > 0) {
        console.log("counter grater");
        setIsHaveAproduct(true);
      }

    } catch (error) {
      console.log("error " + error);

    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/TV/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
            console.log("laith");
          }

        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }






  }

  const handleMobile = async () => {
    setClickTV(false);
    setCardsForProduct([]);
    setClickLabtob(false);
    setClickCamera(false);
    setClickHeadPhone(false);
    setClickOthers(false);
    setSearchBar('');
    setClickGamming(false);
    setClickMobile(true);
    setCategoriesForProduct("Phons");
    setMainPage(false);
    console.log(categoriesForProduct);



    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getNumOfPages/Mobile/${shopID}`);
      console.log(resp.data);
      console.log(resp.status);
      setCounter(resp.data);
      if (resp.data > 0) {
        console.log("counter grater");
        setIsHaveAproduct(true);
      }

    } catch (error) {
      console.log("error " + error);

    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/Mobile/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
            console.log("laith");
          }

        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }




  }

  const handleCamera = async () => {
    setClickTV(false);
    setCardsForProduct([]);
    setClickLabtob(false);
    setClickCamera(true);
    setClickHeadPhone(false);
    setClickOthers(false);
    setSearchBar('');
    setClickGamming(false);
    setClickMobile(false);
    setMainPage(false);

    setCategoriesForProduct("Camera");





    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getNumOfPages/Camera/${shopID}`);
      console.log(resp.data);
      console.log(resp.status);
      setCounter(resp.data);
      if (resp.data > 0) {
        console.log("counter grater");
        setIsHaveAproduct(true);
      }

    } catch (error) {
      console.log("error " + error);

    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/Camera/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
          }

        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }









  }


  const handleGaming = async () => {
    setClickTV(false);
    setClickLabtob(false);
    setCardsForProduct([]);
    setClickCamera(false);
    setClickHeadPhone(false);
    setClickOthers(false);
    setClickGamming(true);
    setClickMobile(false);
    setMainPage(false);
    setSearchBar('');


    setCategoriesForProduct("Gaming");

    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getNumOfPages/Gaming/${shopID}`);
      console.log(resp.data);
      console.log(resp.status);
      setCounter(resp.data);
      if (resp.data > 0) {
        console.log("counter grater");
        setIsHaveAproduct(true);
      }

    } catch (error) {
      console.log("error " + error);

    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/Gaming/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
            console.log("laith");
          }

        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }







  }

  const handleOthers = async () => {
    setClickTV(false);
    setCardsForProduct([]);
    setClickLabtob(false);
    setClickCamera(false);
    setClickHeadPhone(false);
    setClickOthers(true);
    setMainPage(false);
    setSearchBar('');
    setClickGamming(false);
    setClickMobile(false);
    setCategoriesForProduct("Others");

    console.log(categoriesForProduct);

    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getNumOfPages/Others/${shopID}`);
      console.log(resp.data);
      console.log(resp.status);
      setCounter(resp.data);
      if (resp.data > 0) {
        console.log("counter grater");
        setIsHaveAproduct(true);
      }

    } catch (error) {
      console.log("error " + error);

    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/Others/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
            console.log("laith");
          }

        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }





  }

  const handleHeadPhone = async () => {
    setClickTV(false);
    setClickLabtob(false);
    setCardsForProduct([]);
    setClickCamera(false);
    setClickHeadPhone(true);
    setClickOthers(false);
    setClickGamming(false);
    setClickMobile(false);
    setMainPage(false);
    setSearchBar('');
    setCategoriesForProduct("headphones");

    console.log(categoriesForProduct);

    try {
      const resp = await axios.get(`http://172.19.44.242:8080/productShop/getNumOfPages/headphones/${shopID}`);
      console.log(resp.data);
      console.log(resp.status);
      setCounter(resp.data);
      if (resp.data > 0) {
        console.log("counter grater");
        setIsHaveAproduct(true);
      }

    } catch (error) {
      console.log("error " + error);

    }

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/headphones/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
            console.log("laith");
          }

        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }




  }

  const handlePagination = async (pageNumber) => {
    // Add functionality to handle page click, e.g., navigate to the selected page
    console.log("Clicked page number:", pageNumber);

    setPagingnumber(pageNumber);



    console.log("category for product in paging " + categoriesForProduct);
    console.log("pagging number " + paggingnumber);
    console.log("shop id " + shopID);

    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/${categoriesForProduct}/${shopID}/${pageNumber}`);
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
        // numberOfRate:item.numOfRates,
        publishDate: item.productPublishDate,
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
            console.log("laith");
          }

        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }

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




  const fetchProducts2 = async (barcode) => {
    console.log(barcode);

    console.log("shop name  " + shopname);
    try {
      const response = await axios.get(`http://172.19.44.242:8080/productShop/${shopname}/${barcode}`);
      console.log(response.status);
      console.log(response.data);
      setProductName(response.data.ProductName);
      setPrice(response.data.ProductPrice);
      setQuantity(response.data.ProductQuantity);
      setPublishDate(response.data.ProductPublishDate);
      setCategory(response.data.ProductCategory);
      setDescription(response.data.ProductDescription);
      setProductRate(response.data.ProductRate);
      setBarCode(barcode);




      try {
        const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${barcode}/${shopname}`);
        const images = response2.data;
        // console.log(images); 
        if (images.length > 0) {
          let base64Image = images[0];
          setImageForSearch(base64Image);
        }
      } catch (error) {
        console.log("error " + error);
      }



      console.log(response.data);
      setIsExit(true);
    } catch (error) {
      setIsExit(false);
      console.error('Error ', error);
    }
  };

  useEffect(() => {
    console.log(searchbar);
    if (searchbar) {
      fetchProducts2(searchbar);
    }
  }, [searchbar]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchProducts(searchbar);
    }
  };

  const handleBack = () => {
    window.history.back();
  };


  const moveToViewUsingSearch = () => {


    // const productsArray = data.map(item => ({
    //   barCode: item.ProductBarcode,
    //   category: item.ProductCategory,
    //   description: item.ProductDescription,
    //   productname: item.ProductName,
    //   price: item.ProductPrice,
    //   quantity: item.ProductQuantity,
    //   productRate:item.productRate,
    //   numberOfRate:item.numOfRates,
    //   publishDate:item.productPublishDate,
    //   shopname1:shopname
    //   // shopId2:shopID


    // }));

    const data = {
      barCode: barcode,
      category: category,
      description: description,
      productname: productname,
      price: price,
      quantity: quantity,
      productRate: productRate,
      publishDate: publishDate,
      shopname1: shopname
    }

    window.location.href = `/viewproduct?data=${encodeURIComponent(JSON.stringify(data))}`;



    console.log(data.category);


  }

  const handlePageClickforHomePage = async (paggingnumber) => {



    try {
      const response1 = await axios.get(`http://172.19.44.242:8080/productShop/getProducts/${shopID}/${paggingnumber}`);
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
        shopname1: shopname
        // shopId2:shopID


      }));

      setCardsForProduct(productsArray);






      const imagesMap = {};
      for (const i of productsArray) {
        try {
          const response2 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${i.barCode}/${shopname}`);
          const images = response2.data;
          // console.log(images); 
          if (images.length > 0) {
            let base64Image = images[0];
            imagesMap[i.barCode] = base64Image;
          }
        } catch (error) {
          console.log("error " + error);
        }
      }
      setImagesProduct(imagesMap);
    } catch (error) {
      console.log("error " + error);
    }




  }

  /*
  ---------------------------------------------------------------------------for order in dashbord-------------------------------------------------
  
  */

  const makeOrder = async () => {
    const shopforid = Cookies.get('userid');
    const res = await axios.get(`http://172.19.44.242:8080/shop/getshop/${shopforid}`);

    if (statusoforder === 'Accepted') {
      setClickAccepted(true);
      setClickAll(false);
      setClickPanding(false);
      setClickShippded(false);



      try {

        const response = await axios.get(`http://172.19.44.242:8080/order/getAcceptedordersforShop/${res.data}/0`);
        setArrayOfOrder(response.data);




        const imagesMap2 = {};
        for (const j of response.data) {
          try {
            const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.product.ProductBarcode}/${j.product.ShopName}`);
            const images = response3.data;
            console.log(response3.status);
            if (images.length > 0) {
              let base64Image = images[0];
              imagesMap2[j.product.ProductBarcode] = base64Image;
            }
          } catch (error) {
            console.log("error" + error);
          }
        }
        setImageFororderproduct(imagesMap2);










      } catch (error) {
        console.log(error);
      }

    }
    else if (statusoforder === 'Pending') {
      setClickAccepted(false);
      setClickAll(false);
      setClickPanding(true);
      setClickShippded(false);

      try {

        const response = await axios.get(`http://172.19.44.242:8080/order/getPendingordersforShop/${res.data}/0`);
        setArrayOfOrder(response.data);


        const imagesMap2 = {};
        for (const j of response.data) {
          try {
            const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.product.ProductBarcode}/${j.product.ShopName}`);
            const images = response3.data;
            console.log(response3.status);
            if (images.length > 0) {
              let base64Image = images[0];
              imagesMap2[j.product.ProductBarcode] = base64Image;
            }
          } catch (error) {
            console.log("error" + error);
          }
        }
        setImageFororderproduct(imagesMap2);



      } catch (error) {
        console.log(error);
      }




    }
    else if (statusoforder === 'Shipped') {
      setClickAccepted(false);
      setClickAll(false);
      setClickPanding(false);
      setClickShippded(true);



      try {

        const response = await axios.get(`http://172.19.44.242:8080/order/getShippedordersforShop/${res.data}/0`);
        setArrayOfOrder(response.data);

        console.log(response.data);



        const imagesMap2 = {};
        for (const j of response.data) {
          try {
            const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.product.ProductBarcode}/${j.product.ShopName}`);
            const images = response3.data;
            console.log(response3.status);
            if (images.length > 0) {
              let base64Image = images[0];
              imagesMap2[j.product.ProductBarcode] = base64Image;
            }
          } catch (error) {
            console.log("error" + error);
          }
        }
        setImageFororderproduct(imagesMap2);



      } catch (error) {
        console.log(error);
      }
    }
    else {

      setClickAccepted(false);
      setClickAll(true);
      setClickPanding(false);
      setClickShippded(false);

      try {

        const response = await axios.get(`http://172.19.44.242:8080/order/getAllordersforShop/${res.data}/0`);
        setArrayOfOrder(response.data);



        const imagesMap2 = {};
        for (const j of response.data) {
          try {
            const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.product.ProductBarcode}/${j.product.ShopName}`);
            const images = response3.data;
            console.log(response3.status);
            if (images.length > 0) {
              let base64Image = images[0];
              imagesMap2[j.product.ProductBarcode] = base64Image;
            }
          } catch (error) {
            console.log("error" + error);
          }
        }
        setImageFororderproduct(imagesMap2);



      } catch (error) {
        console.log(error);
      }


    }



  }

  const renderTableforPending = () => {
    return arrayoforder.map((order, index) => {
      const image1 = imagefororderproduct[order.product.ProductBarcode];
      const image = image1 ? `${image1}` : null;

      return (
        <tr className="cart-item" key={index}>
          <td>
            {image && (
              <img
                onClick={() => {
                  // window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(order.product))}`;
                }}
                className="product-image"
                src={image}
                alt="Placeholder"
              />
            )}
          </td>
          <td>
            <p
              style={{ fontSize: "20px", fontFamily: "Arial", fontWeight: "bold" }}
              className="cart-item-text"
            >
              {order.product.ProductName}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductPrice}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductQuantity}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductCategory}
            </p>
          </td>
          <td>
            <button
              onClick={() => acceptProduct(order)}
              style={{ marginRight: "5px", border: "solid 1px black", background: "white" }}
            >
              <GiCheckMark style={{ color: "green", fontSize: "20px" }} />
            </button>
          </td>
        </tr>
      );
    });
  };

  const acceptProduct = async (order) => {
    console.log(order.product.ProductBarcode);

    const shopforid = Cookies.get('userid');
    const res3 = await axios.get(`http://172.19.44.242:8080/shop/getshop/${shopforid}`);

    try {

      const response = await axios.get(`http://172.19.44.242:8080/product/getProductbyBarcode/${order.product.ProductBarcode}`);



      try {
        // console.log("order id " + order.product);

        const orderid = await axios.get(`http://172.19.44.242:8080/order/getorderIDForOrderItem/${order.orderItemID}`);
        console.log("order id " + orderid.data);


        const response2 = await axios.patch(`http://172.19.44.242:8080/orderitem/updateOrderItemStatus/${orderid.data}/${response.data.productId}/Accepted`);


        if (response2.status === 200) {




          try {

            const response3 = await axios.get(`http://172.19.44.242:8080/order/getPendingordersforShop/${res3.data}/0`);
            setArrayOfOrder(response3.data);


            const imagesMap2 = {};
            for (const j of response3.data) {
              try {
                const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.product.ProductBarcode}/${j.product.ShopName}`);
                const images = response3.data;
                console.log(response3.status);
                if (images.length > 0) {
                  let base64Image = images[0];
                  imagesMap2[j.product.ProductBarcode] = base64Image;
                }
              } catch (error) {
                console.log("error" + error);
              }
            }
            setImageFororderproduct(imagesMap2);



          } catch (error) {
            console.log(error);
          }





        }








      } catch (error) {
        console.log(error);
      }




    } catch (error) {
      console.log(error);
    }



  };





  const renderTableforAccepting = () => {
    return arrayoforder.map((order, index) => {
      const image1 = imagefororderproduct[order.product.ProductBarcode];
      const image = image1 ? `${image1}` : null;

      return (
        <tr className="cart-item" key={index}>
          <td>
            {image && (
              <img
                onClick={() => {
                  // window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(order.product))}`;
                }}
                className="product-image"
                src={image}
                alt="Placeholder"
              />
            )}
          </td>
          <td>
            <p
              style={{ fontSize: "20px", fontFamily: "Arial", fontWeight: "bold" }}
              className="cart-item-text"
            >
              {order.product.ProductName}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductPrice}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductQuantity}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductCategory}
            </p>
          </td>
          <td>
            <button onClick={() => shippedOrder(order)}
              style={{ marginRight: "5px", border: "white", background: "white" }}
            >
              <MdOutlineLocalShipping style={{ color: "orange", fontSize: "20px" }} />
            </button>
          </td>
        </tr>
      );
    });
  };


  const shippedOrder = async (order) => {



    const shopforid = Cookies.get('userid');
    const res3 = await axios.get(`http://172.19.44.242:8080/shop/getshop/${shopforid}`);

    try {



      const response = await axios.get(`http://172.19.44.242:8080/product/getProductbyBarcode/${order.product.ProductBarcode}`);


      const orderid = await axios.get(`http://172.19.44.242:8080/order/getorderIDForOrderItem/${order.orderItemID}`);
      console.log("order id " + orderid.data);



      try {

        const response2 = await axios.patch(`http://172.19.44.242:8080/orderitem/updateOrderItemStatus/${orderid.data}/${response.data.productId}/Shipped`);


        if (response2.status === 200) {

          console.log(response2.status);

          try {

            const response3 = await axios.get(`http://172.19.44.242:8080/order/getAcceptedordersforShop/${res3.data}/0`);
            setArrayOfOrder(response3.data);


            const imagesMap2 = {};
            for (const j of response3.data) {
              try {
                const response3 = await axios.get(`http://172.19.44.242:8080/productImage/getImages/${j.product.ProductBarcode}/${j.product.ShopName}`);
                const images = response3.data;
                console.log(response3.status);
                if (images.length > 0) {
                  let base64Image = images[0];
                  imagesMap2[j.product.ProductBarcode] = base64Image;
                }
              } catch (error) {
                console.log("error" + error);
              }
            }
            setImageFororderproduct(imagesMap2);



          } catch (error) {
            console.log(error);
          }





        }








      } catch (error) {
        console.log(error);
      }




    } catch (error) {
      console.log(error);
    }


  }





  const renderTableforAll = () => {
    return arrayoforder.map((order, index) => {
      const image1 = imagefororderproduct[order.product.ProductBarcode];
      const image = image1 ? `${image1}` : null;

      return (
        <tr className="cart-item" key={index}>
          <td>
            {image && (
              <img
                onClick={() => {
                  // window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(order.product))}`;
                }}
                className="product-image"
                src={image}
                alt="Placeholder"
              />
            )}
          </td>
          <td>
            <p
              style={{ fontSize: "20px", fontFamily: "Arial", fontWeight: "bold" }}
              className="cart-item-text"
            >
              {order.product.ProductName}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductPrice}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductQuantity}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductCategory}
            </p>
          </td>
          <td>
            <td style={{ fontSize: "14px" }}>
              {order.orderItemStats}

            </td>



          </td>
        </tr>
      );
    });
  };





  const renderTableforShiped = () => {
    return arrayoforder.map((order, index) => {
      const image1 = imagefororderproduct[order.product.ProductBarcode];
      const image = image1 ? `${image1}` : null;

      return (
        <tr className="cart-item" key={index}>
          <td>
            {image && (
              <img
                onClick={() => {
                  // window.location.href = `/viewprodcustomer?data=${encodeURIComponent(JSON.stringify(order.product))}`;
                }}
                className="product-image"
                src={image}
                alt="Placeholder"
              />
            )}
          </td>
          <td>
            <p
              style={{ fontSize: "20px", fontFamily: "Arial", fontWeight: "bold" }}
              className="cart-item-text"
            >
              {order.product.ProductName}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductPrice}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductQuantity}
            </p>
          </td>
          <td>
            <p style={{ fontSize: "20px" }} className="cart-item-text">
              {order.product.ProductCategory}
            </p>
          </td>
          <td>
            <button
              style={{ marginRight: "5px", border: "white", background: "white" }}
            >
              <CiDeliveryTruck style={{ color: "green", fontSize: "20px" }} />

            </button>
          </td>
        </tr>
      );
    });
  };





  /*
  
  -----------------------------------------------------------------------------for dashbord----------------------------------------
  */


  return (
    <html className="html">
      <body>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.14.0/simpleicons.svg"></link>
        <header className="header">
          <div className="profile-section">
            <div className="profile-button " onClick={toggleDropdown}>
              {image ?
                <img className="imageafter" src={image} width={30} alt="" />
                : <img width={30} className="imagebefor" src={photo} alt=""></img>
              }
              {dropdownOpen && (
                <div className="dropdown-menu">
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
                      <span>Settings & Privacy</span>
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
                      <span>Help & Support</span>
                    </li>
                    <li onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                      <span>Logout</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="" style={{ textAlign: "center", color: "#FFC24F", fontSize: "15px" }}>{shopname}</div>
          </div>
          <nav className="navbar">
            <a onClick={products} className="a" href="#product">Home</a>
            <a onClick={moveTOAddNewProdut} className="a" href="#home">Add product</a>
            <a onClick={AddExistingProduct} className="a" href="#home">Add exists product</a>
            <a onClick={Address} className="a" href="#address">Address</a>
            <a onClick={dashbord} href="#dashbord" className="a" >Dashbord</a>

            <a onClick={AboutUs} className="a" href="#about">about</a>
          </nav>
        </header>

        <div>

          Laith Isleimeyyeh
          {
            dashbord1 && !product && !about && !address && (
              <div className="dashboard-container20">
                <div className="dashboard120">
                  <div className="carddashbord20">
                    <FaUser style={{ color: "rgba(255, 166, 0, 0.689)" }} size={55} />
                    <div className="card-contentdashbord20">
                      <p style={{ fontSize: "20px" }}>{numberofPersons}</p>
                      <p style={{ fontSize: "15px" }}>Visit</p>
                    </div>
                  </div>
                  <div className="carddashbord20">
                    <FaStore style={{ color: "rgba(255, 166, 0, 0.689)" }} size={55} />
                    <div className="card-contentdashbord20">
                      <p style={{ fontSize: "15px" }}>{shopID}</p>
                      <p style={{ fontSize: "15px" }}>Shops</p>
                    </div>
                  </div>
                  <div className="carddashbord20">
                    <FaBox style={{ color: "rgba(255, 166, 0, 0.689)" }} size={55} />
                    <div className="card-contentdashbord20">
                      <p style={{ fontSize: "20px" }}>{numberofProduct}</p>
                      <p style={{ fontSize: "15px" }}>Products</p>
                    </div>
                  </div>
                </div>
                <section className="cart-section" style={{ width: "80%" }} >
                  <div className="row-center">
                    <div className="col-full">

                      <h1 style={{ marginLeft: "500px", fontSize: "30px" }} className="cart-title">Order<span style={{ color: "orange" }}>'S</span>  </h1>
                      <label style={{ fontFamily: "Arial", fontSize: "22px" }} for="status">Status :</label>

                      <select value={statusoforder} onChange={(e) => setStatusOfOrder(e.target.value)} onClick={makeOrder} style={{ border: "solid 2px orange", fontSize: "20px", borderRadius: "10px" }} name="status" id="cars">
                        <option value="all">all</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Shipped">Shiped</option>

                      </select>
                      <div className="overflow-container">
                        <table style={{ background: "white" }} className="cart-table" >

                          {
                            clickpadning && !clickAccepted && !clickShipped && !clickAll && (
                              renderTableforPending()
                            )
                          }
                          {

                            !clickpadning && clickAccepted && !clickShipped && !clickAll && (
                              renderTableforAccepting()
                            )

                          }

                          {
                            !clickpadning && !clickAccepted && clickShipped && !clickAll && (
                              renderTableforShiped()
                            )
                          }

                          {
                            !clickpadning && !clickAccepted && !clickShipped && clickAll && (
                              renderTableforAll()

                            )
                          }
                        </table>
                      </div>

                    </div>
                  </div>
                </section>


                <h1>Monthly Sales Chart</h1>
                <div className="row">
                  <div className="col-12">
                    <Chart
                      options={chartData.options}
                      series={chartData.series}
                      type="bar"
                      width="80%"
                      height="400"
                    />
                  </div>
                </div>

              </div>
            )





          }





          {/* {addProduct && !product && !about && !address && (
            <div className="app-body">
              <div className="content">
                <Link onClick={moveTOAddNewProdut}>
                  <button className="button">Add new Product </button>
                </Link>
                <Link onClick={
                  AddExistingProduct}>
                  <button className="button">See if product details exists</button>
                </Link>
              </div>
            </div>
          )} */}





          {!addProduct && product && !about && !address && (
            <div>

              <div>
                <Link to="shopowner" style={{ color: "black", padding: "100px", fontSize: "40px" }} className="back-button" onClick="">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>

                <div className="search-bar-container1">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search on product"
                    value={searchbar}
                    onChange={(e) => setSearchBar(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
              </div>



              {


                <div className="dashboard">
                  <div onClick={clickOnHomePage} className="carddashbord1">
                    <FontAwesomeIcon icon={faHome} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                    <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">
                      Main
                    </div>
                  </div>
                  <div onClick={handleLabtob1} className="carddashbord1">
                    <FontAwesomeIcon icon={faLaptop} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                    <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">
                      laptops
                    </div>
                  </div>
                  <div onClick={handleTV} className="carddashbord1">
                    <FontAwesomeIcon icon={faTv} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                    <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">
                      TV
                    </div>
                  </div>
                  <div onClick={handleMobile} className="carddashbord1">
                    <FontAwesomeIcon icon={faMobileAlt} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                    <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">
                      Mobile
                    </div>
                  </div>
                  <div onClick={handleCamera} className="carddashbord1">
                    <FontAwesomeIcon icon={faCamera} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                    <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Camera</div>
                  </div>
                  <div onClick={handleHeadPhone} className="carddashbord1">
                    <FontAwesomeIcon icon={faHeadphones} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                    <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">HeadPhones</div>
                  </div>
                  <div onClick={handleGaming} className="carddashbord1">
                    <FontAwesomeIcon icon={faGamepad} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                    <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Gaming</div>
                  </div>
                  <div onClick={handleOthers} className="carddashbord1">
                    <FontAwesomeIcon icon={faEllipsisH} style={{ color: "rgba(255, 166, 0, 0.689)" }} size="3x" />
                    <div style={{ fontSize: "11px", fontWeight: "bold" }} className="card-contentdashbord">Others</div>
                  </div>
                </div>



              }

              {!isExit && (

                <div className="card-containerr1">

                  {
                    mainPage && !Clicklabtobs && !clickCamera && !clickHeadPhone && !clickMobile && !clickOthers && !clickTV && !ClickGamming && (
                      <div className="card-containerr1">
                        {renderCards1()}

                        <div className="footerpagination">

                          {
                            isHaveAproduct && (
                              <div className="pagination">
                                <h1 style={{ color: "orange", cursor: "pointer" }}>{"<"}</h1>
                                {[...Array(counter).keys()].map((index) => (
                                  <div key={index + 1} className="pagination-card">
                                    <button
                                      className="pagination-button"
                                      onClick={() => handlePageClickforHomePage(index)}
                                    >
                                      {index + 1}
                                    </button>
                                  </div>
                                ))}
                                <h1 style={{ color: "orange", cursor: "pointer" }}>{">"}</h1>
                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }



                  {
                    !Clicklabtobs && clickCamera && !clickHeadPhone && !clickMobile && !clickOthers && !clickTV && !ClickGamming && (
                      <div className="card-containerr1">
                        {renderCards1()}
                        <div className="footerpagination">
                          {
                            isHaveAproduct && (
                              <div className="pagination">

                                <h1 style={{ color: "orange" }}> {"<"}</h1>
                                {[...Array(counter).keys()].map((index) => (
                                  <div key={index + 1} className="pagination-card">
                                    <button style={{ color: "orange" }} className="pagination-button" onClick={() => handlePagination(index)}>
                                      {index + 1}
                                    </button>
                                  </div>
                                ))}
                                <h1 style={{ color: "orange" }}>
                                  {">"}

                                </h1>





                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }






                  {
                    !clickCamera && Clicklabtobs && !clickHeadPhone && !clickMobile && !clickOthers && !clickTV && !ClickGamming && (
                      <div className="card-containerr1">
                        {renderCards1()}
                        <div className="footerpagination">
                          {
                            isHaveAproduct && (
                              <div className="pagination">

                                <h1 style={{ color: "orange" }}> {"<"}</h1>

                                {[...Array(counter).keys()].map((index) => (
                                  <div key={index + 1} className="pagination-card">
                                    <button style={{ color: "orange" }} className="pagination-button" onClick={() => handlePagination(index)}>
                                      {index + 1}
                                    </button>
                                  </div>
                                ))}

                                <h1 style={{ color: "orange" }}>
                                  {">"}

                                </h1>





                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }






                  {
                    !Clicklabtobs && !clickCamera && clickHeadPhone && !clickMobile && !clickOthers && !clickTV && !ClickGamming && (
                      <div className="card-containerr1">
                        {renderCards1()}
                        <div className="footerpagination">
                          {
                            isHaveAproduct && (
                              <div className="pagination">

                                <h1 style={{ color: "orange" }}> {"<"}</h1>
                                {[...Array(counter).keys()].map((index) => (
                                  <div key={index + 1} className="pagination-card">
                                    <button style={{ color: "orange" }} className="pagination-button" onClick={() => handlePagination(index)}>
                                      {index + 1}
                                    </button>
                                  </div>
                                ))}
                                <h1 style={{ color: "orange" }}>
                                  {">"}

                                </h1>





                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }





                  {
                    !Clicklabtobs && !clickCamera && !clickHeadPhone && clickMobile && !clickOthers && !clickTV && !ClickGamming && (
                      <div className="card-containerr1">
                        {renderCards1()}
                        <div className="footerpagination">
                          {
                            isHaveAproduct && (
                              <div className="pagination">

                                <h1 style={{ color: "orange" }}> {"<"}</h1>
                                {[...Array(counter).keys()].map((index) => (
                                  <div key={index + 1} className="pagination-card">
                                    <button style={{ color: "orange" }} className="pagination-button" onClick={() => handlePagination(index)}>
                                      {index + 1}
                                    </button>
                                  </div>
                                ))}
                                <h1 style={{ color: "orange" }}>
                                  {">"}

                                </h1>





                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }





                  {
                    !Clicklabtobs && !clickCamera && !clickHeadPhone && !clickMobile && clickOthers && !clickTV && !ClickGamming && (
                      <div className="card-containerr1">
                        {renderCards1()}
                        <div className="footerpagination">
                          {
                            isHaveAproduct && (
                              <div className="pagination">

                                <h1 style={{ color: "orange" }}> {"<"}</h1>
                                {[...Array(counter).keys()].map((index) => (
                                  <div key={index + 1} className="pagination-card">
                                    <button style={{ color: "orange" }} className="pagination-button" onClick={() => handlePagination(index)}>
                                      {index + 1}
                                    </button>
                                  </div>
                                ))}
                                <h1 style={{ color: "orange" }}>
                                  {">"}

                                </h1>





                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }







                  {
                    !Clicklabtobs && !clickCamera && !clickHeadPhone && !clickMobile && !clickOthers && clickTV && !ClickGamming && (
                      <div className="card-containerr1">
                        {renderCards1()}
                        <div className="footerpagination">
                          {
                            isHaveAproduct && (
                              <div className="pagination">

                                <h1 style={{ color: "orange" }}> {"<"}</h1>
                                {[...Array(counter).keys()].map((index) => (
                                  <div key={index + 1} className="pagination-card">
                                    <button style={{ color: "orange" }} className="pagination-button" onClick={() => handlePagination(index)}>
                                      {index + 1}
                                    </button>
                                  </div>
                                ))}
                                <h1 style={{ color: "orange" }}>
                                  {">"}

                                </h1>





                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }





                  {
                    !Clicklabtobs && !clickCamera && !clickHeadPhone && !clickMobile && !clickOthers && !clickTV && ClickGamming && (
                      <div className="card-containerr1">
                        {renderCards1()}
                        <div className="footerpagination">
                          {
                            isHaveAproduct && (
                              <div className="pagination">

                                <h1 style={{ color: "orange" }}> {"<"}</h1>
                                {[...Array(counter).keys()].map((index) => (
                                  <div key={index + 1} className="pagination-card">
                                    <button style={{ color: "orange" }} className="pagination-button" onClick={() => handlePagination(index)}>
                                      {index + 1}
                                    </button>
                                  </div>
                                ))}
                                <h1 style={{ color: "orange" }}>
                                  {">"}

                                </h1>





                              </div>
                            )
                          }

                        </div>

                      </div>
                    )
                  }


                </div>


              )}



              {/* const renderCards1 = () => {
    return cardsForProduct.map((data, index) => {
      const imageBlob = imagesProduct[data.barCode];
      const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : null;

      return (
        <div onClick={() => {
          window.location.href = `/viewproduct?data=${encodeURIComponent(JSON.stringify(data))}`;
        }} key={index} className="card">

         
          {imageUrl && <img className="image" src={imageUrl} alt={data.productname} />}
          <div className="card-content">
            <p className="p">name: <strong style={{ color: "black", paddingRight: "30px" }}>{data.productname}</strong></p>
            <p className="p">Quantity: <strong style={{ color: "black", paddingRight: "30px" }}>{data.quantity}</strong></p>
            <p className="p"> Price<strong style={{ color: "black" }}>{data.price}</strong></p>
          
          
            <button className="view-product-button">View Product</button>
          </div>
        </div>
      );
    });
  }; */}




              {isExit && (
                <div className="body">
                  <div className="card-containerr1">
                    <div className="card">



                      <img className="image" src={imageForSearch} alt="" />
                      {/* <div className="card-content">
            <p className="p"> <strong style={{ color: "black", paddingRight: "30px" }}>{productname}</strong></p>
            <p className="p"> <strong style={{ color: "black", paddingRight: "30px" }}>{quantity}</strong></p>
            <p className="p"><strong style={{ color: "black" }}>{price}$</strong></p>
          
          
            <button onClick={moveToViewUsingSearch} className="view-product-button">View Product</button>
          </div> */}

                      <div style={{ marginBottom: "1px" }}>

                        <p className="product-name3"><span><b>{productname}</b></span></p>
                        <p className="product-name3"><span><b>{quantity} peices</b></span></p>

                        <p className="product-price3"><span>{price} <BiShekel />  </span></p>

                        <p className="product-rate3"> {renderStars(productRate)

                        }

                        </p>
                        <button onClick={moveToViewUsingSearch} className="view-product-button">View Product</button>



                      </div>

                    </div>
                  </div>
                </div>
              )}




            </div>
          )}
          {/* {!addProduct && !product && Home && !address && !about && (
            <h3>nader</h3>
          )} */}
          {!addProduct && !product && !Home && address && !about && (
            <div>
              <div className="card-containerr">
                {renderCards()}
              </div>
              <div style={{ textAlign: "center" }} className="footerAdress">
                <button className="button" onClick={() => {
                  window.location.href = `/newaddress?data=${encodeURIComponent(JSON.stringify(id))}`;
                }} >Add Another Address</button>
              </div>
            </div>
          )}
          {!addProduct && !product && !Home && !address && about && (
            <section className="hero">
              <div className="headingabout">
                <h1 className="h122">About Us</h1>
              </div>
              <div className="containerabout">
                <div className="hero-content">
                  <h2>Welcome To Our Website</h2>
                  <p>Welcome to TachSpotter, your all-in-one platform for creating and managing online stores effortlessly. We take pride in offering a comprehensive solution that empowers anyone, regardless of their technical or business background, to launch their own online store and start selling products in just a few minutes...</p>
                  <button className="cta-button">Learn More</button>
                </div>
                <div className="hero-image">
                  <img className="imgg" src={aboutUsPhoto} alt="" ></img>
                </div>
              </div>
            </section>
          )}
        </div>


      </body>
    </html>
  );
}

export default Shoppage;