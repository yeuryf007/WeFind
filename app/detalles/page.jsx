import ProductDetails from '@components/ProductDetails';

export default function Detalles({ searchParams }) {
  return (
    <ProductDetails productId={searchParams.id} />
  );
}