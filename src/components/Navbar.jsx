import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaWhatsapp } from "react-icons/fa";

const Navbar = ({ toggleDarkMode, isDarkMode, onSearch }) => {
	const location = useLocation();
	const isAdmin = location.pathname.startsWith("/admin");
	const [searchQuery, setSearchQuery] = useState(""); // State for search query
	const [isContactModalOpen, setIsContactModalOpen] = useState(false); // State for contact modal
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // State for user dropdown

	// Handle search input change
	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		if (onSearch) {
			onSearch(query); // Pass the search query to the parent component
		}
	};

	// WhatsApp link
	const whatsappNumber = "254711850739";
	const whatsappMessage = encodeURIComponent(
		"Hello, I would like to know more about your products and services."
	);
	const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

	// Animation variants for contact modal and user dropdown
	const modalVariants = {
		hidden: { opacity: 0, y: -10 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: "easeOut",
				staggerChildren: 0.1,
			},
		},
	};

	const modalItemVariants = {
		hidden: { opacity: 0, x: -10 },
		visible: { opacity: 1, x: 0 },
	};

	return (
		<motion.nav
			initial={{ y: -50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className='bg-blue-900 dark:bg-black text-white p-4 flex flex-col sm:flex-row justify-between items-center fixed top-0 left-0 w-full z-50 shadow-lg'
		>
			{/* Brand Logo (Left) */}
			<motion.div
				whileHover={{ scale: 1.1 }}
				transition={{ type: "spring", stiffness: 300 }}
				className='mb-2 sm:mb-0'
			>
				<Link to='/' className='text-xl font-bold'>
					Art The Wall
				</Link>
			</motion.div>

			{/* Search Bar (Center) */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='flex items-center w-full sm:w-auto mb-2 sm:mb-0 order-1 sm:order-2'
			>
				<input
					type='text'
					placeholder='Search products...'
					value={searchQuery}
					onChange={handleSearchChange}
					className='bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64'
				/>
				<button className='bg-blue-700 dark:bg-gray-700 text-white px-4 py-2 rounded-r-lg hover:bg-blue-800 dark:hover:bg-gray-600 transition-colors duration-300'>
					<svg
						className='w-5 h-5'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
						/>
					</svg>
				</button>
			</motion.div>

			{/* Right Side: Contact Us, Admin Links, User Icon, Dark Mode Toggle */}
			<div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-12 items-center order-2 sm:order-3'>
				{/* Contact Us Link with Modal */}
				<div className='relative'>
					<motion.div
						whileHover={{ x: 5 }}
						transition={{ type: "spring", stiffness: 200 }}
						onMouseEnter={() => setIsContactModalOpen(true)}
						onMouseLeave={() => setIsContactModalOpen(false)}
					>
						<span className='hover:underline cursor-pointer'>Contact Us</span>
					</motion.div>

					{/* Contact Modal */}
					{isContactModalOpen && (
						<motion.div
							variants={modalVariants}
							initial='hidden'
							animate='visible'
							className='absolute top-full left-4 mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg shadow-lg z-50 w-64'
							onMouseEnter={() => setIsContactModalOpen(true)}
							onMouseLeave={() => setIsContactModalOpen(false)}
						>
							<motion.div
								variants={modalItemVariants}
								className='flex items-center space-x-2 mb-2'
							>
								<FaWhatsapp className='text-green-500' />
								<a
									href={whatsappLink}
									target='_blank'
									rel='noopener noreferrer'
									className='hover:underline'
								>
									0711 850 739
								</a>
							</motion.div>
							<motion.div
								variants={modalItemVariants}
								className='flex items-center space-x-2 mb-2'
							>
								<span>✉️</span>
								<a
									href='mailto:berilanyango52@gmail.com'
									className='hover:underline'
								>
									berilanyango52@gmail.com
								</a>
							</motion.div>
							<motion.div
								variants={modalItemVariants}
								className='flex items-center space-x-2'
							>
								<span>✉️</span>
								<a
									href='mailto:Beril.owino@outlook.com'
									className='hover:underline'
								>
									Beril.owino@outlook.com
								</a>
							</motion.div>
						</motion.div>
					)}
				</div>

				{/* Admin Links */}
				{!isAdmin && (
					<motion.div
						whileHover={{ x: 5 }}
						transition={{ type: "spring", stiffness: 200 }}
					>
						<Link to='/admin/login' className='hover:underline'>
							Admin
						</Link>
					</motion.div>
				)}
				{isAdmin && (
					<>
						<motion.div
							whileHover={{ x: 5 }}
							transition={{ type: "spring", stiffness: 200 }}
						>
							<Link to='/admin' className='hover:underline'>
								Dashboard
							</Link>
						</motion.div>
						<motion.div
							whileHover={{ x: 5 }}
							transition={{ type: "spring", stiffness: 200 }}
						>
							<Link to='/admin/login' className='hover:underline'>
								Logout
							</Link>
						</motion.div>
					</>
				)}

				{/* User Icon with Dropdown */}
				<div className='relative'>
					<motion.div
						whileHover={{ scale: 1.1 }}
						transition={{ type: "spring", stiffness: 200 }}
						onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
						className='cursor-pointer'
					>
						<FaUser className='text-xl' />
					</motion.div>

					{/* User Dropdown */}
					{isUserDropdownOpen && (
						<motion.div
							variants={modalVariants}
							initial='hidden'
							animate='visible'
							className='absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg shadow-lg z-50 w-40'
						>
							<motion.div variants={modalItemVariants} className='mb-2'>
								<Link
									to='/register'
									className='block px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-center'
									onClick={() => setIsUserDropdownOpen(false)}
								>
									Register
								</Link>
							</motion.div>
							<motion.div variants={modalItemVariants}>
								<Link
									to='/login'
									className='block px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-center'
									onClick={() => setIsUserDropdownOpen(false)}
								>
									Login
								</Link>
							</motion.div>
						</motion.div>
					)}
				</div>

				{/* Dark Mode Toggle */}
				<motion.button
					whileHover={{ rotate: 360 }}
					transition={{ duration: 0.5 }}
					onClick={() => {
						console.log("Dark mode toggle clicked, current mode:", isDarkMode);
						toggleDarkMode();
					}}
					className='focus:outline-none'
				>
					{isDarkMode ? "☀️" : "🌙"}
				</motion.button>
			</div>
		</motion.nav>
	);
};

export default Navbar;
