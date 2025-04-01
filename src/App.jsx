import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Homepage.jsx";
import Admin from "./components/Admin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";

function App() {
	// Initialize dark mode state from localStorage
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedMode = localStorage.getItem("darkMode");
		return savedMode ? JSON.parse(savedMode) : false;
	});

	// Apply the dark class to the <html> element and save to localStorage
	useEffect(() => {
		console.log("Applying dark mode, isDarkMode:", isDarkMode);
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("darkMode", JSON.stringify(true));
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("darkMode", JSON.stringify(false));
		}
	}, [isDarkMode]);

	// Toggle dark mode
	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => {
			console.log("Toggling dark mode, new mode:", !prevMode);
			return !prevMode;
		});
	};

	return (
		<Provider store={store}>
			{/* Removed className={isDarkMode ? "dark" : ""} from this div */}
			<div className='flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
				<Router>
					<div className='flex-grow'>
						<Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/product/:id' element={<ProductDetails />} />
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
					</div>
					<Footer />
				</Router>
			</div>
		</Provider>
	);
}

export default App;
