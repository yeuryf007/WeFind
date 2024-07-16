"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const Nav = () => {

  const usuariologeado = true;
  const {providers, getProviders} = useState(null);
  const [dropdown, setdropdown] = useState(false);

  useEffect(() => {
    const setProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    }

    setProviders();
  }, [])

  return (
    <nav className='flex justify-between w-full pt-3 pb-3' id='navbars'>
      <Link href="/" className='flex gap-2 flex-center'>
        <Image src="/assets/images/logo.svg" alt="WeFind Logo" width={246} height={37} className='object-contain'/>
      </Link>
      
      {/* Navegacion Desktop */}

      <div className='sm:flex hidden w-7/12 justify-between'>
                
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

            <Link href="/">
              <Image src="/assets/images/search-w.svg" width={37} height={37} alt='search'/>
            </Link>

            <Link href="/profile">
              <Image src="/assets/images/profile.png" width={37} height={37}  alt='profile'/>
            </Link>
          </div>
        ): (
          <>
          <Link href="/login">
            <button type='button' className='black_btn'>
              Ingresar
            </button>
          </Link>
              
              {/*{providers &&
                Object.values(providers).map((provider) => (
                  <button type='button' key={provider.name} onClick={() => signIn(provider.id)} className='black_btn'>
                    Ingresar
                  </button>
                ))
              }*/}
          </>
        )
      }
      </div>

      {/* Navegacion Movil */}

        <div className='sm:hidden flex relative'>
          {usuariologeado ? (
            <div className='flex'>
              <Image src="/assets/images/profile.png" width={37} height={37} className="rounded-full" alt='profile'
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
              {providers &&
                Object.values(providers).map((provider) => (
                  <button type='button' key={provider.name} onClick={() => signIn(provider.id)} className='black_btn'>
                    Sign In
                  </button>
                ))
              }
            </>
          )}
        </div>
    </nav>
  )
}

export default Nav