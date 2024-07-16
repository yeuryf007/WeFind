import Image from "next/image";
import Link from "next/link";

const Card = ({ product, distance }) => {
  return (
<<<<<<< HEAD
    <div className="bg-white rounded-lg w-80 h-48 flex flex-row mt-2 p-4">
      <Image src="/assets/images/placeholder.png" width={130} height={30} className="object-contain border-2"/>
      <div className="w-1/2 flex-col ml-4">
        <h1 className='font-inter font-semibold text-gray-700 text-base'> Nombre del Producto</h1>
        <span className='font-inter text-sm text-gray-700 '> Categoría: </span>
        <span className='font-inter font-semibold text-2xl'> $0.00 </span>
        <p className='text-left max-w-md'> 
            WeFind es una herramienta de busqueda de productos...
        </p>
=======
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg w-80 h-48 flex flex-row mt-2 p-4">
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
>>>>>>> 4b6be6ec617ea5288efa4903e2ae80228cecb055
      </div>
    </Link>
  );
};

export default Card;