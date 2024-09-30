import { NextRequest, NextResponse } from "next/server";
import { ScrapeFormData } from "@/types";
import { scrapeProduct } from "@/prisma/lib/scrapper";
import prisma from "@/prisma/lib/prisma";

export async function POST(request: NextRequest) {
  const data: ScrapeFormData = await request.json();

  try {
    const scrapedData = await scrapeProduct(data);
    const product = await prisma.product.create({
      data: {
        ...scrapedData,
        images: { create: scrapedData.images.map((url) => ({ url })) },
        features: { create: scrapedData.features.map((text) => ({ text })) },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Scraping failed:", error);
    let errorMessage = "An unexpected error occurred";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (errorMessage.includes("HTTP error! status: 403")) {
        statusCode = 403;
        errorMessage =
          "Access to the website is forbidden. The website may be blocking our requests.";
      } else if (
        errorMessage.includes("Failed to extract essential product information")
      ) {
        statusCode = 404;
        errorMessage =
          "Could not find product information. The website structure might have changed.";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
