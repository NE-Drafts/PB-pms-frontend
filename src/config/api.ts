import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8250/api/v1",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})

export default axiosInstance