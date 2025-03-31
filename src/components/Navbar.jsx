import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = ({ toggleDarkMode, isDarkMode, onSearch }) => {
	const location = useLocation();
	const isAdmin = location.pathname.startsWith("/admin");
	const [searchQuery, setSearchQuery] = useState(""); // State for search query

	// Handle search input change
	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		if (onSearch) {
			onSearch(query); // Pass the search query to the parent component
		}
	};

	// Animation variants for contact info
	const contactVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
				staggerChildren: 0.2,
			},
		},
	};

	const contactItemVariants = {
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
			{/* Brand Logo */}
			<motion.div
				whileHover={{ scale: 1.1 }}
				transition={{ type: "spring", stiffness: 300 }}
			>
				<Link to='/' className='text-xl font-bold mb-2 sm:mb-0'>
					Art The Wall
				</Link>
			</motion.div>

			{/* Search Bar */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='flex items-center w-full sm:w-auto mb-2 sm:mb-0'
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

			{/* Navigation Links and Dark Mode Toggle */}
			<div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center'>
				{!isAdmin && (
					<>
						<motion.div
							whileHover={{ x: 5 }}
							transition={{ type: "spring", stiffness: 200 }}
						>
							<Link to='/' className='hover:underline'>
								Home
							</Link>
						</motion.div>
						<motion.div
							whileHover={{ x: 5 }}
							transition={{ type: "spring", stiffness: 200 }}
						>
							<Link to='/admin/login' className='hover:underline'>
								Admin
							</Link>
						</motion.div>
					</>
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
				<motion.button
					whileHover={{ rotate: 360 }}
					transition={{ duration: 0.5 }}
					onClick={toggleDarkMode}
					className='focus:outline-none'
				>
					{isDarkMode ? "☀️" : "🌙"}
				</motion.button>
			</div>

			{/* Contact Information */}
			<motion.div
				className='flex flex-col sm:flex-row items-center sm:space-x-4 mt-2 sm:mt-0 text-sm font-medium'
				variants={contactVariants}
				initial='hidden'
				animate='visible'
			>
				<motion.div
					variants={contactItemVariants}
					className='flex items-center space-x-1'
					whileHover={{ scale: 1.05 }}
				>
					<span className='hidden sm:inline'>📞</span>
					<a href='tel:+254711850739' className='hover:underline'>
						0711 850 739
					</a>
				</motion.div>
				<motion.div
					variants={contactItemVariants}
					className='flex items-center space-x-1'
					whileHover={{ scale: 1.05 }}
				>
					<span className='hidden sm:inline'>✉️</span>
					<a href='mailto:berilanyango52@gmail.com' className='hover:underline'>
						berilanyango52@gmail.com
					</a>
				</motion.div>
				<motion.div
					variants={contactItemVariants}
					className='flex items-center space-x-1'
					whileHover={{ scale: 1.05 }}
				>
					<span className='hidden sm:inline'>✉️</span>
					<a href='mailto:Beril.owino@outlook.com' className='hover:underline'>
						Beril.owino@outlook.com
					</a>
				</motion.div>
			</motion.div>
		</motion.nav>
	);
};

export default Navbar;
