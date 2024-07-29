'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, GeoPoint } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@app/firebase/config';
import Image from 'next/image';
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Loader from './Loader';

const categories = ["Ropa", "Tecnología", "Comestibles", "Hogar", "Deportes", "Salud", "Otros"];
const deliveryOptions = ["Sin delivery", "Llamada", "Aplicación", "Llamada y Aplicación"];

const forbiddenWords = [
  "mierda", "puto", "puta", "cabrón", "gilipollas", "imbécil", "idiota", "joder", "culo", "hostia", "coño", "hijoputa", "maricón", "zorra", "pendejo", "chinga", "mmg", "verga", "ñema",
  "cocaína", "heroína", "metanfetamina", "crack", "éxtasis", "lsd", "marihuana", "cannabis", "arma", "rifle", "explosivo", "dildo",
  "gay", "marica", "sudaca", "inmigrante", "retrasado",
  "matar", "violar", "asesinar", "torturar", "golpear", "abusar"
];

const UserProducts = ({ uid }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 18.4649639, lng: -69.9479573 });
  const [imageUpload, setImageUpload] = useState(null);
  const [errors, setErrors] = useState({});
  const [tempMessage, setTempMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filtro de barra de busqueda
  useEffect(() => {
    const filtered = products.filter(product => 
      product.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Comprueba si el usuario está autenticado y si es el dueño de los productos
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.uid === uid) {
        setUser(currentUser);
        fetchProducts(currentUser.uid);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [uid, router]);

  // Redirige a la página de detalles del producto
  const handleProductClick = (product) => {
    router.push(`/detalles?id=${product.id}`);
  };

  // Obtiene los productos del usuario
  const fetchProducts = async (userId) => {
    const q = query(collection(db, 'Products'), where('Added_by', '==', userId));
    const querySnapshot = await getDocs(q);
    const productsData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        Location: data.Location ? { lat: data.Location.latitude, lng: data.Location.longitude } : null
      };
    });
    setProducts(productsData);
    setLoading(false);
  };

  const handleEdit = useCallback((product) => {
    setEditProduct(product);
    if (product.Location) {
      setMapCenter(product.Location);
    }
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageUpload(e.target.files[0]);
    }
  };

  const handleDelete = useCallback((product) => {
    setDeleteProduct(product);
  }, []);

  const uploadImage = async () => {
    if (imageUpload) {
      const storage = getStorage();
      const imageRef = ref(storage, `product_images/${imageUpload.name + Date.now()}`);
      await uploadBytes(imageRef, imageUpload);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    }
    return null;
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'Products', deleteProduct.id));
      setDeleteProduct(null);
      fetchProducts(user.uid);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Validar formulario
  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.Location) {
      newErrors.location = "Por favor, seleccione una ubicación en el mapa.";
    }

    if (!formData.Category || formData.Category === "Seleccione una categoria") {
      newErrors.category = "Por favor, seleccione una categoría.";
    }

    if (!formData.Store_name.trim()) {
      newErrors.storeName = "El nombre de la tienda es obligatorio.";
    }

    if (!formData.Name.trim()) {
      newErrors.productName = "El nombre del producto es obligatorio.";
    }

    if (!formData.Price) {
      newErrors.price = "El precio es obligatorio.";
    }

    if (!validateContent(formData.Store_name)) {
      newErrors.storeName = "El nombre de la tienda contiene lenguaje inapropiado.";
    }
    if (!validateContent(formData.Name)) {
      newErrors.productName = "El nombre del producto contiene lenguaje inapropiado.";
    }
    if (!validateContent(formData.Description)) {
      newErrors.description = "La descripción contiene lenguaje inapropiado.";
    }
    if (formData.Phone && !/^\d{10}$/.test(formData.Phone)) {
      newErrors.phone = "El número de teléfono debe tener exactamente 10 dígitos.";
    }

    return newErrors;
  };

  // Validar contenido del formulario
  const validateContent = (text) => {
    if (!text) return true;
    const normalizedText = text.toLowerCase().trim();
    return !forbiddenWords.some((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return regex.test(normalizedText);
    });
  };

  // Actualizar producto
  const updateProduct = async (updatedProduct) => {
    const newErrors = validateForm(updatedProduct);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTempMessage("Por favor, corrija los errores antes de guardar los cambios.");
      setTimeout(() => setTempMessage(""), 5000);
      return;
    }

    try {
      const productRef = doc(db, 'Products', updatedProduct.id);
      let imageUrl = updatedProduct.Image;
      if (imageUpload) {
        imageUrl = await uploadImage();
      }
      const updateData = {
        ...updatedProduct,
        Modification_date: new Date(),
        Location: new GeoPoint(updatedProduct.Location.lat, updatedProduct.Location.lng),
        Image: imageUrl,
        Phone: updatedProduct.Phone || null
      };
      await updateDoc(productRef, updateData);
      setEditProduct(null);
      setImageUpload(null);
      setErrors({});
      fetchProducts(user.uid);
    } catch (error) {
      console.error('Error updating product:', error);
      setTempMessage("Ha ocurrido un error al actualizar el producto.");
      setTimeout(() => setTempMessage(""), 5000);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Mis Productos</h1>
      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Buscar productos por nombre, descripción o categoría..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-white">No se encontraron productos que coincidan con la búsqueda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
            <div className="relative h-48">
              <Image 
                src={product.Image || "/assets/images/placeholder.png"} 
                alt={product.Name} 
                layout="fill" 
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.Name}</h2>
              <p className="text-gray-600 mb-2">Categoría: {product.Category}</p>
              <p className="text-gray-600 mb-2">Precio: ${product.Price.toFixed(2)}</p>
              <p className="text-gray-600 mb-2">Tienda: {product.Store_name}</p>
              {product.reportCount !== undefined && (
          <p className='mt-2 text-sm text-red-500 flex items-center'>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            Este producto ha sido reportado {product.reportCount} {product.reportCount === 1 ? 'vez' : 'veces'}.
          </p>
        )}
              <div className="flex justify-between mt-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(product);
                  }} 
                  className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                >
                  <FaEdit className="mr-2" /> Editar
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product);
                  }} 
                  className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                >
                  <FaTrash className="mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {editProduct && (
        <div className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full m-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Producto</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateProduct({
                ...editProduct,
                Name: e.target.name.value,
                Category: e.target.category.value,
                Price: parseFloat(e.target.price.value),
                Description: e.target.description.value,
                Store_name: e.target.store_name.value,
                Phone: e.target.phone.value,
                Delivery: e.target.delivery.value,
                Location: mapCenter
              });
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre</label>
            <input type="text" name="name" id="name" defaultValue={editProduct.Name} 
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.productName ? 'border-red-500' : ''}`}  />
            {errors.productName && <p className="text-red-500 text-xs italic">{errors.productName}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Categoría</label>
            <select name="category" id="category" defaultValue={editProduct.Category} 
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : ''}`} >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs italic">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Precio</label>
            <input type="number" name="price" id="price" defaultValue={editProduct.Price} 
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : ''}`}  step="0.01" />
            {errors.price && <p className="text-red-500 text-xs italic">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store_name">Nombre de la Tienda</label>
            <input type="text" name="store_name" id="store_name" defaultValue={editProduct.Store_name} 
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.storeName ? 'border-red-500' : ''}`}  />
            {errors.storeName && <p className="text-red-500 text-xs italic">{errors.storeName}</p>}
          </div>
          <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Teléfono (opcional)</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone" 
                defaultValue={editProduct.Phone || ''} 
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
              <span className="text-gray-500 text-xs">
									{" "}
									Solo 10 digitos, no se admiten simbilos ni espacios.
								</span>
            </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="delivery">Delivery</label>
            <select name="delivery" id="delivery" defaultValue={editProduct.Delivery} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" >
              {deliveryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Imagen del Producto</label>
          <input 
            type="file" 
            name="image" 
            id="image" 
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(imageUpload || editProduct.Image) && (
            <img 
              src={imageUpload ? URL.createObjectURL(imageUpload) : editProduct.Image} 
              alt="Product preview" 
              className="mt-2 max-w-full h-auto max-h-48 object-contain"
            />
          )}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descripción (opcional)</label>
          <textarea name="description" id="description" defaultValue={editProduct.Description} 
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : ''}`} rows="3" ></textarea>
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Ubicación</label>
          <div className="h-64 w-full">
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={mapCenter}
              zoom={15}
              onClick={(e) => setMapCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          </div>
          {errors.location && <p className="text-red-500 text-xs italic mt-2">{errors.location}</p>}
        </div>
        {tempMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{tempMessage}</span>
        </div>
      )}
        <div className="flex justify-end mt-6">
          <button type="button" onClick={() => {
            setEditProduct(null);
            setErrors({});
          }} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300">Cancelar</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Guardar Cambios</button>
        </div>
      </form>
    </div>
  </div>
)}

      {deleteProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirmar Eliminación</h2>
            <p className="mb-6 text-gray-600">¿Estás seguro de que quieres eliminar "{deleteProduct.Name}"?</p>
            <div className="flex justify-end">
              <button onClick={() => setDeleteProduct(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300">Cancelar</button>
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProducts;