// components/ProductList.tsx
import React from "react";
import { Product } from "@/types";
import { getProducts } from "@/prisma/lib/prisma";
import ProductCard from "./product-card";

const ProductList: React.FC = async () => {
  const products = await getProducts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
