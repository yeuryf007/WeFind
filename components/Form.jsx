import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Mapjsx from './Map.js';
import { useRouter } from 'next/navigation';

const Form = ({ type, submitting, handleSubmit }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: '',
    phoneNumber: '',
    delivery: 'Sin delivery',
    productName: '',
    price: '',
    category: 'Comestibles',
    description: '',
    location: null,
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMapClick = (lat, lng) => {
    setFormData(prevState => ({
      ...prevState,
      location: { lat, lng }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      image: file
    }));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    const confirmCancel = confirm('¿Estás seguro que deseas cancelar?');
    if (confirmCancel) {
      router.push('/');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.location) {
      alert('Por favor, seleccione una ubicación en el mapa.');
      return;
    }
    handleSubmit(formData);
  };
  return (
    <section className="w-full max-w-full flex-col px-6">
    <h1 className='head_text text-left'>
      <span className='head_text'>{type} productos</span>
    </h1>

    <form onSubmit={onSubmit} className='mt-10 w-full flex flex-col gap-7 border-t-2'>
      <div className='flex flex-wrap border-b-2'>
        <div className='flex flex-col w-full lg:w-1/2 flex-grow' color='white'>
          <Mapjsx onMapClick={handleMapClick}/>
        </div>
        <div className="flex flex-col w-full lg:w-1/2">
          <p className='desc text-left max-w-md'>
            1. Seleccionar en el mapa la ubicación de la tienda que vende el producto.
          </p>
          <p className='desc text-left max-w-md'>
            2. Llenar los campos con la información del local.
          </p>
          <label>
            <span className='font-inter font-semibold text-base text-gray-700'>Nombre de la tienda</span>
            <textarea
              name="storeName"
              value={formData.storeName}
              onChange={handleInputChange}
              placeholder='Escriba el nombre de la tienda'
              required
              className='form_textarea resize-none'
            />
          </label>
          <div className='flex flex-row pt-2 w-full mb-4'>
            <label className='w-1/2 mr-1'>
              <span className='font-inter font-semibold text-base text-gray-700'>Número teléfono</span>
              <textarea
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder='Numero teléfono'
                className='form_textarea_sm resize-none'
              />
            </label>
            <label className='w-1/2 ml-1'>
              <span className='font-inter font-semibold text-base text-gray-700'>Delivery</span>
              <select 
                name="delivery"
                value={formData.delivery}
                onChange={handleInputChange}
                required 
                className='form_textarea_sm'
              >
                <option value="Sin delivery">Sin delivery</option>
                <option value="Llamada">Llamada</option>
                <option value="Aplicación">Aplicación</option>
                <option value="Llamada y Aplicación">Llamada y Aplicación</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <p className='text-sm text-gray-600 sm:text-xl max-w-2xl text-left ml-4'>
        3. Llenar los campos con la información del producto.
      </p>
      <div className='flex flex-wrap w-full'>
        <div className='file-select-img mb-4 ml-4 mr-4'>
          <label className='flex flex-center mt-8 mb-4'>
            <Image src="/assets/images/add-image.svg" alt="Añadir imagen" width={70} height={30} className='object-contain'/>
            <input 
              type='file' 
              onChange={handleImageUpload}
              required
              className='src-file'
            />
            Subir imagen
          </label>
        </div>
        <div className='w-full lg:w-1/2'>
          <label>
            <span className='font-inter font-semibold text-base text-gray-700'>Nombre del producto</span>
            <textarea
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder='Escriba el nombre'
              required
              className='form_textarea resize-none'
            />
          </label>
          <div className='flex flex-row pt-2 w-full'>
            <label className='w-1/2 mr-1'>
              <span className='font-inter font-semibold text-base text-gray-700'>Precio</span>
              <textarea
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder='Escriba el precio'
                required
                className='form_textarea_sm resize-none'
              />
            </label>
            <label className='w-1/2 ml-1'>
              <span className='font-inter font-semibold text-base text-gray-700'>Categoría</span>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required 
                className='form_textarea_sm'
              >
                <option value="Comestibles">Comidas</option>
                <option value="Hogar">Hogar</option>
                <option value="Deportes">Deportes</option>
                <option value="Salud">Salud</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder='Descripción general del producto'
          required
          className='form_textarea_desc resize-none'
        />
      </label>
      <div className='flex-end mx-3 mb-5 gap-4'>
        <Link href="/" className='text-sm hover:underline h-full' onClick={handleCancel}>Cancelar</Link>
        <button type='submit' disabled={submitting} className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'>
          {submitting ? `${type}...` : type}
        </button>
      </div>
    </form>
  </section>
  )
}

export default Form