import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

export const login = createAsyncThunk(
	"auth/login",
	async ({ phone, password }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post("/login", null, {
				params: { phone, password },
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: localStorage.getItem("token") || null,
		status: "idle",
		error: null,
	},
	reducers: {
		logout: (state) => {
			state.token = null;
			localStorage.removeItem("token");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.token = action.payload;
				localStorage.setItem("token", action.payload);
			})
			.addCase(login.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
				state.token = null;
				localStorage.removeItem("token");
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
