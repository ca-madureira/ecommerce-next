"use client";
import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import {
  MdAccessTimeFilled,
  MdCached,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { firebaseApp } from "@/libs/firebase";
import { useCallback } from "react";
import { formatPrice } from "@/utils/formatPrice";
import moment from "moment";
import Status from "../../components/Status";
import { Order, User } from "@prisma/client";
import ActionBtn from "../../components/ActionBtn";
import toast from "react-hot-toast";
import axios from "axios";

interface ManageOrdersClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({ orders }) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);

  let rows: any = [];

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        date: moment(order.createDate).fromNow(),
        deliverStatus: order.deliveryStatus,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "customer", headerName: "Cliente", width: 130 },
    {
      field: "amount",
      headerName: "Total(USD)",
      width: 130,
      renderCell: (params) => {
        return (
          <div className='font-bold text-slate-800'>{params.row.amount}</div>
        );
      },
    },
    { field: "paymentStatus", headerName: "Payment Status", width: 100 },
    {
      field: "paymentStatus",
      headerName: "Status de Pagamento",
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.row.paymentStatus === "pending" ? (
              <Status
                text='pending'
                icon={MdAccessTimeFilled}
                bg='bg-slate-200'
                color='text-teal-700'
              />
            ) : params.row.paymentStatus === "complete" ? (
              <Status
                text='completed'
                icon={MdDone}
                bg='bg-purple-200'
                color='text-purple-700'
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Status de entrega",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.deliveryStatus === "pending" ? (
              <Status
                text='pending'
                icon={MdAccessTimeFilled}
                bg='bg-slate-200'
                color='text-teal-700'
              />
            ) : params.row.deliveryStatus === "dispatched" ? (
              <Status
                text='dispatched'
                icon={MdDeliveryDining}
                bg='bg-purple-200'
                color='text-purple-700'
              />
            ) : params.row.deliveryStatus === "delivered" ? (
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
        );
      },
    },
    {
      field: "date",
      headerName: "Data",
      width: 130,
    },
    {
      field: "action",
      headerName: "Ações",
      width: 200,
      renderCell: (params) => {
        return (
          <div className='flex justify-between gap-4 w-full'>
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={() => {
                handleDispatch(params.row.div);
              }}
            />
            <ActionBtn
              icon={MdDone}
              onClick={() => {
                handleDeliver(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`order/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleToggleStock = useCallback((id: string, inStock: boolean) => {
    axios
      .put("/api/product", {
        id,
        inStock: !inStock,
      })
      .then((res) => {
        toast.success("status do produto mudou");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Oops! algo deu errado");
      });
  }, []);

  const handleDispatch = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "dispatched",
      })
      .then((res) => {
        toast.success("Order Dispatch");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Ops!Something went wrong");
      });
  }, []);

  const handleDeliver = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "deliverd",
      })
      .then((res) => {
        toast.success("Order Dispatch");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Ops! Something went wrong");
      });
  }, []);
  return (
    <div className='max-w-[1150px] m-auto text-xl'>
      <div className='mb-4 mt-8'>
        <Heading title='Gerenciar pedidos' center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageOrdersClient;
