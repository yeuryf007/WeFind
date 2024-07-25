"use client";
import { useEffect, useState, Suspense } from "react";
import Card from "@components/Card";
import SkeletonCard from "@components/SkeletonCard";
import { collection, getDocs, GeoPoint, query, where } from "firebase/firestore";
import { db } from "@app/firebase/config";
import { useSearchParams } from 'next/navigation';

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
			Name: doc.data().Name.toLowerCase() // Convert all names to lowercase
		  }));
		  console.log("Fetched products:", fetchedProducts);
  
		  // Filter products based on category or search
		  if (category) {
			fetchedProducts = fetchedProducts.filter(product => 
			  product.Category.toLowerCase() === category.toLowerCase()
			);
		  } else if (search) {
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

  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div className="w-full flex-col px-12">
      <h1 className="head_text text-left mb-6">
        {category ? `Categoría: ${category}` : (search ? `Resultados para: ${search}` : 'Todos los productos')}
      </h1>
      <div className="mb-4">
        <label htmlFor="sort-select" className="mr-2 font-bold">Ordenar por:</label>
        <select 
          id="sort-select"
          value={sortBy}
          onChange={handleSortChange}
          className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="distance">Distancia</option>
          <option value="price">Precio</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-8 items-center justify-center">
        {loading ? (
          // Mostrar SkeletonCards durante la carga
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