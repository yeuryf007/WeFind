import Link from 'next/link';
import Image from 'next/image';
import Mapjsx from './Map.js';
import { useRouter } from 'next/navigation';

const Form = ({ type, post, setpost, submitting, handleSubmit
      }) => {
        const router = useRouter();
        const handleCancel = (e) => {
          e.preventDefault(); // Prevent the default link behavior
          const confirmCancel = confirm('¿Estás seguro que deseas cancelar?');
          if (confirmCancel) {
            router.push('/'); // Navigate to home page if confirmed
          }
        };
  return(
    <section className="w-full max-w-full flex-col mt-16 px-6">

      <h1 className='head_text text-left'>
        <span className='head_text'>{type} productos</span>
        </h1>

        <form onSubmit={handleSubmit} className='mt-10 w-full flex flex-col gap-7 border-t-2'>
          <div className='flex flex-wrap border-b-2'>
            <div className='flex flex-col w-full lg:w-1/2 flex-grow' color='white'>
                <Mapjsx/>
            </div>
            <div className="flex flex-col w-full lg:w-1/2">
            <select placeholder="Seleccione la sucursal" required
              className='form_textarea_sm w-full'></select>
                <p className='desc text-left max-w-md'>
                  WeFind es una herramienta de busqueda de productos para que los clientes puedan descubrir productos cerca de ellos
                  y subir productos propios para que otros puedan encontrar.
              
                </p>
            </div>
          </div>
          <div className='flex flex-wrap mt-4 w-full'>
            <div className='file-select-img'>
              <Link href="/" className='flex flex-center mt-8 mb-4'>
                <Image src="/assets/images/add-image.svg" alt="Añadir imagen" width={70} height={30} className='object-contain'/>
              </Link>
                <input type='file' className='src-file'/>
                Subir imagen
            </div>

            <div className='pl-3 w-full lg:w-1/2'>

              <label>
                <span className='font-inter font-semibold text-base text-gray-700'> Descripciones del producto</span>

                <textarea
                value={post.prompt}
                onChange={(e)=> setpost({...post, prompt: e.target.value})}
                placeholder='Escriba el nombre del producto aquí'
                required
                className='form_textarea'/>
              </label>

              <div className='flex flex-row pt-2 w-full'>
                <label>

                <textarea
                //value={post.prompt}
                //onChange={(e)=> setpost({...post, prompt: e.target.value})}
                placeholder='Escriba el precio del producto'
                required
                className='form_textarea_sm'/>
                </label>

                <label>
                  <select placeholder="Categoría" required className='form_textarea_sm ml-4 '>
                    <option value="food">Comidas</option>
                    <option value="home">Hogar</option>
                    <option value="sport">Deportes</option>
                    <option value="health">Salud</option>
                  </select>
                </label>
              </div>
              

              
              </div>

          </div>
          <label>

            <textarea
            //value={post.prompt}
            //onChange={(e)=> setpost({...post, prompt: e.target.value})}
            placeholder='Descripción general del producto'
            required
            className='form_textarea_desc'/>
          </label>

          <div className='flex-end mx-3 mb-5 gap-4'>
            <Link href="/" className='text-sm hover:underline h-full' onClick={handleCancel}> Cancelar</Link>

            <button type='submit' disabled={submitting} className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'>
              {submitting ? `${type}...` : type }
            </button>

          </div>
        </form>
      </section>
  )
}

export default Form