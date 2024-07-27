'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from '@app/firebase/config';
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

const DEFAULT_LOCATION = { lat: 18.4649639, lng: -69.9479573 };

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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

  const handleReportClick = () => {
    if (user) {
      setShowReportModal(true);
    } else {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          setUser(result.user);
          setShowReportModal(true);
        }).catch((error) => {
          console.error("Error al iniciar sesión:", error);
          alert("Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.");
        });
    }
  };

  const handleReportProduct = async () => {
    if (!product || !user) return;

    try {
      const reportDocRef = doc(db, 'Reports', `${productId}_${user.uid}`);
      const reportDocSnap = await getDoc(reportDocRef);

      if (reportDocSnap.exists()) {
        alert('Ya has reportado este producto anteriormente.');
        return;
      }

      if (!reportReason) {
        alert('Por favor, selecciona una razón para el reporte.');
        return;
      }

      // Crear el documento de reporte
      await setDoc(reportDocRef, {
        productId,
        userId: user.uid,
        reason: reportReason,
        timestamp: new Date()
      });

      // Incrementar el contador de reportes en el producto
      const productDocRef = doc(db, 'Products', productId);
      await updateDoc(productDocRef, {
        reportCount: increment(1)
      });

      // Actualizar el estado local
      setProduct(prevProduct => ({
        ...prevProduct,
        reportCount: (prevProduct.reportCount || 0) + 1
      }));

      alert('Producto reportado con éxito.');
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.error('Error al reportar el producto:', error);
      alert('Hubo un error al reportar el producto. Por favor, inténtalo de nuevo.');
    }
  };

  const ReportModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Reportar Producto</h2>
        <p className="mb-4">Por favor, selecciona la razón del reporte:</p>
        <select 
          value={reportReason} 
          onChange={(e) => setReportReason(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Selecciona una razón</option>
          <option value="Producto no encontrado">Producto no encontrado</option>
          <option value="Información errónea">Información errónea</option>
          <option value="Contenido no permitido">Contenido no permitido</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => setShowReportModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button 
            onClick={handleReportProduct}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Enviar Reporte
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className='bg-white w-full'>
      <div className='flex p-6 justify-center max-lg:flex-wrap lg:flex-row'>
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
        <div className="flex flex-col gap-5 mb-5">
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
      <div className="mt-4 flex flex-col items-center mb-10">
      <button 
          onClick={handleReportClick}
          className="flex items-center space-x-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <div className="bg-red-500 p-1 rounded-full">
            <Image 
              src="/assets/icons/Report.svg"
              alt="Report icon"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </div>
          <span>Reportar Producto</span>
        </button>
        {product.reportCount !== undefined && (
          <p className='mt-2 text-sm text-gray-600 flex items-center'>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            Este producto ha sido reportado {product.reportCount} {product.reportCount === 1 ? 'vez' : 'veces'}.
          </p>
        )}
      </div>
      {showReportModal && <ReportModal />}
    </div>
  );
};

export default ProductDetails;