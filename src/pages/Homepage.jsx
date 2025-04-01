import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchProductsByCategory } from "../slices/productSlice";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../axios";
import SkeletonLoader from "../components/SkeletonLoader.jsx";

// Carousel image URLs
const carouselImages = [
	"https://m.media-amazon.com/images/I/71XPAIGq1WL._AC_SL1200_.jpg",
	"https://nordicwallart.com/cdn/shop/files/Sf37bedac2ed04684b62ddcedce563f2bQ.webp?v=1713551172&width=1445",
	"https://i5.walmartimages.com/asr/d40cd527-885b-4abd-a277-2095c4c2b5d4.37b81223f5896824a1cd93db7d84240f.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
	"https://plus.unsplash.com/premium_photo-1706152482918-b3fb39dbd4b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	"https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1920&auto=format&fit=crop",
	"https://i.pinimg.com/736x/3d/27/93/3d27937645f3343a5cf86ae4c539c251.jpg",
	"https://5ddiamondpaintings.com/cdn/shop/files/51fb38a76f45412d94a4eaa49a1d98d9-goods_800x.jpg?v=1731101389",
	"https://goldengate.mv/cdn/shop/files/15_700x700.jpg?v=1690392796",
	"https://m.media-amazon.com/images/I/81btGGhatlL._AC_UF894,1000_QL80_.jpg",
	"https://morimora.com/cdn/shop/files/FlowerofLifeMetalDuvarDekoru_3.jpg?v=1702553706&width=1080",
];

const HomePage = ({ searchQuery }) => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { products, status, error } = useSelector((state) => state.products);
	const [category, setCategory] = useState("");
	const [categories] = useState(["Home", "Office"]);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false); // For pause-on-hover

	// Filter products based on search query
	const filteredProducts = products.filter((product) =>
		product.description
			?.toLowerCase()
			.includes(searchQuery?.toLowerCase() || "")
	);

	// Carousel auto-transition every 5 seconds
	useEffect(() => {
		if (isPaused) return;
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) =>
				prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
			);
		}, 5000);

		return () => clearInterval(interval); // Cleanup on unmount
	}, [isPaused]);

	// Handle manual navigation for the carousel
	const goToImage = (index) => {
		setCurrentImageIndex(index);
	};

	const goToPrevious = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
		);
	};

	const goToNext = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
		);
	};

	useEffect(() => {
		if (location.state?.error) {
			toast.error(location.state.error);
		}
	}, [location.state]);

	useEffect(() => {
		if (category) {
			dispatch(fetchProductsByCategory({ category, page: 0, size: 10 }));
		} else {
			dispatch(fetchProducts({ page: 0, size: 10 }));
		}
	}, [category, dispatch]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	if (status === "loading") {
		return <SkeletonLoader />;
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			{/* Reset body margin to ensure full width */}
			<style>
				{`
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
          }
        `}
			</style>

			{/* Carousel Section - Static at the Top */}
			<div className='relative w-full h-[600px] overflow-hidden'>
				<div
					className='relative w-full h-full'
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					{/* Images */}
					{carouselImages.map((image, index) => (
						<img
							key={index}
							src={image}
							alt={`Wall Art ${index + 1}`}
							className={`absolute top-20 left-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out bg-gray-200 dark:bg-gray-800 ${
								index === currentImageIndex ? "opacity-100" : "opacity-0"
							}`}
							loading='lazy'
						/>
					))}

					{/* Semi-Transparent Gray Overlay */}
					<div className='absolute top-20 left-0 w-full h-full bg-gray-900/50 z-10' />

					{/* Text Overlay */}
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20'>
						<h1 className='text-5xl font-bold text-white mb-4 tracking-tight shadow-md'>
							Welcome to Avant_Kor_Ot
						</h1>
						<p className='text-xl text-white max-w-md mx-auto leading-relaxed shadow-md'>
							Our Wall Art pieces have a true Avant-garde style modern, daring,
							and unique. Let us help you transform that plain wall.
						</p>
					</div>

					{/* Navigation Arrows - Always Visible */}
					<button
						onClick={goToPrevious}
						className='absolute top-1/2 left-6 transform -translate-y-1/2 bg-blue-900 text-white p-3 rounded-full hover:bg-blue-950 transition-all duration-500 z-30'
					>
						<svg
							className='w-6 h-6'
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
					</button>
					<button
						onClick={goToNext}
						className='absolute top-1/2 right-6 transform -translate-y-1/2 bg-blue-900 text-white p-3 rounded-full hover:bg-blue-950 transition-all duration-500 z-30'
					>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M9 5l7 7-7 7'
							/>
						</svg>
					</button>

					{/* Navigation Dots - Always Visible */}
					<div className='absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-30'>
						{carouselImages.map((_, index) => (
							<button
								key={index}
								onClick={() => goToImage(index)}
								className={`w-4 h-4 rounded-full transition-all duration-300 ${
									index === currentImageIndex
										? "bg-blue-900 scale-125"
										: "bg-gray-300 hover:bg-gray-400"
								}`}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Main Content - Below the Carousel */}
			<div className='pt-20'>
				<div className='py-12 px-12 sm:px-10 lg:px-20'>
					<div className='max-w-5xl mx-auto'>
						{/* Header */}
						<h1 className='text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 tracking-tight'>
							Wall Art Collection
						</h1>

						{/* Category Filter */}
						<div className='mb-10'>
							<label
								htmlFor='category'
								className='block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3'
							>
								Filter by Category
							</label>
							<select
								id='category'
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className='border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full sm:w-72 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300'
							>
								<option value=''>All Categories</option>
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
						</div>

						{/* Product Grid - 4 Products per Row */}
						{filteredProducts.length === 0 ? (
							<p className='text-center text-gray-500 dark:text-gray-400 text-lg bg-white dark:bg-gray-800 p-4 rounded-lg'>
								No products found.
							</p>
						) : (
							<div className='border-2 border-blue-900 rounded-xl p-6'>
								<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
									{filteredProducts.map((product) => (
										<Link
											key={product.id}
											to={`/product/${product.id}`}
											className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
										>
											{/* Product Image */}
											<div className='relative w-full h-56 mb-4'>
												<img
													src={
														product.imageUrl
															? `${axiosInstance.defaults.baseURL}${product.imageUrl}`
															: "https://via.placeholder.com/150?text=No+Image"
													}
													alt={product.description || "Product"}
													className='w-full h-full object-cover rounded-lg'
													onError={(e) => {
														e.target.src =
															"https://via.placeholder.com/150?text=No+Image";
														console.error(
															"Product image load failed:",
															product.imageUrl,
															e
														);
													}}
													loading='lazy'
												/>
											</div>

											{/* Product Details */}
											<div className='space-y-1'>
												{/* Price */}
												<p className='text-blue-900 font-bold text-xl'>
													KSh {(product.price || 0).toLocaleString()}
												</p>

												{/* Description */}
												<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 truncate'>
													{product.description || "No description"}
												</h3>

												{/* Secondary Details */}
												<div className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
													{/* Location */}
													<p>
														<span className='font-medium'>Location:</span>{" "}
														{product.location || "Unknown"}
													</p>

													{/* Status and Condition as Tags */}
													<div className='flex space-x-2'>
														<span className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded'>
															{product.status || "N/A"}
														</span>
														<span className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded'>
															{product.condition || "N/A"}
														</span>
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
