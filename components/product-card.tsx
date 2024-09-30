// components/ProductCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {product.images.length > 0 && (
          <div className="mb-4">
            <Image
              src={product.images[0].url}
              alt={product.name}
              width={300}
              height={300}
              className="object-cover rounded-md"
            />
          </div>
        )}
        <p className="text-2xl font-bold mb-2">{product.price}</p>
        <Badge variant="outline" className="mb-2">
          {product.site}
        </Badge>
        {product.features.length > 0 && (
          <div className="mt-2">
            <h4 className="font-semibold mb-1">Features:</h4>
            <ul className="list-disc list-inside">
              {product.features.slice(0, 3).map((feature) => (
                <li key={feature.id} className="text-sm">
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/products/${product.id}`} passHref>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
