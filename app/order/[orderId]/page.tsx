import React from "react";
import Container from "@/app/components/Container";
import { products } from "../../../utils/products";
import OrderDetails from "./OrderDetails";

import getOrderById from "@/actions/getOrderById";
import NullData from "@/app/components/NullData";
interface IPrams {
  orderId?: string;
}

const Order = async ({ params }: { params: IPrams }) => {
  const order = await getOrderById(params);

  if (!order) return <NullData title='No order'></NullData>;
  return (
    <div className='p-8'>
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default Order;
