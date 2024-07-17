'use client';

import Link from 'next/link';
import Image from 'next/image';

const Card = ({ product, distance }) => {
  const handleClick = (e) => {
    e.preventDefault();
    // Use window.history to store the product data
    window.history.pushState({ productData: product }, '', `/detalles?id=${product.id}`);
    window.location.href = `/detalles?id=${product.id}`;
  };

  return (
    <Link href={`/detalles?id=${product.id}`} onClick={handleClick}>
      <div className="cursor-pointer bg-white rounded-lg w-80 h-48 flex flex-row mt-2 p-4">
        <Image
          src={product.Image}
          width={120}
          height={30}
          className="object-contain border-2"
          alt={product.Name}
        />
        <div className="w-1/2 flex-col ml-4">
          <h1 className="font-inter font-semibold text-gray-700 text-base">
            {product.Name}
          </h1>
          <span className="font-inter font-semibold text-2xl">
            RD${product.Price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
          <p className="text-left max-w-md">Distancia: {distance} km</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;