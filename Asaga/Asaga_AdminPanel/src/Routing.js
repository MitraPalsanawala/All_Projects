import React from 'react'
// import { PrivateRoute } from 'react-auth-kit'
import { Route, Routes } from 'react-router-dom'
import Dashboard from "./components/dashboard.component";
import Login from "./components/login.component";
import Category from "./components/category.component";
import UserDetail from "./components/user.component";
import Banner from "./components/banner.component";
import AboutUs from "./components/aboutus.component";
import State from "./components/state.component";
import SubCategory from "./components/subcategory.component";
import ItemDetail from "./components/itemdetail.component";
import Faq from "./components/faq.component";
import OrderDetail from "./components/order.component";
import StockDetail from "./components/stockdetail.component";
import ContactUs from "./components/contactus.component";
import CountryMaster from "./components/country.component";
import CoupanCode from "./components/coupancode.component";
import { createBrowserHistory } from 'history';
import { Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

const Routing = () => {
    const history = createBrowserHistory();
    const cookies = new Cookies();
    const propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    // console.log("cookies", cookies.get('UserType'));
    return (
        // <BrowserRouter history={history}>
        <Routes >
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path="/Category" element={<Category />} />
            <Route path="/UserDetail" element={<UserDetail />} />
            <Route path="/Banner" element={<Banner />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/State" element={<State />} />
            <Route path="/SubCategory" element={<SubCategory />} />
            <Route path="/ItemDetail" element={<ItemDetail />} />
            <Route path="/Faq" element={<Faq />} />
            <Route path="/OrderDetail" element={<OrderDetail />} />
            <Route path="/StockDetail" element={<StockDetail />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/CountryMaster" element={<CountryMaster />} />
            <Route path="/CoupanCode" element={<CoupanCode />} />
        </Routes >
        // </BrowserRouter>
    )
}

export default Routing