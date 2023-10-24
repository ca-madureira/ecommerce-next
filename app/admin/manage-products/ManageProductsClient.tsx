"use client";
import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import {
  MdCached,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
  MdClose,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { formatPrice } from "@/utils/formatPrice";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Status from "@/app/components/Status";

import { firebaseApp } from "@/libs/firebase";

interface ManageProductsClientProps {
  products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
  products,
}) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);
  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Nome", width: 220 },
    {
      field: "price",
      headerName: "Preço(USD)",
      width: 100,
      renderCell: (params) => {
        return <div>{params.row.price}</div>;
      },
    },
    { field: "category", headerName: "Categoria", width: 100 },
    { field: "brand", headerName: "Marca", width: 100 },
    {
      field: "inStock",
      headerName: "Em estoque",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.inStock === true ? (
              <Status
                text='in stock'
                icon={MdDone}
                bg='bg-teal-200'
                color='text-teal-700'
              />
            ) : (
              <Status
                text='out of sotck'
                icon={MdClose}
                bg='bg-rose-200'
                color='text-rose-700'
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Ações",
      width: 200,
      renderCell: (params) => {
        return (
          <div className='flex justify-between gap-4 w-full'>
            <ActionBtn
              icon={MdCached}
              onClick={() => {
                handleToggleStock(params.row.id, params.row.inStock);
              }}
            />
            <ActionBtn
              icon={MdDelete}
              onClick={() => {
                handleDelete(params.row.id, params.row.images);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`product/${params.row.id}`);
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

  const handleDelete = useCallback(async (id: string, images: any[]) => {
    toast("Deletando produto, aguarde...");

    const handleImageDelete = async () => {
      try {
        for (const item of images) {
          if (item.image) {
            const imageRef = ref(storage, item.image);
            await deleteObject(imageRef);
          }
        }
      } catch (error) {
        return console.log("Deletando images", error);
      }
    };
    await handleImageDelete();

    axios
      .delete(`/api/product/${id}`)
      .then((res) => {
        toast.success("Produto deletado");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Falha ao deletar produto");
      });
  }, []);
  return (
    <div className='max-w-[1150px] m-auto text-xl'>
      <div className='mb-4 mt-8'>
        <Heading title='Gerenciar Produtos' center />
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

export default ManageProductsClient;
