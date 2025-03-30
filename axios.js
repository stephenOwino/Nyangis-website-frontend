// src/axios.js
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:9900",
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		const publicEndpoints = [
			"/api/products",
			"/api/products/category/",
			"/api/products/uploads/",
		];
		const isPublic = publicEndpoints.some(
			(endpoint) =>
				config.url.startsWith(endpoint) && config.method.toLowerCase() === "get"
		);
		console.log(
			"Request URL:",
			config.url,
			"Method:",
			config.method,
			"Token:",
			token,
			"Is Public:",
			isPublic
		);
		if (token && !isPublic) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.error("Unauthorized - token invalid or missing");
			localStorage.removeItem("token");
			window.location.href = "/admin/login";
		} else if (error.response?.status === 400) {
			console.error("Validation error:", error.response.data);
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
