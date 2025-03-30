import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Homepage.jsx";
import Admin from "./components/Admin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import { Toaster } from "react-hot-toast";

function App() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle("dark");
	};

	return (
		<Provider store={store}>
			<div className={isDarkMode ? "dark" : ""}>
				<div className='min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
					<Router>
						<Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/product/:id' element={<ProductDetails />} />{" "}
							{/* New route for product details */}
							<Route path='/admin' element={<Admin />} />
							<Route
								path='/admin/login'
								element={
									<AdminLogin
										toggleDarkMode={toggleDarkMode}
										isDarkMode={isDarkMode}
									/>
								}
							/>
						</Routes>
						<Toaster position='top-right' />
					</Router>
				</div>
			</div>
		</Provider>
	);
}

export default App;
