import Categories from '@components/Categories'
import Feed from '@components/Feed'

const Home = () => {
  return (
    <section className="w-full flex-center flex-col mt-24">
        <h1 className="head_text text-center">
            Encuentra tu próximo artículo favorito
            <br className="max-md:hidden"/>
        </h1>
        

        <Feed/>
        <Categories/>
    </section>
  )
}

export default Home