import Image from "next/image";
import Link from "next/link";

const Detalles = () => {
  return (
    <div className='flex flex-col mt-24 glassmorphism w-full'>
        <div className='flex flex-row'>
            <Image src="/assets/images/placeholder.png" width={500} height={3000} className="object-contain border-2"/>
            <div className="flex flex-col ml-8">
                <h1 className='font-inter font-semibold head_text text-gray-700'> Nombre del Producto</h1>
                <span className='font-inter font-semibold text-base text-gray-700'> Categoría: </span>
                <span className='font-inter font-semibold text-2xl mt-8'> $0.00 </span>
                <p className='desc text-left max-w-md'> 
                    WeFind es una herramienta de busqueda de productos para que los clientes puedan descubrir productos cerca de ellos
                    y subir productos propios para que otros puedan encontrar.
                </p>
            </div>
        </div>

        <div className='flex flex-row mt-8'>
            <div className="flex flex-col gap-5">
                <Image src="/assets/images/placeholder.png" width={200} height={100} className="object-contain border-2"/>
                <ul>
                    <li>Telefono</li>
                    <li>Correo electrónico</li>
                    <li>Informacion delivery</li>
                </ul>
            </div>
            <Image src="/assets/images/placeholder.png" width={700} height={50} className="object-contain border-2 ml-36"/>
        </div>
        
    </div>
  )
}

export default Detalles