import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.26:8080/api", // Substitua pelo IP da sua máquina e porta do backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
