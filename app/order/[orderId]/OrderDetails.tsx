"use client";

import { Order } from "@prisma/client";
import { useRouter } from "next/router";
import Heading from "@/app/components/Heading";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from "react-icons/md";
import moment from "moment";
import { formatPrice } from "@/utils/formatPrice";
import Status from "../../components/Status";
import OrderItem from "./OrderItem";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  // const router = useRouter()

  return (
    <div className='max-w-[1150px] m-auto flex flex-col gap-2'>
      <div className='mt-8'>
        <Heading title='Detalhes do pedido' />
      </div>
      <div>Pedido ID:{order.id}</div>
      <div>
        Total: <span className='font-bold'>{formatPrice(order.amount)}</span>
      </div>
      <div className='flex gap-2 items-center'>
        <div>Pagamento status:</div>
        <div>
          {order.status === "pendente" ? (
            <Status
              text='pending'
              icon={MdAccessTimeFilled}
              bg='bg-slate-200'
              color='text-slate-700'
            />
          ) : order.status === "complete" ? (
            <Status
              text='completed'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <div>Delivery status:</div>
        <div>
          {order.deliveryStatus === "pending" ? (
            <Status
              text='pending'
              icon={MdAccessTimeFilled}
              bg='bg-slate-200'
              color='text-slate-700'
            />
          ) : order.deliveryStatus === "despatched" ? (
            <Status
              text='dispatched'
              icon={MdDeliveryDining}
              bg='bg-purple-200'
              color='text-purple-700'
            />
          ) : order.deliveryStatus === "delivered" ? (
            <Status
              text='delivered'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>Data: {moment(order.createDate).fromNow()}</div>
      <div>
        <h2 className='font-semibold mt-4 mb-2'>Producsts ordered</h2>
        <div className='grid grid-cols-5 text-xs gap-4 pb-2 items-center'>
          <div className='col-span-2 jusitfy-self-start'>PRODUTO</div>
          <div className='justify-self-center'>PRICE</div>
          <div className='justify-self-center'>QTY</div>
          <div className='justify-self-end'>TOTAL</div>
        </div>
        {order.products &&
          order.products.map((item) => {
            return <OrderItem key={item.id} item={item}></OrderItem>;
          })}
      </div>
    </div>
  );
};

export default OrderDetails;
