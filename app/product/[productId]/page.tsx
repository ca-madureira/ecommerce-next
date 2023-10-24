import React from "react";
import Container from "@/app/components/Container";
import { products } from "../../../utils/products";
import ProductDetails from "./ProductDetails";
// import { product } from '../../../utils/product';
import ListRating from "./ListRating";
import getProductById from "@/actions/getProductById";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import AddRating from "./AddRating";

interface IPrams {
  productId?: string;
}

const Product = async ({ params }: { params: IPrams }) => {
  const product = await getProductById(params);
  const user = await getCurrentUser();

  if (!product) return <NullData title='Produto nao existe' />;
  return (
    <div className='p-8'>
      <Container>
        <ProductDetails product={product} />
        <div className='flex flex-col mt-20 gap-4'>
          <AddRating product={product} user={user} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
