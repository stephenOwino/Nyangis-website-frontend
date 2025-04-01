import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
	// List of Kenyan counties (sample)
	const kenyanCounties = [
		"Nairobi",
		"Machakos",
		"Kitui",
		"Mombasa",
		"Kisumu",
		"Nakuru",
		"Kiambu",
		"Eldoret",
		"Nyeri",
		"Kakamega",
		"Bungoma",
		"Meru",
		"Tharaka-Nithi",
		"Embu",
		"Garissa",
		"Kajiado",
		"Laikipia",
		"Kericho",
		"Bomet",
		"Kakamega",
		"Vihiga",
		"Busia",
		"Siaya",
		"Homa Bay",
		"Migori",
		"Kisii",
		"Nyamira",
		"Narok",
		"Baringo",
		"Elgeyo-Marakwet",
		"West Pokot",
		"Samburu",
		"Trans Nzoia",
		"Uasin Gishu",
		"Nandi",
		"Turkana",
		"Marsabit",
		"Mandera",
		"Wajir",
		"Tana River",
		"Lamu",
		"Taita-Taveta",
		"Kilifi",
		"Kwale",
		"Makueni",
		"Nyandarua",
		"Kirinyaga",
		"Murang",
	];

	// WhatsApp number and pre-filled message
	const whatsappNumber = "254711850739"; // Format: country code + number (no spaces or +)
	const whatsappMessage = encodeURIComponent(
		"Hello, I would like to know more about your products and services."
	);
	const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

	return (
		<footer className='relative bg-blue-900 text-white py-12'>
			{/* Skyline Background */}
			<div className='absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-200 to-transparent'>
				{/* Placeholder for skyline silhouette */}
				<div
					className='w-full h-full bg-blue-700 opacity-80'
					style={{
						clipPath:
							"polygon(0 100%, 5% 60%, 10% 80%, 15% 50%, 20% 70%, 25% 40%, 30% 60%, 35% 30%, 40% 50%, 45% 20%, 50% 40%, 55% 10%, 60% 30%, 65% 0%, 70% 20%, 75% 0%, 80% 20%, 85% 0%, 90% 20%, 95% 0%, 100% 20%, 100% 100%)",
					}}
				></div>
			</div>

			{/* Main Footer Content */}
			<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24'>
				{/* Grid Layout for Columns */}
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8'>
					{/* Column 1: About Us */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>About us</h3>
						<ul className='space-y-2'>
							<li>
								<a href='#' className='hover:underline'>
									About Avante Garde
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									We are hiring!
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									Terms & Conditions
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									Privacy Policy
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									Billing Policy
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									Candidate Privacy Policy
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									Cookie Policy
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									Copyright Infringement Policy
								</a>
							</li>
						</ul>
					</div>

					{/* Column 2: Support */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Support</h3>
						<ul className='space-y-2'>
							<li>
								<a
									href='mailto:support@avantegarde.co'
									className='hover:underline'
								>
									support@avantegarde.co
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									Safety tips
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									Contact Us
								</a>
							</li>
							<li>
								<a href='#' className='hover:underline'>
									FAQ
								</a>
							</li>
						</ul>
					</div>

					{/* Column 3: Our Apps */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Our apps</h3>
						<div className='space-y-3'>
							<a
								href='#'
								className='block bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition-all duration-300'
							>
								Download on the App Store
							</a>
							<a
								href='#'
								className='block bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition-all duration-300'
							>
								Get on Google Play
							</a>
						</div>
					</div>

					{/* Column 4: Our Resources (Social Media Links) */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Our resources</h3>
						<ul className='space-y-2'>
							<li>
								<a
									href='https://facebook.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:underline flex items-center'
								>
									<FaFacebook className='mr-2' /> Avante Garde on FB
								</a>
							</li>
							<li>
								<a
									href='https://www.instagram.com/avant_kor_ot?igsh=MXZybWRpNHg0dXpuNA%3D%3D&utm_source=qr
'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:underline flex items-center'
								>
									<FaInstagram className='mr-2' /> Our Instagram
								</a>
							</li>
							<li>
								<a
									href='https://twitter.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:underline flex items-center'
								>
									<FaTwitter className='mr-2' /> Our Twitter
								</a>
							</li>
						</ul>
					</div>

					{/* Column 5: Hot Links */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Hot links</h3>
						<ul className='space-y-2'>
							<li>
								<a href='#' className='hover:underline'>
									Avante Garde Africa
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Contact Information */}
				<div className='mt-12 border-t border-blue-900 pt-6 text-center'>
					<h4 className='text-lg font-semibold mb-4'>Get in Touch</h4>
					<div className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-6'>
						{/* WhatsApp */}
						<a
							href={whatsappLink}
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center text-sm sm:text-base hover:underline'
						>
							<FaWhatsapp className='mr-2 text-lg sm:text-xl' />
							0711 850 739
						</a>
						{/* Email 1 */}
						<a
							href='mailto:berilanyango52@gmail.com'
							className='flex items-center text-sm sm:text-base hover:underline'
						>
							<span className='mr-2'>✉️</span>
							berilanyango52@gmail.com
						</a>
						{/* Email 2 */}
						<a
							href='mailto:Beril.owino@outlook.com'
							className='flex items-center text-sm sm:text-base hover:underline'
						>
							<span className='mr-2'>✉️</span>
							Beril.owino@outlook.com
						</a>
					</div>
				</div>

				{/* Delivery Information and Copyright */}
				<div className='border-t border-blue-900 pt-6'>
					{/* Delivery Information */}
					<div className='text-center mb-4'>
						<h4 className='text-lg font-semibold mb-2'>
							WE DELIVER ACROSS KENYA
						</h4>
						<div className='flex flex-wrap justify-center gap-3'>
							{kenyanCounties.map((county, index) => (
								<span key={index} className='text-sm hover:underline'>
									{county}
								</span>
							))}
						</div>
					</div>

					{/* Copyright Notice */}
					<p className='text-center text-sm'>© 2025 Avante Garde</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
