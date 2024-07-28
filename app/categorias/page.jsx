"use client";
import { useEffect, useState, Suspense } from "react";
import Card from "@components/Card";
import SkeletonCard from "@components/SkeletonCard";
import { collection, getDocs, GeoPoint, query, where } from "firebase/firestore";
import { db } from "@app/firebase/config";
import { useSearchParams, useRouter } from 'next/navigation';
import Feed from "@components/Feed";

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

const CategoriaContent = () => {
	const [products, setProducts] = useState([]);
	const [userLocation, setUserLocation] = useState(new GeoPoint(18.4861, -69.9312));
	const [loading, setLoading] = useState(true);
	const [sortBy, setSortBy] = useState('distance');
	const searchParams = useSearchParams();
	const router = useRouter();
  
	const categories = [
	  "Todas las categorías",
	  "Ropa",
	  "Tecnología",
	  "Comestibles",
	  "Hogar",
	  "Deportes",
	  "Salud",
	  "Otros"
	];
  
	useEffect(() => {
	  setLoading(true);
  
	  const category = searchParams.get('category');
	  const search = searchParams.get('search');
  
	  const fetchProducts = async () => {
		try {
		  console.log("Attempting to fetch products...");
		  let productsQuery = collection(db, "Products");
  
		  const querySnapshot = await getDocs(productsQuery);
		  console.log("Query snapshot received:", querySnapshot);
		  let fetchedProducts = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			Name: doc.data().Name.toLowerCase()
		  }));
		  console.log("Fetched products:", fetchedProducts);
  
		  // Filter products based on category and search
		  if (category && category !== "Todas las categorías") {
			fetchedProducts = fetchedProducts.filter(product => 
			  product.Category.toLowerCase() === category.toLowerCase()
			);
		  }
		  if (search) {
			const lowercaseSearch = search.toLowerCase();
			fetchedProducts = fetchedProducts.filter(product => 
			  product.Name.includes(lowercaseSearch)
			);
		  }
  
		  let userLocation = new GeoPoint(18.4861, -69.9312);
  
		  const sortProducts = (location) => {
			return fetchedProducts
			  .map((product) => ({
				...product,
				distance: calculateDistance(product.Location, location),
			  }))
			  .sort((a, b) => {
				if (sortBy === 'distance') {
				  return a.distance - b.distance;
				} else if (sortBy === 'price') {
				  return a.Price - b.Price;
				}
			  });
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
		} finally {
		  setLoading(false);
		}
	  };
  
	  fetchProducts();
	}, [searchParams, sortBy]);
  
	const category = searchParams.get('category') || "Todas las categorías";
	const search = searchParams.get('search') || "";
  
	const handleSortChange = (event) => {
	  setSortBy(event.target.value);
	};
  
	const handleCategoryChange = (event) => {
	  const newCategory = event.target.value;
	  router.push(`?category=${newCategory}${search ? `&search=${search}` : ''}`);
	};
  
	const handleReset = () => {
	  router.push('/categorias');
	};
  
	return (
	  <div className="w-full flex-col pl-6 pr-6 pb-6">
		<h1 className="head_text text-left mb-6 justify-center flex">
		  Productos
		</h1>
		<div className="mb-4">
		  <div className="flex flex-wrap justify-left mb-4">
			<Feed />
		  </div>
		  <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="relative">
        <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-1">
          Ordenar por
        </label>
        <select 
          id="sort-select"
          value={sortBy}
          onChange={handleSortChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="distance">Distancia</option>
          <option value="price">Precio</option>
        </select>
      </div>
      <div className="relative">
        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría
        </label>
        <select 
          id="category-select"
          value={category}
          onChange={handleCategoryChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
    <button 
      onClick={handleReset}
      className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
    >
      <span className="flex items-center justify-center">
        <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reiniciar búsqueda
      </span>
    </button>
  </div>
</div>
		</div>
		<div className="flex flex-wrap gap-8 items-center justify-center">
		  {loading ? (
			Array(12).fill().map((_, index) => <SkeletonCard key={index} />)
		  ) : (
			products.map((product) => (
			  <Card
				key={product.id}
				product={product}
				distance={product.distance}
			  />
			))
		  )}
		</div>
	  </div>
	);
  };
  
  const Categorias = () => {
	return (
	  <Suspense fallback={<div>Loading...</div>}>
		<CategoriaContent />
	  </Suspense>
	);
  };
  
  export default Categorias;