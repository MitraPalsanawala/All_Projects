import axios from "axios";
const config = { headers: { 'Content-Type': `multipart/form-data` } }
const API_URL = "https://asaga.in:9920/api/";
class services {
    API_URL = "https://asaga.in:9920/api/";
    setAdminLogIn(data) { return axios(data); }
}
export default new services();