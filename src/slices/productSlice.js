import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get("/api/products", {
				params: { page, size },
			});
			return response.data; // Expecting { content, totalElements, totalPages, number }
		} catch (error) {
			console.error(
				"Fetch products error:",
				error.response?.data || error.message
			);
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch products"
			);
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
			return response.data; // Expecting { content, totalElements, totalPages, number }
		} catch (error) {
			console.error(
				"Fetch products by category error:",
				error.response?.data || error.message
			);
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch products by category"
			);
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
			return rejectWithValue(
				error.response?.data?.message || "Product not found"
			);
		}
	}
);

export const createProduct = createAsyncThunk(
	"products/createProduct",
	async (product, { rejectWithValue }) => {
		try {
			console.log("Creating product with data:", product);
			const response = await axiosInstance.post("/api/products", product);
			console.log("Product created:", response.data);
			return response.data;
		} catch (error) {
			console.error(
				"Create product error:",
				error.response?.data || error.message
			);
			return rejectWithValue(
				error.response?.data?.message || "Failed to create product"
			);
		}
	}
);

export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ id, product }, { rejectWithValue }) => {
		try {
			console.log("Updating product with data:", product);
			const response = await axiosInstance.put(`/api/products/${id}`, product);
			console.log("Product updated:", response.data);
			return response.data;
		} catch (error) {
			console.error(
				"Update product error:",
				error.response?.data || error.message
			);
			return rejectWithValue(
				error.response?.data?.message || "Failed to update product"
			);
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
			return rejectWithValue(
				error.response?.data?.message || "Failed to delete product"
			);
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
			// fetchProducts
			.addCase(fetchProducts.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products = action.payload.content || [];
				state.totalElements = action.payload.totalElements || 0;
				state.totalPages = action.payload.totalPages || 0;
				state.currentPage = action.payload.number || 0;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// fetchProductsByCategory
			.addCase(fetchProductsByCategory.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProductsByCategory.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products = action.payload.content || [];
				state.totalElements = action.payload.totalElements || 0;
				state.totalPages = action.payload.totalPages || 0;
				state.currentPage = action.payload.number || 0;
			})
			.addCase(fetchProductsByCategory.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// fetchProductById
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
				state.selectedProduct = null;
			})
			// createProduct
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
			// updateProduct
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
				if (state.selectedProduct?.id === action.payload.id) {
					state.selectedProduct = action.payload;
				}
			})
			.addCase(updateProduct.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// deleteProduct
			.addCase(deleteProduct.pending, (state) => {
				state.status = "loading";
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products = state.products.filter(
					(product) => product.id !== action.payload
				);
				if (state.selectedProduct?.id === action.payload) {
					state.selectedProduct = null;
				}
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { clearError, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
