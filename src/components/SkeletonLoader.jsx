const SkeletonLoader = () => {
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

			{/* Skeleton for Carousel Section */}
			<div className='relative w-full h-[600px] overflow-hidden'>
				<div className='relative w-full h-full'>
					{/* Placeholder for Carousel Image */}
					<div className='absolute top-20 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse' />

					{/* Placeholder for Navigation Arrows */}
					<div className='absolute top-1/2 left-6 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-3 rounded-full w-12 h-12 animate-pulse' />
					<div className='absolute top-1/2 right-6 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-3 rounded-full w-12 h-12 animate-pulse' />

					{/* Placeholder for Navigation Dots */}
					<div className='absolute bottom-6 left-0 right-0 flex justify-center space-x-3'>
						{[...Array(7)].map((_, index) => (
							<div
								key={index}
								className='w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse'
							/>
						))}
					</div>
				</div>
			</div>

			{/* Skeleton for Main Content */}
			<div className='pt-20'>
				<div className='py-12 px-12 sm:px-10 lg:px-20'>
					<div className='max-w-5xl mx-auto'>
						{/* Skeleton for Header */}
						<div className='h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse' />

						{/* Skeleton for Category Filter */}
						<div className='mb-10'>
							<div className='h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse' />
							<div className='h-12 w-full sm:w-72 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
						</div>

						{/* Skeleton for Product Grid */}
						<div className='border-2 border-blue-900 rounded-xl p-6'>
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
								{[...Array(4)].map((_, index) => (
									<div
										key={index}
										className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse'
									>
										{/* Placeholder for Product Image */}
										<div className='relative w-full h-56 mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg' />

										{/* Placeholder for Product Details */}
										<div className='space-y-2'>
											{/* Price */}
											<div className='h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded' />
											{/* Description */}
											<div className='h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded' />
											{/* Secondary Details */}
											<div className='space-y-1'>
												{/* Location */}
												<div className='h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded' />
												{/* Status and Condition Tags */}
												<div className='flex space-x-2'>
													<div className='h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded' />
													<div className='h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded' />
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SkeletonLoader;
