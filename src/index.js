import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Signupshop from './Registration/Shop/signupshop';
import Adresspage from './Registration/Shop/address';
import Signin from './Registration/signin';
import Signupcustomer from './Registration/Customer/signupcustomer';
import Addresscustomer from './Registration/Customer/address';
import EmailVerification from './Registration/Customer/verfiycation';
import Verfiy from './Registration/Shop/verfiy';
import Shoppage from './Registration/Shop/Shopowner/shopowner';
import UpdateAddress from './Registration/Shop/Shopowner/address';
import AddedNewAddress from './Registration/Shop/Shopowner/addedanotheraddress';
import AddNewProduct from './Registration/Shop/Shopowner/addnewproduct';
import AddExitProduct from './Registration/Shop/Shopowner/addedanotheraddress';
import Setting from './Registration/Shop/Shopowner/Settings';
import Viewproduct from './Registration/Shop/Shopowner/viewproduct';
import Changepassword from './Registration/Shop/Shopowner/changepassword';
import AddExistingProduct from './Registration/Shop/Shopowner/addExistingProduct';
import ExistingProduct from './Registration/Shop/Shopowner/existingproduct';
import HomePage from './HomePage/Homepage';
import Category from './HomePage/Category';
import ViewproductForCustomer from './HomePage/viewproductforcustomer';
// import ImageRow from './HomePage/ImageRow ';
import AdvanceSearch from './HomePage/AdanceSearch';
import SearchProducts from './HomePage/SearchProducts';
import SearchProductByName from './HomePage/searchByName';
import ProfileShop from './HomePage/ProfileShop';
import HomePageCustomer from './HomePageCustomer/homePageCustomer';
import Viewproductcustomer from './HomePageCustomer/viewproductcustomer';
import ShopForCustomer from './HomePageCustomer/shopForCustomer';
import CategoryForCustomer from './HomePageCustomer/CategoryForCustomer';
import SearchByNameCustomer from './HomePageCustomer/searchbynamecustomer';
import AdvanceSearchForCustomer from './HomePageCustomer/advanceSearchForCustomer';
import SearchProductForCustomer from './HomePageCustomer/searchproductforcustmer';
import CartCustomer from './HomePageCustomer/cartcustomer';
import WishList from './HomePageCustomer/wishlist';
import CheckOut from './HomePageCustomer/checkout';
import FeedBack from './HomePageCustomer/feedback';
import OrderForCustomer from './HomePageCustomer/ordersforcustomer';
import ReportForCustomer from './HomePageCustomer/Report';
import Admin from './Admin/AdminComponent';



const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
    
  },
  {
    path: "/signupshop",
    element: <Signupshop />
  },
  {
    path: "/address",
    element: <Adresspage />
  },
  {
    path: "/signin",
    element: <Signin />
  },
  {
    path: "/signupcustomer",
    element: <Signupcustomer />
  },
  {
    path: "/addresscustomer",
    element: <Addresscustomer />
  },
  {
    path: "/verfiycation",
    element: <Verfiy/>
  }
  ,{
    path: "/verfiy",
    element: <EmailVerification />
  },{
    path: "/shopowner",
    element: <Shoppage />
  },{
    path: "/changeAddress",
    element: <UpdateAddress/>
  },{
    path: "/newaddress",
    element: <AddedNewAddress/>
  },{
    path: "/addnewproduct",
    element: <AddNewProduct/>
  },{
    path: "/addexitproduct",
    element: <AddExitProduct/>
  },{
    path: "/setting",
    element: <Setting/>
  },{
    path: "/viewproduct",
    element: <Viewproduct/>
  },{
    path: "/changepassword",
    element: <Changepassword/>
  },{
    path: "/exisitproduct",
    element: <ExistingProduct/>

  },{
    path: "/addexsistingproduct",
    element: <AddExistingProduct/>

  },{
    path: "/homepage",
    element: <HomePage/>

  },{
    path: "/category",
    element: <Category/>

  },{
    path: "/viewproductforcustomer",
    element: <ViewproductForCustomer/>

  },{
    path:"/advancesearch",
    element:<AdvanceSearch/>
  },{
    path:"/searchProducts",
    element:<SearchProducts/>
  },{
    path:"/searchbyname",
    element:<SearchProductByName/>
  },{
    path:"/profileshop",
    element:<ProfileShop/>
  },{
    path:"/homepagecustomer",
    element:<HomePageCustomer/>
  },{
    path:"/viewprodcustomer",
    element:<Viewproductcustomer/>
  },{
    path:"/shopforcustomer",
    element:<ShopForCustomer/>
  },{
    path:"/categoryforcustomer",
    element:<CategoryForCustomer/>
  },{
    path:"/searchbynamecustomer",
    element:<SearchByNameCustomer/>
  },{
    path:"/advancesearchforcustomer",
    element:<AdvanceSearchForCustomer/>
  },{
    path:"/searchproductforcustomer",
    element:<SearchProductForCustomer/>
  },{
    path:"/cartcustomer",
    element:<CartCustomer/>
  },{
    path:"/wishlist",
    element:<WishList/>
  },{
    path:"/checkout",
    element:<CheckOut/>
  },{
    path:"/feedback",
    element:<FeedBack/>
  },{
    path:"/orderforcustomer",
    element:<OrderForCustomer/>
  },{
    path:"/reportitem",
    element:<ReportForCustomer/>
  }

  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);