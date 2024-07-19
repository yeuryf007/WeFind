import { Suspense } from 'react';
import ProductDetails from '@components/ProductDetails';

export default function Detalles({ searchParams }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails productId={searchParams.id} />
    </Suspense>
  );
}