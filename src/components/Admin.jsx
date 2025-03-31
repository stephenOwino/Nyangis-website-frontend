import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	fetchProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	clearError,
} from "../slices/productSlice";
import { uploadProductImage, clearImageState } from "../slices/ImageSlice";
import { addMessage } from "../slices/chatSlice";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { logout } from "../slices/authSlice";
import axiosInstance from "../../axios";

// ... (other imports and code remain the same)

const Admin = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		products,
		status: productStatus,
		error: productError,
	} = useSelector((state) => state.products);
	const {
		url: imageUrl,
		status: imageStatus,
		error: imageError,
	} = useSelector((state) => state.image);
	const token = useSelector((state) => state.auth.token);
	const messages = useSelector((state) => state.chat.messages);

	const [formData, setFormData] = useState({
		description: "",
		status: "AVAILABLE",
		category: "HOME",
		price: "",
		location: "",
		type: "",
		condition: "BRAND NEW",
	});
	const [image, setImage] = useState(null);
	const [editingProduct, setEditingProduct] = useState(null);
	const [chatClient, setChatClient] = useState(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!token) {
			navigate("/admin/login");
		} else {
			dispatch(fetchProducts()).catch((err) =>
				console.error("Fetch products error:", err)
			);
		}
	}, [token, navigate, dispatch]);

	useEffect(() => {
		const sock = new SockJS("http://localhost:9900/chat");
		const stompClient = new Client({
			webSocketFactory: () => sock,
			reconnectDelay: 5000,
		});

		stompClient.onConnect = () => {
			stompClient.subscribe("/topic/messages", (msg) => {
				const newMessage = JSON.parse(msg.body);
				dispatch(addMessage(newMessage));
			});
		};

		stompClient.activate();
		setChatClient(stompClient);

		return () => stompClient.deactivate();
	}, [dispatch]);

	useEffect(() => {
		if (productError) {
			toast.error(productError);
			dispatch(clearError());
		}
		if (imageError) {
			toast.error(imageError);
			dispatch(clearImageState());
		}
	}, [productError, imageError, dispatch]);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		console.log("Selected image:", file);
		setImage(file);
		if (file) {
			if (!file.type.startsWith("image/")) {
				toast.error("Please select an image file (e.g., .jpg, .png).");
				setImage(null);
				return;
			}
			dispatch(uploadProductImage(file)).catch((err) =>
				console.error("Image upload error:", err)
			);
		} else {
			setImage(null);
			dispatch(clearImageState());
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!formData.description ||
			!formData.status ||
			!formData.category ||
			!formData.price ||
			!formData.location ||
			!formData.type ||
			!formData.condition
		) {
			toast.error("Please fill in all product details.");
			return;
		}

		if (!editingProduct && (!image || !imageUrl)) {
			toast.error(
				"Please upload an image for a new product and wait for the upload to complete."
			);
			return;
		}

		try {
			if (editingProduct) {
				const updatedProductData = {
					...formData,
					imageUrl: imageUrl || editingProduct.imageUrl, // Use new imageUrl if uploaded, otherwise keep existing
				};
				await dispatch(
					updateProduct({
						id: editingProduct.id,
						product: updatedProductData,
					})
				).unwrap();
				toast.success("Product updated successfully!");
			} else {
				const productData = { ...formData, imageUrl };
				const result = await dispatch(createProduct(productData)).unwrap();
				console.log("Created product:", result);
				await dispatch(fetchProducts()).unwrap();
				toast.success("Product created successfully!");
			}
			setFormData({
				description: "",
				status: "AVAILABLE",
				category: "HOME",
				price: "",
				location: "",
				type: "",
				condition: "BRAND NEW",
			});
			setImage(null);
			setEditingProduct(null);
			dispatch(clearImageState());
		} catch (err) {
			console.error("Failed to save product:", err);
			const errorMessage = err.message || err || "Unknown error";
			toast.error(`Failed to save product: ${errorMessage}`);
		}
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		setFormData({
			description: product.description,
			status: product.status,
			category: product.category,
			price: product.price,
			location: product.location,
			type: product.type,
			condition: product.condition,
		});
		setImage(null);
		dispatch(clearImageState());
	};

	const handleDelete = (id) => {
		dispatch(deleteProduct(id))
			.then(() => {
				toast.success("Product deleted successfully!");
			})
			.catch((err) => console.error("Delete error:", err));
	};

	const handleLogout = () => {
		dispatch(logout());
		navigate("/admin/login");
		toast.success("Logged out successfully!");
	};

	const sendAdminMessage = () => {
		if (message.trim() && chatClient) {
			const chatMessage = { sender: "Admin", content: message };
			chatClient.publish({
				destination: "/app/chat.send",
				body: JSON.stringify(chatMessage),
			});
			setMessage("");
		}
	};

	return (
		<div className='p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100 dark:bg-gray-900'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold text-gray-800 dark:text-gray-200'>
					Admin Dashboard
				</h1>
				<button
					onClick={handleLogout}
					className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
				>
					Logout
				</button>
			</div>

			<div className='mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
				<h2 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200'>
					{editingProduct ? "Edit Product" : "Add Product"}
				</h2>
				<form onSubmit={handleSubmit} className='max-w-md mx-auto'>
					<div className='mb-4'>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2'
							htmlFor='description'
						>
							Description
						</label>
						<input
							type='text'
							id='description'
							name='description'
							value={formData.description}
							onChange={handleInputChange}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
							required
						/>
					</div>
					<div className='mb-4'>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2'
							htmlFor='status'
						>
							Status
						</label>
						<select
							id='status'
							name='status'
							value={formData.status}
							onChange={handleInputChange}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
						>
							<option value='AVAILABLE'>Available</option>
							<option value='SOLD'>Sold</option>
						</select>
					</div>
					<div className='mb-4'>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2'
							htmlFor='category'
						>
							Category
						</label>
						<select
							id='category'
							name='category'
							value={formData.category}
							onChange={handleInputChange}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
						>
							<option value='HOME'>Home</option>
							<option value='OFFICE'>Office</option>
						</select>
					</div>
					<div className='mb-4'>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2'
							htmlFor='price'
						>
							Price (KSh)
						</label>
						<input
							type='number'
							id='price'
							name='price'
							value={formData.price}
							onChange={handleInputChange}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
							required
						/>
					</div>
					<div className='mb-4'>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2'
							htmlFor='location'
						>
							Location
						</label>
						<input
							type='text'
							id='location'
							name='location'
							value={formData.location}
							onChange={handleInputChange}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
							required
						/>
					</div>
					<div className='mb-4'>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2'
							htmlFor='type'
						>
							Type
						</label>
						<input
							type='text'
							id='type'
							name='type'
							value={formData.type}
							onChange={handleInputChange}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
							required
						/>
					</div>
					<div className='mb-4'>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2'
							htmlFor='condition'
						>
							Condition
						</label>
						<select
							id='condition'
							name='condition'
							value={formData.condition}
							onChange={handleInputChange}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
						>
							<option value='BRAND NEW'>Brand New</option>
							<option value='USED'>Used</option>
						</select>
					</div>
					<div className='mb-4'>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-2'
							htmlFor='image'
						>
							Image
						</label>
						<input
							type='file'
							id='image'
							accept='image/*'
							onChange={handleImageChange}
							className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100'
							required={!editingProduct}
						/>
						{imageStatus === "loading" && (
							<div className='mt-2 flex items-center'>
								<ClipLoader color='#9333ea' size={20} />
								<span className='ml-2 text-gray-600 dark:text-gray-400'>
									Uploading image...
								</span>
							</div>
						)}
						{imageUrl && (
							<div className='mt-2'>
								<img
									src={`${axiosInstance.defaults.baseURL}${imageUrl}`}
									alt='Preview'
									className='w-32 h-32 object-cover rounded'
									onError={(e) => {
										e.target.src =
											"https://via.placeholder.com/150?text=No+Image";
										console.error("Preview image load failed:", e);
									}}
								/>
							</div>
						)}
					</div>
					<button
						type='submit'
						disabled={productStatus === "loading" || imageStatus === "loading"}
						className={`w-full py-2 px-4 rounded text-white font-semibold ${
							productStatus === "loading" || imageStatus === "loading"
								? "bg-gray-400 cursor-not-allowed"
								: "bg-purple-600 hover:bg-purple-700"
						}`}
					>
						{productStatus === "loading"
							? "Saving..."
							: editingProduct
							? "Update Product"
							: "Add Product"}
					</button>
					{editingProduct && (
						<button
							type='button'
							onClick={() => {
								setEditingProduct(null);
								setFormData({
									description: "",
									status: "AVAILABLE",
									category: "HOME",
									price: "",
									location: "",
									type: "",
									condition: "BRAND NEW",
								});
								setImage(null);
								dispatch(clearImageState());
							}}
							className='w-full mt-2 py-2 px-4 rounded text-white font-semibold bg-gray-600 hover:bg-gray-700'
						>
							Cancel
						</button>
					)}
				</form>
			</div>

			<div>
				<h2 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200'>
					Products
				</h2>
				{productStatus === "loading" ? (
					<div className='flex justify-center items-center h-64'>
						<ClipLoader color='#9333ea' size={50} />
					</div>
				) : products.length === 0 ? (
					<p className='text-center text-gray-600 dark:text-gray-400'>
						No products available.
					</p>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
						{products.map((product) => (
							<div
								key={product.id}
								className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md'
							>
								<img
									src={
										product.imageUrl
											? `${axiosInstance.defaults.baseURL}${product.imageUrl}`
											: "https://via.placeholder.com/150?text=No+Image"
									}
									alt={product.description}
									className='w-full h-48 object-cover rounded mb-4'
									onError={(e) => {
										e.target.src =
											"https://via.placeholder.com/150?text=No+Image";
										console.error(
											"Product image load failed:",
											product.imageUrl,
											e
										);
									}}
								/>
								<p className='text-gray-600 dark:text-gray-400'>
									{product.description}
								</p>
								<p className='text-purple-600 font-bold'>{product.status}</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>
									Category: {product.category}
								</p>
								<div className='mt-4 flex space-x-2'>
									<button
										onClick={() => handleEdit(product)}
										className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700'
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(product.id)}
										className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<div className='mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
				<h2 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200'>
					Chat Inquiries
				</h2>
				<div className='h-48 overflow-y-auto mb-2 p-2 border border-gray-200 dark:border-gray-700 rounded'>
					{messages.map((msg, index) => (
						<div key={index} className='mb-2'>
							<span className='font-bold text-gray-800 dark:text-gray-200'>
								{msg.sender}:
							</span>{" "}
							<span className='text-gray-600 dark:text-gray-400'>
								{msg.content}
							</span>
						</div>
					))}
				</div>
				<input
					type='text'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className='border p-2 w-full mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
					placeholder='Reply to inquiries...'
					onKeyPress={(e) => e.key === "Enter" && sendAdminMessage()}
				/>
				<button
					onClick={sendAdminMessage}
					className='bg-purple-600 text-white p-2 w-full rounded hover:bg-purple-700'
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default Admin;
