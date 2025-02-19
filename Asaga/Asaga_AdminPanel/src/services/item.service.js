import axios from "axios";
//import authHeader from "./auth-header";
const API_URL = "https://asaga.in:9920/api/";

const config = { headers: { 'Content-Type': `multipart/form-data` } }

class ItemService {
    API_URL = "https://asaga.in:9920/api/";
    getItem(data) { return axios(data); }
    deleteItem(data) { return axios(data); }
    ImageDelete(data) { return axios(data); }
    deleteStock(data) { return axios(data); }
    UpdateStock(data) { return axios(data); }
    setItem(form) { return axios.post(API_URL + "setItem", form, config); }
}
export default new ItemService();