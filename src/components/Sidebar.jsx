import { motion } from "framer-motion";

const Sidebar = ({ isOpen, toggleSidebar, onFilter }) => {
	return (
		<motion.div
			initial={{ x: "-100%" }}
			animate={{ x: isOpen ? 0 : "-100%" }}
			transition={{ type: "spring", stiffness: 100 }}
			className='fixed top-0 left-0 h-full w-64 bg-purple-600 dark:bg-black text-white p-4 z-50'
		>
			<button onClick={toggleSidebar} className='mb-4 text-xl'>
				✕
			</button>
			<h2 className='text-xl font-bold mb-4'>Filters</h2>
			<button
				onClick={() => onFilter("")}
				className='block mb-2 hover:underline text-left w-full'
			>
				All
			</button>
			<button
				onClick={() => onFilter("HOME")}
				className='block mb-2 hover:underline text-left w-full'
			>
				Home
			</button>
			<button
				onClick={() => onFilter("OFFICE")}
				className='block mb-2 hover:underline text-left w-full'
			>
				Office
			</button>
		</motion.div>
	);
};

export default Sidebar;
