"use client";
import {useState, useEffect} from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Profile from '@components/profile';

const MiPerfil = () => {

    const handleEdit = () => {

    }
    const handleDelete = async () => {

    }
  return (
    <Profile
        name="My"
        desc="Bienvenido a tu página de perfil"
        data={[]}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
    />
  )
}

export default MiPerfil