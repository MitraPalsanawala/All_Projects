import axios from "axios";
//import authHeader from "./auth-header";
const API_URL = "https://asaga.in:9920/api/";

const config = { headers: { 'Content-Type': `multipart/form-data` } }

class UserService {
    API_URL = "https://asaga.in:9920/api/";
    // viewUserMaster() { return axios.post(API_URL + "viewUserMaster"); }
    viewUserMaster(data) { return axios(data); }
}
export default new UserService();