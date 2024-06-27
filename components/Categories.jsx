import Link from "next/link"

const Categories = () => {
  return (
    <div className='flex gap-3 md:gap-5 mt-16'>
            <Link href="/productos" className='black_btn'>
              Comidas
            </Link>


            <Link href="/productos" className="black_btn">
              Utensilios
            </Link>

            <Link href="/productos">
              
            </Link>
          </div>
  )
}

export default Categories