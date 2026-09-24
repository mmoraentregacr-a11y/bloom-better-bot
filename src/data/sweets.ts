import { productos } from "@/data/productos";

export const sweetSku = (productId: string) => `ADD-DULCE-${productId.toUpperCase()}`;

export const sweets = productos
  .filter(product => product.subcategoria === "Dulces")
  .map(product => ({
    ...product,
    sku: sweetSku(product.id),
  }));

export const sweetBySku = new Map(sweets.map(sweet => [sweet.sku, sweet]));
