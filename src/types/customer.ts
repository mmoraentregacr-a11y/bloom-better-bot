export type OrderStatus = "pending" | "paid" | "cancelled";

export type CustomerOrder = {
  id: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  itemCount: number;
  cancellationReason?: string | null;
};

export type LoyaltySummary = {
  completedPurchases: number;
  cycleSpend: number;
  discountAvailable: boolean;
  freeShippingAvailable: boolean;
  creditAvailable: number;
};

export type CustomerDashboard = {
  isAdmin: boolean;
  name: string;
  email: string;
  phone?: string;
  loyalty: LoyaltySummary;
  orders: CustomerOrder[];
};
