'use client';

import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@app/firebase/config'; // Adjust this import path as needed

const Detalles = () => {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async (id) => {
      try {
        const docRef = doc(db, 'Products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
          // Handle case when product is not found
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // Handle error (e.g., show error message)
      } finally {
        setLoading(false);
      }
    };

    const productId = searchParams.get('id');
    const productData = window.history.state?.productData;

    if (productData) {
      setProduct(productData);
      setLoading(false);
    } else if (productId) {
      fetchProduct(productId);
    } else {
      setLoading(false);
      // Handle case when no id is provided
    }
  }, [searchParams]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className='flex flex-col mt-24 glassmorphism w-full'>
      <div className='flex flex-wrap'>
        <Image 
          src={product.Image || "/assets/images/placeholder.png"} 
          width={500} 
          height={3000} 
          className="object-contain border-2" 
          alt={product.Name}
        />
        <div className="flex flex-col ml-8 lg:w-1/2">
          <h1 className='font-inter font-semibold head_text text-gray-700'>{product.Name}</h1>
          <span className='font-inter font-semibold text-base text-gray-700'>Categoría: {product.Category}</span>
          <span className='font-inter font-semibold text-2xl mt-8'>${product.Price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          <p className='desc text-left max-w-md'>{product.Description}</p>
        </div>
      </div>

      <div className='flex flex-wrap mt-8'>
        <div className="flex flex-col gap-5">
          <Image 
            src="/assets/images/placeholder.png" 
            width={200} 
            height={100} 
            className="object-contain border-2" 
            alt="Placeholder"
          />
          <ul>
            <li>Telefono: {product.Phone || 'N/A'}</li>
            <li>Correo electrónico: {product.Email || 'N/A'}</li>
            <li>Informacion delivery: {product.DeliveryInfo || 'N/A'}</li>
          </ul>
        </div>
        <Image 
          src="/assets/images/placeholder.png" 
          width={700} 
          height={50} 
          className="object-contain border-2 lg:ml-36" 
          alt="Placeholder"
        />
      </div>
    </div>
  )
}

export default Detalles;