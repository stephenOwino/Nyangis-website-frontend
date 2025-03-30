import axiosInstance from "../axios";

export const fetchProducts = async ({ page = 0, size = 10 } = {}) => {
	const response = await axiosInstance.get("/api/products", {
		params: { page, size },
	});
	return response.data; // Returns Page object
};

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

export const createProduct = async ({ product, image }) => {
	let imageUrl = product.imageUrl;
	if (image) {
		imageUrl = await uploadImage(image);
	}
	const response = await axiosInstance.post("/api/products", {
		...product,
		imageUrl,
	});
	return response.data;
};

export const updateProduct = async ({ id, product, image }) => {
	let imageUrl = product.imageUrl;
	if (image) {
		imageUrl = await uploadImage(image);
	}
	const response = await axiosInstance.put(`/api/products/${id}`, {
		...product,
		imageUrl,
	});
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
	return response.data; // Returns imageUrl
};
