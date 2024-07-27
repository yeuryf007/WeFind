"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@app/firebase/config";

const Nav = () => {
  const [user, loading] = useAuthState(auth);
  const [dropdown, setDropdown] = useState(false);
  const pathname = usePathname();

  const signInWithGoogle = (e) => {
    e.stopPropagation(); // Previene que el evento se propague al contenedor padre
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () => {
    firebaseSignOut(auth);
    setDropdown(false);
  };

  const toggleDropdown = () => {
    if (user) {
      setDropdown((prev) => !prev);
    }
  };

  return (
    <nav className="flex justify-between w-full pt-3 pb-3" id="navbars">
      

      {/* Navegación Desktop */}
      <div className="sm:flex hidden w-full justify-between items-center">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="WeFind Logo"
          width={246}
          height={70}
          className="object-contain"
        />
      </Link>
        <div className="flex gap-8 align-center">
          <Link href="/" className="navtext">
            Inicio
          </Link>
          
          <Link href="/categorias" className="navtext">
            Productos
          </Link>

          {user && (
            <Link href="/crear_post" className="navtext">
              Publicar Productos
            </Link>
          )}
        </div>

        {loading ? (
          <div className="w-40 h-10 bg-gray-200 rounded animate-pulse"></div>
        ) : user ? (
          <div className="flex gap-3 md:gap-5">
            <div className="flex relative">
              <Image
                src={user.photoURL || "/assets/images/profile.png"}
                width={45}
                height={45}
                className="rounded-full cursor-pointer"
                alt="profile"
                onClick={toggleDropdown}
                onError={(e) => {
                  e.target.src = "/assets/images/profile.png";
                }}
              />
              {dropdown && (
                <div className="dropdown">
                  <button
                    type="button"
                    onClick={signOut}
                    className="w-full dropdown_link hover:bg-slate-800 hover:text-white">
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-3 md:gap-5">
            <button onClick={signInWithGoogle} className="white_btn">
              Iniciar sesión con Google
            </button>
          </div>
        )}
      </div>

      {/* Navegación Móvil */}
      <div className="sm:hidden flex relative w-full justify-between items-center">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="WeFind Logo"
          width={246}
          height={70}
          className="object-contain"
        />
      </Link>
        <Image
          src="/assets/images/dropdown.svg"
          width={65}
          height={37}
          alt="dropdown"
          onClick={() => setDropdown((prev) => !prev)}
          className="cursor-pointer"
        />

        {dropdown && (
          <div className="dropdown">
            <Link
              href="/categorias"
              className="dropdown_link"
              onClick={() => setDropdown(false)}>
              Productos
            </Link>

            {user && (
              <Link
                href="/crear_post"
                className="dropdown_link"
                onClick={() => setDropdown(false)}>
                Publicar Productos
              </Link>
            )}

            {user ? (
              <button
                onClick={signOut}
                className="w-full dropdown_link border-t-2 hover:bg-slate-800 hover:text-white">
                Cerrar Sesión
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="w-full dropdown_link border-t-2 hover:bg-slate-800 hover:text-white">
                Iniciar sesión con Google
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;