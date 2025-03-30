import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../slices/productSlice";
import chatReducer from "../slices/chatSlice";
import imageReducer from "../slices/ImageSlice";
import authReducer from "../slices/authSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		products: productReducer,
		chat: chatReducer,
		image: imageReducer,
	},
});

export default store;
