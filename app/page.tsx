// app/page.tsx
import React, { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScraperForm from "@/components/scraper-form";
import ProductList from "@/components/product-list";

const Home: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>E-commerce Product Scraper</CardTitle>
        </CardHeader>
        <CardContent>
          <ScraperForm />
        </CardContent>
      </Card>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList />
      </Suspense>
    </main>
  );
};

export default Home;
