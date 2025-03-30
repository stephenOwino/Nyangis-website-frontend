import { motion } from "framer-motion";

const ProductCard = ({ product, onEdit, onDelete }) => {
	return (
		<motion.div
			whileHover={{ scale: 1.05 }}
			className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300'
		>
			<img
				src={product.imageUrl}
				alt={product.description}
				className='w-full h-48 object-cover rounded-md mb-4'
			/>
			<h3 className='text-lg font-semibold mt-2 text-gray-800 dark:text-gray-200 truncate'>
				{product.description}
			</h3>
			<p className='text-purple-600 font-bold'>{product.status}</p>
			<p className='text-sm text-gray-500 dark:text-gray-400'>
				Category: {product.category}
			</p>
			{onEdit && onDelete && (
				<div className='mt-4 flex space-x-2'>
					<button
						onClick={() => onEdit(product)}
						className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors'
					>
						Edit
					</button>
					<button
						onClick={() => onDelete(product.id)}
						className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
					>
						Delete
					</button>
				</div>
			)}
		</motion.div>
	);
};

export default ProductCard;
