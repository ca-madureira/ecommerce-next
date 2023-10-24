import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdRemoveRedEye,
  MdDone,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { firebaseApp } from "@/libs/firebase";
import { useCallback } from "react";
import Status from "../components/Status";
import { formatPrice } from "@/utils/formatPrice";
import moment from "moment";
import { User, Order } from "@prisma/client";
import ActionBtn from "../components/ActionBtn";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OrdersClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};

const OrdersClient: React.FC<OrdersClientProps> = ({ orders }) => {
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
    { field: "customer", headerName: "Customer Name", width: 130 },
    {
      field: "amount",
      headerName: "Amount(USD)",
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
      headerName: "Payment Status",
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
      headerName: "Delivery Status",
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
      headerName: "Date",
      width: 130,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className='flex justify-between gap-4 w-full'>
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={() => {
                handleDispatch(params.row.id); // Corrigido para passar o ID em vez de params.row.div
              }}
            />
            <ActionBtn
              icon={MdDone}
              onClick={() => {
                handleDeliver(params.row.id); // Corrigido para passar o ID
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
        toast.success("Product status changed");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Oops! Something went wrong");
      });
  }, []);

  const handleDelete = useCallback(async (id: string, images: any[]) => {
    toast("Deleting product, please wait...");

    const handleImageDelete = async () => {
      try {
        for (const item of images) {
          if (item.image) {
            const imageRef = ref(storage, item.image);
            await deleteObject(imageRef);
          }
        }
      } catch (error) {
        return console.log("Deleting images", error);
      }
    };
    await handleImageDelete();

    axios
      .delete(`/api/product/${id}`)
      .then((res) => {
        toast.success("Product deleted");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Failed to delete product");
      });
  }, []);

  const handleDispatch = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "dispatched",
      })
      .then((res) => {
        toast.success("Order Dispatched");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Oops! Something went wrong");
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
        <Heading title='Orders' center />
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

export default OrdersClient;
