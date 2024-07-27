'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@app/firebase/config'; // Adjust this import path as needed
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

const DEFAULT_LOCATION = { lat: 18.4649639, lng: -69.9479573 };

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
      } else {
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'Products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Keep the default location if there's an error
        }
      );
    }
  }, [productId]);

  useEffect(() => {
    if (mapLoaded && product && userLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: new window.google.maps.LatLng(product.Location.latitude, product.Location.longitude),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [mapLoaded, product, userLocation]);

  const handleMapClick = () => {
    if (product && product.Location) {
      const destination = `${product.Location.latitude},${product.Location.longitude}`;
      let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
      
      const origin = `${userLocation.lat},${userLocation.lng}`;
      url += `&origin=${origin}`;

      window.open(url, '_blank');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className='bg-white w-full'>
      <div className='flex p-4 justify-center max-lg:flex-wrap lg:flex-row'>
        <Image 
          src={product.Image || "/assets/images/placeholder.png"} 
          width={500} 
          height={3000} 
          className="object-contain border-2 rounded-lg" 
          alt={product.Name}
        />
        <div className="flex flex-col lg:w-1/2 lg:ml-8">
          <h1 className='font-inter font-bold text-2xl mt-8 text-gray-700'>{product.Name}</h1>
          <span className='font-inter font-semibold text-base'>Categoría: {product.Category}</span>
          <span className='font-inter font-semibold text-2xl mt-8'>${product.Price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          <p className='text-left max-w-md'>{product.Description}</p>
        </div>
      </div>
      <div className="border-2 mx-16 my-6"></div>
      <div className='flex p-6 justify-center max-lg:flex-wrap lg:flex-row'>
        <div className="flex flex-col gap-5">
          <h2 className='font-inter font-semibold text-2xl'>Información de la tienda</h2>
          <ul>
            <li>Nombre: {product.Store_name || 'N/A'}</li>
            <li>Teléfono: {product.Phone || 'N/A'}</li>
            <li>Delivery: {product.Delivery || 'N/A'}</li>
          </ul>
          <p className='text-left max-w-md text-red-500'>* Si no permite que el navegador utilice su ubicación, se usará una dirección inicial predeterminada.</p>
          <p className='text-left max-w-md text-red-500'>* Al hacer click en el mapa será redirigido a Google Maps.</p>
        </div>
        
        {mapLoaded ? (
          <div style={{ width: '650px', height: '400px', cursor: 'pointer' }} className="lg:ml-32" onClick={handleMapClick}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={product.Location ? { lat: product.Location.latitude, lng: product.Location.longitude } : { lat: 0, lng: 0 }}
              zoom={15}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>
        ) : (
          <div>Loading map...</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;