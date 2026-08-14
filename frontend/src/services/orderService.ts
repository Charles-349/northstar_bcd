import type { OrderTracking } from "../types/order";

const API_URL = import.meta.env.VITE_API_URL;

interface OrderTrackingResponse {
  message: string;
  tracking: OrderTracking;
}

export const getOrderTracking = async (
  orderNumber: string
): Promise<OrderTracking> => {
  const response = await fetch(
    `${API_URL}/orders/${encodeURIComponent(orderNumber)}/tracking`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("ORDER_NOT_FOUND");
    }

    throw new Error("SERVER_ERROR");
  }

  const data: OrderTrackingResponse = await response.json();

  return data.tracking;
};