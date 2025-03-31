import axiosInstance from "../../axios";

// Fetch all products with pagination
export const fetchProducts = async ({ page = 0, size = 10 } = {}) => {
	const response = await axiosInstance.get("/api/products", {
		params: { page, size },
	});
	return response.data; // Returns Page object { content, totalElements, totalPages, number }
};

// Fetch products by category with pagination
export const fetchProductsByCategory = async ({
	category,
	page = 0,
	size = 10,
}) => {
	const response = await axiosInstance.get(
		`/api/products/category/${category}`,
		{
			params: { page, size },
		}
	);
	return response.data; // Returns Page object
};

// Fetch a single product by ID
export const fetchProductById = async (id) => {
	const response = await axiosInstance.get(`/api/products/${id}`);
	return response.data;
};

// Create a new product
export const createProduct = async (product) => {
	const response = await axiosInstance.post("/api/products", product);
	return response.data;
};

// Update an existing product
export const updateProduct = async (id, product) => {
	const response = await axiosInstance.put(`/api/products/${id}`, product);
	return response.data;
};

// Delete a product
export const deleteProduct = async (id) => {
	await axiosInstance.delete(`/api/products/${id}`);
};

// Upload an image
export const uploadImage = async (image) => {
	const formData = new FormData();
	formData.append("image", image);
	const response = await axiosInstance.post("/api/products/upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	// Return the URL directly, handling both string and object responses
	return typeof response.data === "string" ? response.data : response.data.url;
};
