import axios from "axios";
//import authHeader from "./auth-header";
const API_URL = "https://asaga.in:9920/api/";

const config = { headers: { 'Content-Type': `multipart/form-data` } }

class ItemService {
    API_URL = "https://asaga.in:9920/api/";
    getOrderView(data) { return axios(data); }
}
export default new ItemService();   