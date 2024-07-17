"use client";
import { useEffect, useState } from "react";
import Card from "@components/Card";
import { collection, getDocs, GeoPoint } from "firebase/firestore";
import { db } from "@app/firebase/config";

const calculateDistance = (point1, point2) => {
	const R = 6371;
	const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
	const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((point1.latitude * Math.PI) / 180) *
			Math.cos((point2.latitude * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round(R * c * 100) / 100; // Round to 2 decimal places
};

const Categorias = () => {
	const [products, setProducts] = useState([]);
	const [userLocation, setUserLocation] = useState(
		new GeoPoint(18.4861, -69.9312)
	);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				console.log("Attempting to fetch products...");
				const querySnapshot = await getDocs(collection(db, "Products"));
				console.log("Query snapshot received:", querySnapshot);
				const fetchedProducts = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log("Fetched products:", fetchedProducts);

				fetchedProducts.forEach((product) => {
					console.log(
						`Print all the information from product ${product.id}:`,
						product.Name,
						product.Price,
						product.Image,
						product.Description,
						product.Category,
						product.Location.latitude,
						product.Location.longitude
					);
				});

				let userLocation = new GeoPoint(18.4861, -69.9312);

				const sortProducts = (location) => {
					return fetchedProducts
						.map((product) => ({
							...product,
							distance: calculateDistance(product.Location, location),
						}))
						.sort((a, b) => a.distance - b.distance);
				};

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							const { latitude, longitude } = position.coords;
							const newUserLocation = new GeoPoint(latitude, longitude);
							setUserLocation(newUserLocation);
							setProducts(sortProducts(newUserLocation));
						},
						(error) => {
							console.error("Geolocation error:", error);
							setProducts(sortProducts(userLocation));
						}
					);
				} else {
					setProducts(sortProducts(userLocation));
				}
			} catch (error) {
				console.error("Error fetching products:", error);
				if (error.code) {
					console.error("Error code:", error.code);
				}
				if (error.message) {
					console.error("Error message:", error.message);
				}
			}
		};

		fetchProducts();
	}, []);

	return (
		<div className="w-full flex-col px-12">
			<h1 className="head_text text-left">Categorias</h1>
			<div className="flex flex-wrap gap-4 items-center">
				{products.map((product) => (
					<Card
						key={product.id}
						product={product}
						distance={product.distance}
					/>
				))}
			</div>
		</div>
	);
};

export default Categorias;
