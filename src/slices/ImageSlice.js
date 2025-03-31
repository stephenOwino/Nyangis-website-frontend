import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

export const uploadProductImage = createAsyncThunk(
	"image/uploadProductImage",
	async (file, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			formData.append("image", file);
			const response = await axiosInstance.post(
				"/api/products/upload",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			console.log("Image upload response:", response.data);
			// Assuming the backend returns either a string (e.g., "/api/products/uploads/...") or an object (e.g., { url: "/api/products/uploads/..." })
			return typeof response.data === "string"
				? response.data
				: response.data.url;
		} catch (error) {
			console.error(
				"Image upload error:",
				error.response?.data || error.message
			);
			const errorMessage =
				error.response?.data?.message ||
				error.response?.data ||
				"Failed to upload image";
			return rejectWithValue(errorMessage);
		}
	}
);

const imageSlice = createSlice({
	name: "image",
	initialState: { url: null, status: "idle", error: null },
	reducers: {
		clearImageState: (state) => {
			state.url = null;
			state.status = "idle";
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(uploadProductImage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(uploadProductImage.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.url = action.payload;
			})
			.addCase(uploadProductImage.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { clearImageState } = imageSlice.actions;
export default imageSlice.reducer;
