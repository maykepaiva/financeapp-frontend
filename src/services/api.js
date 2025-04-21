import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.26:8080/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
