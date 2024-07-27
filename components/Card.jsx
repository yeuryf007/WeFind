'use client';

import Link from 'next/link';
import Image from 'next/image';

const Card = ({ product, distance }) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.history.pushState({ productData: product }, '', `/detalles?id=${product.id}`);
    window.location.href = `/detalles?id=${product.id}`;
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  const nameCharacterLimit = 30;

  return (
    <Link href={`/detalles?id=${product.id}`} onClick={handleClick}>
      <div className="cursor-pointer bg-white rounded-lg w-80 h-60 flex flex-col items-center hover:scale-110 transform transition duration-500">
        <div className='w-full h-full overflow-hidden rounded-lg border-2'>
          <Image
            src={product.Image}
            width={320}
            height={100}
            className='items-center object-cover w-full h-full'
            alt={product.Name}
          />
        </div>
        
        <div className="w-full flex-col ml-4 pl-4 pb-2">
          <h1 className="font-inter font-semibold text-gray-700 text-base">
            {truncateText(product.Name, nameCharacterLimit)}
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