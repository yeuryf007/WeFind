import dynamic from 'next/dynamic';
import Link from 'next/link';

const DynamicFeed = dynamic(() => import('@components/Feed'), {
  ssr: false,
});

const Home = () => {
  return (
    <section className="w-full flex-center flex-col mt-10 p-3">
        <h1 className="head_text text-center">
            Encuentra tu próximo artículo favorito
            <br className="max-md:hidden"/>
        </h1>
        
        <DynamicFeed />
        <div className="categories">
          <Boton titulo="Comestibles" imagen='/assets/images/comestibles.svg'/>
          <Boton titulo="Hogar" imagen='/assets/images/hogar.svg'/>
          <Boton titulo="Deportes" imagen='/assets/images/deportes.svg'/>
          <Boton titulo="Salud" imagen='/assets/images/salud.svg'/>
        </div>
    </section>
  )
}

function Boton ({imagen, titulo}){
  return(
    <Link href={`/categorias?category=${encodeURIComponent(titulo)}`}>
      <div  className='boton'>
        <img src={imagen}/>
      </div>
      <h4 className='desc'>{titulo}</h4>
    </Link>
  );
}

export default Home;