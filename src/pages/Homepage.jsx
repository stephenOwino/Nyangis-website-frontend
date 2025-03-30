import { useState, useEffect } from "react";
import { useSelector, useDispatch, useNavigate } from "react-redux";
import { fetchProducts, clearError } from "../slices/productSlice";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../../axios"; // Import axiosInstance for baseURL

const HomePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { products, status, error } = useSelector((state) => state.products);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	const filteredProducts = products.filter((product) =>
		product.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleProductClick = (id) => {
		navigate(`/product/${id}`);
	};

	if (status === "loading") {
		return (
			<div className='flex justify-center items-center h-screen'>
				<ClipLoader color='#9333ea' size={50} />
			</div>
		);
	}

	return (
		<div className='p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100 dark:bg-gray-900'>
			<h1 className='text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6'>
				Products
			</h1>
			<input
				type='text'
				placeholder='Search products by description...'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className='w-full max-w-md p-2 mb-6 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
			/>
			{filteredProducts.length === 0 ? (
				<p className='text-center text-gray-600 dark:text-gray-400'>
					No products match your search.
				</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{filteredProducts.map((product) => (
						<div
							key={product.id}
							className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer'
							onClick={() => handleProductClick(product.id)}
						>
							<img
								src={`${axiosInstance.defaults.baseURL}${product.imageUrl}`}
								alt={product.description}
								className='w-full h-48 object-cover'
								onError={(e) =>
									console.error(
										"Homepage image load failed:",
										product.imageUrl,
										e
									)
								}
							/>
							<div className='p-4'>
								<p className='text-[#00CC00] font-bold text-lg'>
									KSh {product.price.toLocaleString()}
								</p>
								<h3 className='text-gray-800 dark:text-gray-200 font-semibold'>
									{product.description.split(" ")[0]}{" "}
									{product.description.split(" ")[1]}
								</h3>
								<p className='text-gray-600 dark:text-gray-400 text-sm'>
									{product.description}
								</p>
								<p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
									📍 {product.location}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default HomePage;
