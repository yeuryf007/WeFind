import Image from "next/image"

const Card = () => {
  return (
    <div className="bg-white rounded-lg w-80 h-48 flex flex-row mt-2 p-4">
      <Image src="/assets/images/placeholder.png" width={120} height={30} className="object-contain border-2"/>
      <div className="w-1/2 flex-col ml-4">
        <h1 className='font-inter font-semibold text-gray-700 text-base'> Nombre del Producto</h1>
        <span className='font-inter text-sm text-gray-700 '> Categoría: </span>
        <span className='font-inter font-semibold text-2xl'> $0.00 </span>
        <p className='text-left max-w-md'> 
            WeFind es una herramienta de busqueda de productos...
        </p>
      </div>

    </div>
  )
}

export default Card