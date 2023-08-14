import React from 'react';
import Container from '@/app/components/Container';
import ProductDetails from './ProductDetails';
import { product } from '../../../utils/product';
import ListRating from './ListRating';

interface IPrams {
  productId?: string;
}

const Product = ({ params }: { params: IPrams }) => {
  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div>Add Rating</div>
        <ListRating product={product} />
      </Container>
    </div>
  );
};

export default Product;
