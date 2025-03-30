import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	setProducts,
	addProduct,
	updateProduct,
	deleteProduct,
} from "../slices/productSlice.js";

import {
	fetchProducts,
	createProduct,
	updateProduct as updateProductApi,
	deleteProduct as deleteProductApi,
} from "../services/apiService.js";

const AdminDashboard = ({ toggleDarkMode, isDarkMode }) => {
	const [newProduct, setNewProduct] = useState({
		imageUrl: "",
		description: "",
		status: "AVAILABLE",
		category: "HOME",
	});
	const [editingProduct, setEditingProduct] = useState(null);
	const products = useSelector((state) => state.products.products);
	const dispatch = useDispatch();

	useEffect(() => {
		const loadProducts = async () => {
			const data = await fetchProducts();
			dispatch(setProducts(data));
		};
		loadProducts();
	}, [dispatch]);

	const handleCreate = async () => {
		const createdProduct = await createProduct(newProduct);
		dispatch(addProduct(createdProduct));
		setNewProduct({
			imageUrl: "",
			description: "",
			status: "AVAILABLE",
			category: "HOME",
		});
	};

	const handleUpdate = async () => {
		if (editingProduct) {
			const updatedProduct = await updateProductApi(
				editingProduct.id,
				editingProduct
			);
			dispatch(updateProduct(updatedProduct));
			setEditingProduct(null);
		}
	};

	const handleDelete = async (id) => {
		await deleteProductApi(id);
		dispatch(deleteProduct(id));
	};

	return (
		<div className='container mx-auto p-4'>
			<h2 className='text-2xl mb-4 text-gray-800 dark:text-gray-200'>
				Admin Dashboard
			</h2>
			<div className='mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md'>
				<h3 className='text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200'>
					{editingProduct ? "Edit Product" : "Add New Product"}
				</h3>
				<input
					type='text'
					placeholder='Image URL'
					value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
					onChange={(e) =>
						editingProduct
							? setEditingProduct({
									...editingProduct,
									imageUrl: e.target.value,
							  })
							: setNewProduct({ ...newProduct, imageUrl: e.target.value })
					}
					className='border p-2 w-full mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600'
				/>
				<input
					type='text'
					placeholder='Description'
					value={
						editingProduct ? editingProduct.description : newProduct.description
					}
					onChange={(e) =>
						editingProduct
							? setEditingProduct({
									...editingProduct,
									description: e.target.value,
							  })
							: setNewProduct({ ...newProduct, description: e.target.value })
					}
					className='border p-2 w-full mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600'
				/>
				<select
					value={editingProduct ? editingProduct.status : newProduct.status}
					onChange={(e) =>
						editingProduct
							? setEditingProduct({ ...editingProduct, status: e.target.value })
							: setNewProduct({ ...newProduct, status: e.target.value })
					}
					className='border p-2 w-full mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600'
				>
					<option value='AVAILABLE'>Available</option>
					<option value='SOLD'>Sold</option>
				</select>
				<select
					value={editingProduct ? editingProduct.category : newProduct.category}
					onChange={(e) =>
						editingProduct
							? setEditingProduct({
									...editingProduct,
									category: e.target.value,
							  })
							: setNewProduct({ ...newProduct, category: e.target.value })
					}
					className='border p-2 w-full mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600'
				>
					<option value='HOME'>Home</option>
					<option value='OFFICE'>Office</option>
				</select>
				<button
					onClick={editingProduct ? handleUpdate : handleCreate}
					className='bg-teal-600 text-white p-2 w-full'
				>
					{editingProduct ? "Update Product" : "Add Product"}
				</button>
				{editingProduct && (
					<button
						onClick={() => setEditingProduct(null)}
						className='bg-gray-600 text-white p-2 w-full mt-2'
					>
						Cancel
					</button>
				)}
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onEdit={(p) => setEditingProduct(p)}
						onDelete={handleDelete}
					/>
				))}
			</div>
		</div>
	);
};

export default AdminDashboard;
