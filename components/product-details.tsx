import React from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { getProductById } from "@/prisma/lib/prisma";
import { Product } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {product.images.length > 0 && (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-cover rounded-md"
                />
              )}
            </div>
            <div>
              <p className="text-3xl font-bold mb-4">{product.price}</p>
              <Badge variant="outline" className="mb-4">
                {product.site}
              </Badge>
              <h3 className="text-xl font-semibold mb-2">Description:</h3>
              <p className="mb-4">{product.description}</p>
              {product.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Features:</h3>
                  <ul className="list-disc list-inside">
                    {product.features.map((feature) => (
                      <li key={feature.id}>{feature.text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const product = await getProductById(id);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductDetails;
