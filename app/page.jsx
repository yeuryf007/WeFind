import Feed from '@components/Feed';
import Link from 'next/link';

const Home = () => {
  return (
    <section className="w-full flex-center flex-col mt-10 p-3">
        <h1 className="head_text text-center">
            Encuentra tu próximo artículo favorito
            <br className="max-md:hidden"/>
        </h1>
        

        <Feed/>
        <div className="categories">
          <Boton titulo="Comidas" imagen='/assets/images/comidas.svg'/>
          <Boton titulo="Hogar" imagen='/assets/images/hogar.svg'/>
          <Boton titulo="Deporte" imagen='/assets/images/deporte.svg'/>
          <Boton titulo="Salud" imagen='/assets/images/salud.svg'/>
        </div>
    </section>
  )
}

function Boton ({imagen, titulo}){
  return(
    <Link href={`/${titulo}`}>
      <div  className='boton'>
        <img src={imagen}/>
      </div>
      <h4 className='desc'>{titulo}</h4>
    </Link>
  );
}

export default Home