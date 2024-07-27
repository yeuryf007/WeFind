"use client";

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@app/firebase/config';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (!loading && user) {
      setIsAuthorized(true);
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;