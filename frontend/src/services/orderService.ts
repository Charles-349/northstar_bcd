import type { OrderTracking } from "../types/order";

const API_URL = "http://localhost:8081";

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

  return response.json();
};
