import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapeFormData } from "@/types";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function scrapeProduct(data: ScrapeFormData) {
  const { url, site } = data;
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  const headers = {
    "User-Agent": userAgent,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
  };

  // Add random delay between 2 to 5 seconds
  await sleep(2000 + Math.random() * 3000);

  try {
    const response = await axios.get(url, {
      headers,
      timeout: 15000, // 15 seconds timeout
    });

    const $ = cheerio.load(response.data);
    let name = "",
      price = "",
      description = "",
      images: string[] = [],
      features: string[] = [];

    if (site === "amazon") {
      name = $("#productTitle").text().trim();
      price = $(".a-price-whole").first().text().trim();
      description = $("#productDescription").text().trim();
      $("#altImages .a-unordered-list img").each((_, el) => {
        const src = $(el).attr("src");
        if (src) images.push(src.replace(/._[^.]+\./, "."));
      });
      $("#feature-bullets ul li").each((_, el) => {
        features.push($(el).text().trim());
      });
    } else if (site === "flipkart") {
      name = $(".B_NuCI").text().trim();
      if (!name) name = $("h1 span").text().trim(); // Alternative selector
      price = $("._30jeq3").text().trim();
      if (!price) price = $("div[class*='_30jeq3']").text().trim(); // Alternative selector
      description = $("._1mXcCf").text().trim();
      if (!description) description = $("div[class*='_1mXcCf']").text().trim(); // Alternative selector
      $("._3GnUWp img, ._2r_T1I").each((_, el) => {
        // Added alternative image selector
        const src = $(el).attr("src");
        if (src) images.push(src);
      });
      $("._2418kt ul li, ._21Ahn-").each((_, el) => {
        // Added alternative feature selector
        features.push($(el).text().trim());
      });
    }

    if (!name || !price) {
      throw new Error(
        `Failed to extract essential product information for ${site}`
      );
    }

    return { name, price, description, site, url, images, features };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`HTTP error! status: ${error.response.status}`);
      } else if (error.request) {
        throw new Error("No response received from the server");
      } else {
        throw new Error("Error setting up the request");
      }
    } else {
      throw error;
    }
  }
}
