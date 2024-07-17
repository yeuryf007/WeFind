"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import Login from '@components/Login';

const Nav = () => {

  const usuariologeado = true;
  const {providers, getProviders} = useState(null);
  const [dropdown, setdropdown] = useState(false);
  const [visiblesearch, setvisiblesearch] = useState(false);

  useEffect(() => {
    const setProviders = async () => {
      /*const response = await getProviders();

      setProviders(response);*/
    }

    setProviders();
  }, [])

  return (
    <nav className='flex justify-between w-full pt-3 pb-3' id='navbars'>
      <Link href="/" className='flex gap-2 flex-center'>
        <Image src="/assets/images/logo.svg" alt="WeFind Logo" width={246} height={70} className='object-contain'/>
      </Link>
      
      {/* Navegacion Desktop */}

      <div className='sm:flex hidden w-7/12 justify-between items-center pl-6'>
                
        <div className='flex gap-5 align-center'>

          <Link href="/categorias" className='navtext'>
            Categorias
          </Link>
          
          <Link href="/crear_post" className='navtext'>
            Acciones
          </Link>

          
        </div>
        

        {usuariologeado ? (
          <div className='flex gap-3 md:gap-5'>

            {visiblesearch && (
              <input 
                type="text" 
                className="ml-2 p-2 rounded-full transition-all duration-300 ease-in-out"
                placeholder="Buscar"
                style={{
                  width: visiblesearch ? '200px' : '0',
                  opacity: visiblesearch ? 1 : 0,
                }}
              />
            )}
            <Image src="/assets/images/search-w.svg" width={37} height={37} alt='search' onClick={() => setvisiblesearch(!visiblesearch)}
            className="cursor-pointer"/>
            
            

            <Link href="/profile">
              <Image src="/assets/images/profile.png" width={45} height={45}  alt='profile'/>
            </Link>
          </div>
        ): (
          <>
          <div className='flex gap-3 md:gap-5'>
            
            {visiblesearch && (
              <input 
                type="text" 
                className="ml-2 p-2 rounded-full transition-all duration-300 ease-in-out"
                placeholder="Buscar..."
                style={{
                  width: visiblesearch ? '200px' : '0',
                  opacity: visiblesearch ? 1 : 0,
                }}
              />
            )}
            <Image src="/assets/images/search-w.svg" width={37} height={37} alt='search' onClick={() => setvisiblesearch(!visiblesearch)}
              className="cursor-pointer"/>
              
            
            <div className='flex relative'>
            <Image src="/assets/images/profile.png" width={45} height={45} className="rounded-full" alt='profile'
                onClick={() => setdropdown ((prev) => !prev)}/>
              {dropdown && (
                <div className='dropdown'>
                  <Login/>
                </div>
              )}
              </div>
          </div>
              
              {providers &&
                Object.values(providers).map((provider) => (
                  <button type='button' key={provider.name} onClick={() => signIn(provider.id)} className='black_btn'>
                    Ingresar
                  </button>
                ))
              }

          </>
          
        )
      }
      </div>

      {/* Navegacion Movil */}

        <div className='sm:hidden flex relative'>
          {usuariologeado ? (
            <div className='flex'>
              <Image src="/assets/images/profile.png" width={65} height={37} className="rounded-full" alt='profile'
              onClick={() => setdropdown ((prev) => !prev)}/>

              {dropdown && (
                <div className='dropdown'>
                  <Link href="/categorias"
                  className='dropdown_link'
                  onClick={() => setdropdown(false)}>
                    Categorias
                  </Link>

                  <Link href="/crear_post"
                  className='dropdown_link'
                  onClick={() => setdropdown(false)}>

                    Acciones
                  </Link>

                  <button type='button' className="mt-5 w-full black_btn" onClick={() => {
                  setdropdown(false);
                    signOut;
                  }}>
                      Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ): (
            <>
              {/*{providers &&
                Object.values(providers).map((provider) => (
                  <button type='button' key={provider.name} onClick={() => signIn(provider.id)} className='black_btn'>
                    Sign In
                  </button>
                  
                ))
              }*/}
              <Image src="/assets/images/profile.png" width={65} height={37} className="rounded-full" alt='profile'
              onClick={() => setdropdown ((prev) => !prev)}/>
                {dropdown && (
                  <div className='dropdown'>
                    <Login/>
                  </div>
                )}
            </>
          )}
        </div>
    </nav>
  )
}

export default Nav