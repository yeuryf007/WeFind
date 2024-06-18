"use client";
import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';

import Form from '@components/Form';
import { traceGlobals } from 'next/dist/trace/shared';

const CrearPost = () => {
  const [submitting, setsubmitting] = useState(false);
  const [post, setpost] = useState({
    prompt: '',
    tag: ''
  })

  const crearpost = async (e) => {
    e.preventDefault();
    setsubmitting(true);
  }
  
  return (
    <Form 
    type="Añadir"
    post={post}
    setpost = {setpost}
    submitting = {submitting} 
    handleSubmit = {crearpost}

    />
  )
}

export default CrearPost