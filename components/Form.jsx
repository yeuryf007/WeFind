import Link from 'next/link';

const Form = ({ type, post, setpost, submitting, handleSubmit
      }) => {
  return(
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className='head_text text-left'>
        <span className='orange_gradient'>{type} productos</span>
        </h1>
        <p className='desc text-left max-w-md'>
          Hey muy buenas a todos guapisimos, mi nombre es Vegetta777, en un gameplay directo de VS Code. En el episodio de hoy,
          haremos la pagina de {type} productos para la pagina web de WeFind.
        </p>

        <form onSubmit={handleSubmit} className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'>
          <label>
            <span className='font-satoshi font-semibold text-base text-gray-700'> Nombre del Producto</span>

            <textarea
            value={post.prompt}
            onChange={(e)=> setpost({...post, prompt: e.target.value})}
            placeholder='Escriba el nombre del producto aquí'
            required
            className='form_textarea'/>
          </label>

          <label>
            <span className='font-satoshi font-semibold text-base text-gray-700'>Precio del Producto</span>

            <textarea
            value={post.prompt}
            onChange={(e)=> setpost({...post, prompt: e.target.value})}
            placeholder='Escriba el precio'
            required
            className='form_textarea_sm'/>
          </label>

          <label>
            <span className='font-satoshi font-semibold text-base text-gray-700'> Descripción del Producto</span>

            <textarea
            value={post.prompt}
            onChange={(e)=> setpost({...post, prompt: e.target.value})}
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