"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "@app/firebase/config";

// Componente de esqueleto que se muestra mientras se carga el Feed real
const SkeletonFeed = () => (
  <section className="feed">
    <div className="relative w-full flex-center search_input animate-pulse">
      <div className="absolute left-2 w-[42px] h-[42px] bg-gray-300 rounded-full"></div>
      <div className="w-full h-[50px] bg-gray-200 rounded-full"></div>
    </div>
  </section>
);

// Carga dinámica del componente Feed con un componente de esqueleto como fallback
const DynamicFeed = dynamic(() => import('@components/Feed'), {
  ssr: false,
  loading: () => <SkeletonFeed />,
});

const Home = () => {
  const [user] = useAuthState(auth);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsPopupVisible(true);
    }
  }, [user]);

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <section className="w-full flex-center flex-col mt-10 p-6 relative">
      {isPopupVisible && !user && (
        <div className="absolute top-[-40px] right-4 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <button
            onClick={closePopup}
            className="absolute top-0 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
          <p className="text-sm text-gray-500">
            Al iniciar sesión podrás añadir productos tú mismo.
          </p>
        </div>
      )}

      <h1 className="head_text text-center text-white">
        Te ayudamos a encontrar los productos que necesitas
        <br className="max-md:hidden"/>
      </h1>
      <h2 className="text-center text-white mt-2">
        Encuentra y compara precios de diversos productos cerca de ti.
      </h2>
      
      <div className="mt-12 mb-3 w-full">
      <DynamicFeed />
      </div>
      
      <h1 className="head_text text-center text-white mb-8">
        Categorías destacadas
      </h1>
      <div className="categories">
        <Boton titulo="Comestibles" imagen='/assets/images/comestibles.svg'/>
        <Boton titulo="Hogar" imagen='/assets/images/hogar.svg'/>
        <Boton titulo="Deportes" imagen='/assets/images/deportes.svg'/>
        <Boton titulo="Salud" imagen='/assets/images/salud.svg'/>
      </div>
    </section>
  )
}

function Boton({ imagen, titulo }) {
  return (
    <Link href={`/categorias?category=${encodeURIComponent(titulo)}`}>
      <div className='boton'>
        <img src={imagen} alt={titulo}/>
      </div>
      <h4 className='desc'>{titulo}</h4>
    </Link>
  );
}

export default Home;