export interface OrderTracking {
  orderNumber: string;
  status: string;
  carrier: string | null;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}
