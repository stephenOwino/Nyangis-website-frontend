import axiosInstance from "../axios";

export const fetchProducts = async () => {
	const response = await axiosInstance.get("/api/products");
	return response.data;
};

export const fetchProductsByCategory = async (category) => {
	const response = await axiosInstance.get(
		`/api/products/category/${category}`
	);
	return response.data;
};

export const createProduct = async (product) => {
	const response = await axiosInstance.post("/api/products", product);
	return response.data;
};

export const updateProduct = async (id, product) => {
	const response = await axiosInstance.put(`/api/products/${id}`, product);
	return response.data;
};

export const deleteProduct = async (id) => {
	await axiosInstance.delete(`/api/products/${id}`);
};

export const uploadImage = async (image) => {
	const formData = new FormData();
	formData.append("image", image);
	const response = await axiosInstance.post("/api/products/upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return response.data; // Returns the imageUrl
};
