import Feed from '@components/Feed'

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
            Derscubre y Comparte
            <br className="max-md:hidden"/>
            <span className="orange_gradient text-center">Productos Cerca de Ti</span>
        </h1>
        <p className="desc text-center">
            WeFind es una herramienta de busqueda de productos para que los clientes puedan descubrir productos cerca de ellos
            y subir productos propios para que otros puedan encontrar.
        </p>

        <Feed/>
    </section>
  )
}

export default Home