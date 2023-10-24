"use client";

import { categories } from "@/utils/Categories";
import Container from "../Container";
import { useSearchParams, usePathname } from "next/navigation";

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/";
  if (!isMainPage) return null;
  return (
    <div className='bg-white'>
      <Container>
        <div className='pt-4 flex flex-row items-center justify-between overflow-x-auto'>
          {categories.map((item) => (
            <div></div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
