'use client';

import UserProducts from '@/components/UserProducts';
import { useParams } from 'next/navigation';

export default function UserProductsPage() {
  const params = useParams();
  const { uid } = params;

  return <UserProducts uid={uid} />;
}