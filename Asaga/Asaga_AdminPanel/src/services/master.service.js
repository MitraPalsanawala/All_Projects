import axios from "axios";
//import authHeader from "./auth-header";
const API_URL = "https://asaga.in:9920/api/";
const config = { headers: { 'Content-Type': `multipart/form-data` } }
class MasterService {

    API_URL = "https://asaga.in:9920/api/";
    //---------------------category-----------------------//
    setCategory(form) { return axios.post(API_URL + "setCategory", form, config); }
    getCategory(data) { return axios(data); }
    deleteCategory(data) { return axios(data); }

    //--------------------Banner--------------------------//
    setBanner(form) { return axios.post(API_URL + "setBanner", form, config); }
    getBanner(data) { return axios(data); }
    deleteBanner(data) { return axios(data); }

    //--------------------AboutUs--------------------------//
    setAboutUs(form) { return axios.post(API_URL + "setAboutUs", form, config); }
    getAboutUs(data) { return axios(data); }
    // getState(data) { return axios(data); }

    //---------------------Country--------------------------//
    getCountry(data) { return axios(data); }
    setCountry(data) { return axios(data); }
    deleteCountry(data) { return axios(data); }

    //--------------------State--------------------------//
    getState(data) { return axios(data); }
    dropdownCountry() { return axios.get(API_URL + "dropdownCountry"); }

    //--------------------City--------------------------//
    getCity(data) { return axios(data); }

    //---------------------SubCategory-----------------------//
    setSubCategory(form) { return axios.post(API_URL + "setSubCategory", form, config); }
    // getSubCategory() { return axios.post(API_URL + "getSubCategory"); }
    getSubCategory(data) { return axios(data); }
    deleteSubCategory(data) { return axios(data); }

    //--------------------FAQ--------------------------//
    setFAQ(data) { return axios(data); }
    getFAQ(data) { return axios(data); }
    removeFAQ(data) { return axios(data); }

    //--------------------ItemColor--------------------------//
    getItemColor(data) { return axios(data); }

    //--------------------ItemSize--------------------------//
    getItemSize(data) { return axios(data); }

    //--------------------ContactUs--------------------------//
    setContactUs(data) { return axios(data); }
    getContactUs(data) { return axios(data); }

    //--------------------CoupanCode--------------------------//
    getCouponCode(data) { return axios(data); }
    setCouponCode(data) { return axios(data); }
    deleteCouponCode(data) { return axios(data); }
}

export default new MasterService();