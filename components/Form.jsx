import Link from 'next/link';
import Image from 'next/image';

const Form = ({ type, post, setpost, submitting, handleSubmit
      }) => {
  return(
    <section className="w-full max-w-full flex-center flex-col mt-24">

      <h1 className='head_text text-left'>
        <span className='head_text'>{type} productos</span>
        </h1>

        <p className='desc text-left max-w-md'>
            WeFind es una herramienta de busqueda de productos para que los clientes puedan descubrir productos cerca de ellos
            y subir productos propios para que otros puedan encontrar.
        
        </p>

        <form onSubmit={handleSubmit} className='mt-10 w-full flex flex-col gap-7 glassmorphism'>

          <div className='flex flex-row'>

          
            <div className='file-select-img'>
            <Link href="/" className='flex gap-2 flex-center mt-8 mb-4'>
              <Image src="/assets/images/add-image.svg" alt="Añadir imagen" width={70} height={30} className='object-contain'/>
            </Link>
              <input type='file' className='src-file'/>
              Subir imagen
            </div>

            <div className='w-full'>

              <label>
                <span className='font-inter font-semibold text-base text-gray-700'> Nombre del Producto</span>

                <textarea
                value={post.prompt}
                onChange={(e)=> setpost({...post, prompt: e.target.value})}
                placeholder='Escriba el nombre del producto aquí'
                required
                className='form_textarea'/>
              </label>

              <label>
                <span className='font-inter font-semibold text-base text-gray-700'>Precio del Producto</span>

                <textarea
                //value={post.prompt}
                //onChange={(e)=> setpost({...post, prompt: e.target.value})}
                placeholder='Escriba el precio'
                required
                className='form_textarea_sm'/>
              </label>

              
            </div>

          </div>
          <label>
            <span className='font-inter font-semibold text-base text-gray-700'> Descripción del Producto</span>

            <textarea
            //value={post.prompt}
            //onChange={(e)=> setpost({...post, prompt: e.target.value})}
            placeholder='Describa el producto'
            required
            className='form_textarea_desc'/>
          </label>

          <div className='flex-end mx-3 mb-5 gap-4'>
            <Link href="/" className='text-sm dropdown_link'> Cancel</Link>

            <button type='submit' disabled={submitting} className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'>
              {submitting ? `${type}...` : type }
            </button>

          </div>
        </form>
      </section>
  )
}

export default Form