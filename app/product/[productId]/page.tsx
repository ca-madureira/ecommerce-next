import React from 'react';
import Container from '@/app/components/Container';
import { products } from '../../../utils/products';
import ProductDetails from './ProductDetails';
// import { product } from '../../../utils/product';
import ListRating from './ListRating';

interface IPrams {
  productId?: string;
}

const Product = ({ params }: { params: IPrams }) => {
  const product = products.find((item) => item.id === params.productId);
  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div>Adicionar Avaliação</div>
        <ListRating product={product} />
      </Container>
    </div>
  );
};

export default Product;
