// src/components/ProductDetails.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
	fetchProductById,
	clearError,
	clearSelectedProduct,
} from "../slices/productSlice";
import { addMessage } from "../slices/chatSlice";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../../axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ProductDetails = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		selectedProduct: product,
		status,
		error,
	} = useSelector((state) => state.products);
	const messages = useSelector((state) => state.chat.messages);
	const [chatClient, setChatClient] = useState(null);
	const [message, setMessage] = useState("");
	const [showContact, setShowContact] = useState(false);

	useEffect(() => {
		dispatch(fetchProductById(id));

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

		return () => {
			stompClient.deactivate();
			dispatch(clearSelectedProduct());
		};
	}, [id, dispatch]);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	const sendMessage = () => {
		if (message.trim() && chatClient) {
			const chatMessage = { sender: "Customer", content: message };
			chatClient.publish({
				destination: "/app/chat.send",
				body: JSON.stringify(chatMessage),
			});
			setMessage("");
		}
	};

	const formatTimeAgo = (timestamp) => {
		if (!timestamp) return "Just now";
		const now = Date.now();
		const diff = Math.floor((now - timestamp) / 1000); // Difference in seconds
		if (diff < 60) return `${diff} seconds ago`;
		const minutes = Math.floor(diff / 60);
		if (minutes < 60) return `${minutes} minutes ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} hours ago`;
		const days = Math.floor(hours / 24);
		return `${days} days ago`;
	};

	if (status === "loading" || !product) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<ClipLoader color='#9333ea' size={50} />
			</div>
		);
	}

	return (
		<div className='p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100 dark:bg-gray-900'>
			<div className='max-w-4xl mx-auto'>
				{/* Product Image and Main Info */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6'>
					<img
						src={`${axiosInstance.defaults.baseURL}${product.imageUrl}`}
						alt={product.description}
						className='w-full h-64 object-cover rounded mb-4'
						onError={(e) =>
							console.error(
								"Product details image load failed:",
								product.imageUrl,
								e
							)
						}
					/>
					<p className='text-[#00CC00] font-bold text-xl mb-2'>
						KSh {product.price.toLocaleString()}
					</p>
					<button
						className='w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded mb-4'
						onClick={() => toast.success("Call back requested!")}
					>
						Request call back
					</button>
					<div className='flex space-x-2 mb-4'>
						<button
							className='flex-1 bg-green-600 text-white py-2 rounded flex items-center justify-center'
							onClick={() => setShowContact(!showContact)}
						>
							<span className='mr-2'>📞</span> Show contact
						</button>
						<button
							className='flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded flex items-center justify-center'
							onClick={() =>
								document
									.getElementById("chat-section")
									.scrollIntoView({ behavior: "smooth" })
							}
						>
							<span className='mr-2'>💬</span> Start chat
						</button>
					</div>
					{showContact && (
						<div className='bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4'>
							<p className='text-gray-800 dark:text-gray-200'>
								📞{" "}
								<a href='tel:+254711850739' className='hover:underline'>
									0711 850 739
								</a>
							</p>
							<p className='text-gray-800 dark:text-gray-200'>
								✉️{" "}
								<a
									href='mailto:berilanyango52@gmail.com'
									className='hover:underline'
								>
									berilanyango52@gmail.com
								</a>
							</p>
							<p className='text-gray-800 dark:text-gray-200'>
								✉️{" "}
								<a
									href='mailto:Beril.owino@outlook.com'
									className='hover:underline'
								>
									Beril.owino@outlook.com
								</a>
							</p>
						</div>
					)}
					<div className='border-t pt-4'>
						<p className='text-gray-800 dark:text-gray-200 font-semibold'>
							Shop n BUY LTD
						</p>
						<p className='text-gray-600 dark:text-gray-400 text-sm'>
							Typically replies within a few hours
						</p>
						<p className='text-gray-600 dark:text-gray-400 text-sm'>
							4 y 6 m on Jiji
						</p>
					</div>
				</div>

				{/* Product Details */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6'>
					<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
						{product.description.split(" ")[0]}{" "}
						{product.description.split(" ")[1]}
					</h2>
					<p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
						Sponsored 📍 {product.location}, {formatTimeAgo(product.postedAt)}
					</p>
					<p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
						👁️ {product.views} views
					</p>
					<p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
						{product.description}
					</p>
					<p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
						TYPE: {product.type}
					</p>
					<p className='text-gray-600 dark:text-gray-400 text-sm'>
						CONDITION: {product.condition}
					</p>
				</div>

				{/* Safety Tips */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6'>
					<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
						Safety tips
					</h3>
					<ul className='text-gray-600 dark:text-gray-400 text-sm list-disc pl-5'>
						<li>Avoid paying in advance, even for delivery</li>
						<li>Meet with the seller at a safe public place</li>
						<li>Inspect the item and ensure it’s exactly what you want</li>
						<li>Make sure that the packed item is the one you’ve inspected</li>
						<li>Only pay if you’re satisfied</li>
					</ul>
				</div>

				{/* Post Ad Link */}
				<div className='text-right'>
					<a
						href='/admin'
						className='text-green-600 dark:text-green-400 font-semibold hover:underline'
					>
						Post Ad Like This
					</a>
				</div>

				{/* Chat Section */}
				<div
					id='chat-section'
					className='mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'
				>
					<h2 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200'>
						Chat with Seller
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
						placeholder='Type your message...'
						onKeyPress={(e) => e.key === "Enter" && sendMessage()}
					/>
					<button
						onClick={sendMessage}
						className='bg-purple-600 text-white p-2 w-full rounded hover:bg-purple-700'
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
