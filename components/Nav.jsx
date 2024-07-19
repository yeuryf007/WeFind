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
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
            Productos
          </Link>
          
          <Link href="/crear_post" className='navtext'>
            Añadido
          </Link>

          
        </div>
        

        {usuariologeado ? (
          <div className='flex gap-3 md:gap-5'>


            <Link href='/' className='items-center justify-center'>
              <Image src="/assets/images/search-w.svg" width={45} height={45} alt='search'/>
            </Link>
            

            <div className='flex relative'>
              <Image src="/assets/images/profile.png" width={45} height={45} className="rounded-full" alt='profile'
                onClick={() => setdropdown ((prev) => !prev)}/>
              {dropdown && (
                <div className='dropdown'>
                  <button type='button' onClick={signOut} className='w-full dropdown_link hover:bg-slate-800 hover:text-white'>
                     Cerrar sesión
                     </button>
                </div>
              )}
              </div>
          </div>
        ): (
          <>
          <div className='flex gap-3 md:gap-5'>
            
            <Image src="/assets/images/search-w.svg" width={37} height={37} alt='search' href="/"/>
              
            
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
            <div className='flex border-l-white border-l-2'>
              <Image src="/assets/images/dropdown.svg" width={65} height={37} className="rounded-full" alt='dropdown'
              onClick={() => setdropdown ((prev) => !prev)}/>

              {dropdown && (
                <div className='dropdown'>
                  <Link href="/categorias"
                  className='dropdown_link'
                  onClick={() => setdropdown(false)}>
                    Productos
                  </Link>

                  <Link href="/crear_post"
                  className='dropdown_link'
                  onClick={() => setdropdown(false)}>
                    Añadido
                  </Link>

                  <Link href="/" className="w-full dropdown_link border-t-2 hover:bg-slate-800 hover:text-white" onClick={() => {
                  setdropdown(false);
                    signOut;
                  }}>
                      Cerrar Sesión
                  </Link>
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
              
              <Image src="/assets/images/dropdown.svg" width={65} height={37} alt='dropdown'
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
                    
                    <button 
                      className='dropdown_link'
                      onClick={() => setIsLoginOpen((prev) => !prev)}
                    >
                      Login
                    </button>
                    {isLoginOpen && (
                      <div className="nested-dropdown-content">
                        <Login />
                      </div>
                      )}
                      </div>
                  
                )}
            </>
          )}
        </div>
    </nav>
  )
}

export default Nav