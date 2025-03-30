import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";
import { uploadProductImage } from "../slices/ImageSlice";

export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get("/api/products", {
				params: { page, size },
			});
			return response.data;
		} catch (error) {
			console.error(
				"Fetch products error:",
				error.response?.data || error.message
			);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const fetchProductsByCategory = createAsyncThunk(
	"products/fetchProductsByCategory",
	async ({ category, page = 0, size = 10 }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`/api/products/category/${category}`,
				{
					params: { page, size },
				}
			);
			return response.data;
		} catch (error) {
			console.error(
				"Fetch products by category error:",
				error.response?.data || error.message
			);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const fetchProductById = createAsyncThunk(
	"products/fetchProductById",
	async (id, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`/api/products/${id}`);
			return response.data;
		} catch (error) {
			console.error(
				"Fetch product by ID error:",
				error.response?.data || error.message
			);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const createProduct = createAsyncThunk(
	"products/createProduct",
	async ({ product, image }, { rejectWithValue, dispatch }) => {
		try {
			let imageUrl = null;
			if (image) {
				console.log("Uploading image:", image.name);
				const uploadResponse = await dispatch(
					uploadProductImage(image)
				).unwrap();
				imageUrl = uploadResponse;
				console.log("Image uploaded, URL:", imageUrl);
			} else {
				throw new Error("Image is required for new product");
			}
			const productData = {
				description: product.description,
				status: product.status,
				category: product.category,
				imageUrl: imageUrl,
				price: product.price,
				location: product.location,
				type: product.type,
				condition: product.condition,
			};
			console.log("Creating product with data:", productData);
			const response = await axiosInstance.post("/api/products", productData);
			console.log("Product created:", response.data);
			return response.data;
		} catch (error) {
			console.error(
				"Create product error:",
				error.response?.data || error.message
			);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ id, product, image }, { rejectWithValue, dispatch }) => {
		try {
			let imageUrl = product.imageUrl;
			if (image) {
				console.log("Uploading new image for update:", image.name);
				const uploadResponse = await dispatch(
					uploadProductImage(image)
				).unwrap();
				imageUrl = uploadResponse;
				console.log("New image uploaded, URL:", imageUrl);
			}
			const productData = {
				description: product.description,
				status: product.status,
				category: product.category,
				imageUrl: imageUrl,
				price: product.price,
				location: product.location,
				type: product.type,
				condition: product.condition,
			};
			console.log("Updating product with data:", productData);
			const response = await axiosInstance.put(
				`/api/products/${id}`,
				productData
			);
			console.log("Product updated:", response.data);
			return response.data;
		} catch (error) {
			console.error(
				"Update product error:",
				error.response?.data || error.message
			);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const deleteProduct = createAsyncThunk(
	"products/deleteProduct",
	async (id, { rejectWithValue }) => {
		try {
			await axiosInstance.delete(`/api/products/${id}`);
			console.log("Product deleted:", id);
			return id;
		} catch (error) {
			console.error(
				"Delete product error:",
				error.response?.data || error.message
			);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

const productSlice = createSlice({
	name: "products",
	initialState: {
		products: [],
		selectedProduct: null,
		totalElements: 0,
		totalPages: 0,
		currentPage: 0,
		status: "idle",
		error: null,
	},
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		clearSelectedProduct: (state) => {
			state.selectedProduct = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products = action.payload.content;
				state.totalElements = action.payload.totalElements;
				state.totalPages = action.payload.totalPages;
				state.currentPage = action.payload.number;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(fetchProductsByCategory.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProductsByCategory.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products = action.payload.content;
				state.totalElements = action.payload.totalElements;
				state.totalPages = action.payload.totalPages;
				state.currentPage = action.payload.number;
			})
			.addCase(fetchProductsByCategory.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(fetchProductById.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProductById.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.selectedProduct = action.payload;
			})
			.addCase(fetchProductById.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(createProduct.pending, (state) => {
				state.status = "loading";
			})
			.addCase(createProduct.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products.push(action.payload);
			})
			.addCase(createProduct.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(updateProduct.pending, (state) => {
				state.status = "loading";
			})
			.addCase(updateProduct.fulfilled, (state, action) => {
				state.status = "succeeded";
				const index = state.products.findIndex(
					(product) => product.id === action.payload.id
				);
				if (index !== -1) {
					state.products[index] = action.payload;
				}
			})
			.addCase(updateProduct.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(deleteProduct.pending, (state) => {
				state.status = "loading";
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products = state.products.filter(
					(product) => product.id !== action.payload
				);
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { clearError, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
