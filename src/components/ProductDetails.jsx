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
			onConnect: () => {
				stompClient.subscribe("/topic/messages", (msg) => {
					const newMessage = JSON.parse(msg.body);
					dispatch(addMessage(newMessage));
				});
			},
			onStompError: (frame) => {
				console.error("WebSocket error:", frame);
				toast.error("Failed to connect to chat. Please try again later.");
			},
			onWebSocketError: (error) => {
				console.error("WebSocket connection error:", error);
				toast.error("Chat connection failed. Please check your network.");
			},
		});

		stompClient.activate();
		setChatClient(stompClient);

		return () => {
			stompClient.deactivate();
			setChatClient(null);
			dispatch(clearSelectedProduct());
		};
	}, [id, dispatch]);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch(clearError());
			navigate("/", { state: { error: "Product not found." } });
		}
	}, [error, dispatch, navigate]);

	const sendMessage = () => {
		if (message.trim() && chatClient && chatClient.connected) {
			const chatMessage = { sender: "Customer", content: message };
			chatClient.publish({
				destination: "/app/chat.send",
				body: JSON.stringify(chatMessage),
			});
			setMessage("");
		} else if (!chatClient?.connected) {
			toast.error("Chat is not connected. Please try again later.");
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

	if (status === "loading") {
		return (
			<div className='flex justify-center items-center h-screen'>
				<ClipLoader color='#9333ea' size={50} />
			</div>
		);
	}

	if (!product) {
		return (
			<div className='p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='max-w-5xl mx-auto text-center'>
					<p className='text-gray-600 dark:text-gray-400 text-lg'>
						Product not found.
					</p>
					<button
						onClick={() => navigate("/")}
						className='mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300'
					>
						Back to Homepage
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900'>
			<div className='max-w-5xl mx-auto'>
				{/* Back Button */}
				<button
					onClick={() => navigate("/")}
					className='mb-6 text-purple-600 dark:text-purple-400 hover:underline flex items-center text-lg font-medium'
				>
					<svg
						className='w-5 h-5 mr-2'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M15 19l-7-7 7-7'
						/>
					</svg>
					Back to Homepage
				</button>

				{/* Main Content - Grid Layout */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Left Section: Product Image, Seller Info, and Details */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Product Image and Seller Info */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
							<img
								src={
									product.imageUrl
										? `${axiosInstance.defaults.baseURL}${product.imageUrl}`
										: "https://via.placeholder.com/300?text=No+Image"
								}
								alt={product.description || "Product"}
								className='w-full h-80 object-contain rounded-lg border border-gray-200 dark:border-gray-700 mb-6'
								onError={(e) => {
									e.target.src =
										"https://via.placeholder.com/300?text=No+Image";
									console.error(
										"Product details image load failed:",
										product.imageUrl,
										e
									);
								}}
							/>
							<div className='flex space-x-3 mb-6'>
								<button
									className='flex-1 bg-blue-900 text-white py-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition-all duration-300'
									onClick={() => setShowContact(!showContact)}
								>
									<span className='mr-2'>📞</span>{" "}
									{showContact ? "Hide Contact" : "Show Contact"}
								</button>
								<button
									className='flex-1 bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-all duration-300'
									onClick={() =>
										document
											.getElementById("chat-section")
											.scrollIntoView({ behavior: "smooth" })
									}
								>
									<span className='mr-2'>💬</span> Start Chat
								</button>
							</div>
							{showContact && (
								<div className='bg-gray-100 dark:bg-blue-900 p-4 rounded-lg mb-6'>
									<p className='text-gray-800 dark:text-gray-200 text-sm'>
										<span className='mr-2'>📞</span>
										<a href='tel:+254711850739' className='hover:underline'>
											0711 850 739
										</a>
									</p>
									<p className='text-gray-800 dark:text-gray-200 text-sm'>
										<span className='mr-2'>✉️</span>
										<a
											href='mailto:berilanyango52@gmail.com'
											className='hover:underline'
										>
											berilanyango52@gmail.com
										</a>
									</p>
									<p className='text-gray-800 dark:text-gray-200 text-sm'>
										<span className='mr-2'>✉️</span>
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
								<p className='text-gray-800 dark:text-gray-200 font-semibold text-lg'>
									Shop n BUY LTD
								</p>
								<p className='text-gray-600 dark:text-gray-400 text-sm'>
									Typically replies within a few hours
								</p>
								<p className='text-gray-600 dark:text-gray-400 text-sm'>
									4 years 6 months on Avante Garde
								</p>
							</div>
						</div>

						{/* Product Details */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
							<h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3'>
								{(product.description || "").split(" ")[0] || "Product"}{" "}
								{(product.description || "").split(" ")[1] || ""}
							</h2>
							<p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
								📍 {product.location || "Unknown location"},{" "}
								{formatTimeAgo(product.postedAt)}
							</p>
							<p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
								👁️ {product.views || 0} views
							</p>
							<p className='text-gray-600 dark:text-gray-400 text-base mb-3'>
								{product.description || "No description available"}
							</p>
							<p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
								<span className='font-medium'>Type:</span>{" "}
								{product.type || "N/A"}
							</p>
							<p className='text-gray-600 dark:text-gray-400 text-sm'>
								<span className='font-medium'>Condition:</span>{" "}
								{product.condition || "N/A"}
							</p>
						</div>
					</div>

					{/* Right Section: Price and Safety Tips */}
					<div className='lg:col-span-1 space-y-6'>
						{/* Price and Call Back */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6'>
							<p className='text-blue-900 font-bold text-2xl mb-4'>
								KSh {(product.price || 0).toLocaleString()}
							</p>
							<button
								className='w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300'
								onClick={() => toast.success("Call back requested!")}
							>
								Request Call Back
							</button>
						</div>

						{/* Safety Tips */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
							<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3'>
								Safety Tips
							</h3>
							<ul className='text-gray-600 dark:text-gray-400 text-sm list-disc pl-5 space-y-2'>
								<li>Avoid paying in advance, even for delivery</li>
								<li>Meet with the seller at a safe public place</li>
								<li>Inspect the item and ensure it’s exactly what you want</li>
								<li>
									Make sure that the packed item is the one you’ve inspected
								</li>
								<li>Only pay if you’re satisfied</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Post Ad Link */}
				<div className='text-right mt-6'>
					<a
						href='/admin'
						className='text-green-600 dark:text-green-400 font-semibold hover:underline text-lg'
					>
						Post Ad Like This
					</a>
				</div>

				{/* Chat Section */}
				<div
					id='chat-section'
					className='mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'
				>
					<h2 className='text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200'>
						Chat with Seller
					</h2>
					<p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
						No account needed to chat! Start the conversation below.
					</p>
					<div className='h-48 overflow-y-auto mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg'>
						{messages.length === 0 ? (
							<p className='text-gray-600 dark:text-gray-400 text-sm'>
								No messages yet. Start the conversation!
							</p>
						) : (
							messages.map((msg, index) => (
								<div key={index} className='mb-2'>
									<span className='font-bold text-gray-800 dark:text-gray-200'>
										{msg.sender}:
									</span>{" "}
									<span className='text-gray-600 dark:text-gray-400'>
										{msg.content}
									</span>
								</div>
							))
						)}
					</div>
					<div className='flex space-x-3'>
						<input
							type='text'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className='border border-gray-300 dark:border-gray-600 p-3 w-full rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300'
							placeholder='Type your message...'
							onKeyPress={(e) => e.key === "Enter" && sendMessage()}
						/>
						<button
							onClick={sendMessage}
							className='bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300'
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
