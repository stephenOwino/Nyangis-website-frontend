import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../slices/chatSlice";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatWindow = () => {
	const [message, setMessage] = useState("");
	const [client, setClient] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const messages = useSelector((state) => state.chat.messages);
	const dispatch = useDispatch();

	useEffect(() => {
		const sock = new SockJS("http://localhost:9900/chat");
		const stompClient = new Client({
			webSocketFactory: () => sock,
			reconnectDelay: 5000,
			debug: (str) => {
				console.log("STOMP Debug:", str);
			},
		});

		stompClient.onConnect = () => {
			console.log("Connected to STOMP");
			stompClient.subscribe("/topic/messages", (msg) => {
				const newMessage = JSON.parse(msg.body);
				dispatch(addMessage(newMessage));
			});
		};

		stompClient.onStompError = (frame) => {
			console.error("STOMP Error:", frame);
		};

		stompClient.activate();
		setClient(stompClient);

		return () => {
			stompClient.deactivate();
			console.log("Disconnected from STOMP");
		};
	}, [dispatch]);

	const sendMessage = () => {
		if (message.trim() && client) {
			const sender = localStorage.getItem("token") ? "Admin" : "User";
			const chatMessage = { sender, content: message };
			client.publish({
				destination: "/app/chat.send",
				body: JSON.stringify(chatMessage),
			});
			setMessage("");
		}
	};

	return (
		<div className='fixed bottom-4 right-4 z-50'>
			{!isOpen ? (
				<button
					onClick={() => setIsOpen(true)}
					className='bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700'
				>
					💬
				</button>
			) : (
				<div className='w-80 sm:w-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg'>
					<div className='flex justify-between items-center mb-2'>
						<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
							Chat
						</h3>
						<button
							onClick={() => setIsOpen(false)}
							className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
						>
							✕
						</button>
					</div>
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
						placeholder='Type a message...'
						onKeyPress={(e) => e.key === "Enter" && sendMessage()}
					/>
					<button
						onClick={sendMessage}
						className='bg-purple-600 text-white p-2 w-full rounded hover:bg-purple-700'
					>
						Send
					</button>
				</div>
			)}
		</div>
	);
};

export default ChatWindow;
