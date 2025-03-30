import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../slices/authSlice";
import toast from "react-hot-toast";

const AdminLogin = () => {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const result = await dispatch(login({ phone, password })).unwrap();
			console.log("Login successful, token:", result);
			toast.success("Logged in successfully!");
			navigate("/admin");
		} catch (err) {
			const errorMessage = err.message || "Login failed";
			toast.error(errorMessage);
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center'>
			<div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h2 className='text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200'>
					Admin Login
				</h2>
				<form onSubmit={handleLogin}>
					<div className='mb-4'>
						<label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
							Phone Number
						</label>
						<input
							type='text'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
							Password
						</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
							required
						/>
					</div>
					<button
						type='submit'
						className='w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700'
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default AdminLogin;
