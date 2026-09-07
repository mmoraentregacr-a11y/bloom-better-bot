import type { AccountInfo } from "@azure/msal-browser";
import type { CartItem } from "@/context/CartContext";
import type { CustomerDashboard } from "@/types/customer";
import { accessToken, apiBaseUrl } from "./azure";
import type { Product } from "@/components/ProductCard";

async function authenticatedFetch<T>(account: AccountInfo, path: string, init?: RequestInit): Promise<T> {
  const token = await accessToken(account);
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "No pudimos completar la solicitud.");
  }
  return response.json() as Promise<T>;
}

export const customerApi = {
  catalog: async (filter?: { category?: string; subcategory?: string }) => {
    const params = new URLSearchParams();
    if (filter?.category) params.set("category", filter.category);
    if (filter?.subcategory) params.set("subcategory", filter.subcategory);
    const response = await fetch(`${apiBaseUrl}/products?${params}`);
    if (!response.ok) throw new Error("No pudimos cargar el catálogo.");
    return response.json() as Promise<Product[]>;
  },
  builderOptions: async () => {
    const response = await fetch(`${apiBaseUrl}/builder-options`);
    if (!response.ok) throw new Error("No pudimos cargar las opciones del ramo.");
    return response.json() as Promise<Array<{ id: string; sku: string; group: "flower" | "wrap" | "addon"; name: string; color?: string; price: number; min: number; max: number }>>;
  },
  dashboard: (account: AccountInfo) => authenticatedFetch<CustomerDashboard>(account, "/me"),
  createOrder: (account: AccountInfo, payload: { items: CartItem[]; delivery: Record<string, string> }) =>
    authenticatedFetch<OrderInvoice>(account, "/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export type OrderInvoice = {
  id:string; invoiceNumber:string; createdAt:string; currency:"CRC";
  items:Array<{sku:string;name:string;quantity:number;unitPrice:number;lineSubtotal:number;configuration?:Array<{sku:string;name:string;quantity:number;unitPrice:number}>}>;
  delivery:Record<string,string>; subtotal:number; taxRate:number; taxAmount:number; total:number; notificationSent:boolean;
};
