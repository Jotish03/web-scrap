// types/index.ts
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  site: string;
  url: string;
  images: Image[];
  features: Feature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: string;
  url: string;
}

export interface Feature {
  id: string;
  text: string;
}

export type ScrapeFormData = {
  url: string;
  site: "amazon" | "flipkart";
};
