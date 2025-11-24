import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:4000/api"
});

export default apiClient;