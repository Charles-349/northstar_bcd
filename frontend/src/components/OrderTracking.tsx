import { useState } from "react";
import {
  FiSearch,
  FiPackage,
  FiTruck,
  FiCalendar,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";

import { getOrderTracking } from "../services/orderService";
import type { OrderTracking as OrderTrackingType } from "../types/order";

import "./OrderTracking.css";

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderTrackingType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedOrderNumber = orderNumber.trim();

    if (!trimmedOrderNumber) {
      setError("Please enter your order number.");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const data = await getOrderTracking(trimmedOrderNumber);
      setOrder(data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "ORDER_NOT_FOUND"
      ) {
        setError(
          "We couldn't find an order with that number. Please check the order number and try again."
        );
      } else {
        setError(
          "Unable to retrieve your order at the moment. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="tracking-page">
      <div className="tracking-container">

        <section className="tracking-header">
          <div className="tracking-icon">
            <FiPackage />
          </div>

          <h1>Track Your Order</h1>

          <p>
            Enter your order number to view the latest status
            of your order.
          </p>
        </section>

        <form
          onSubmit={handleTrackOrder}
          className="tracking-form"
        >
          <label htmlFor="orderNumber">
            Order Number
          </label>

          <div className="search-wrapper">
            <FiSearch className="search-icon" />

            <input
              id="orderNumber"
              type="text"
              placeholder="e.g. OR1002"
              value={orderNumber}
              onChange={(event) =>
                setOrderNumber(event.target.value)
              }
              aria-label="Order number"
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </div>
        </form>

        {error && (
          <div
            className="error-message"
            role="alert"
          >
            <FiAlertCircle />

            <div>
              <strong>Unable to Find Order</strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {order && !error && (
          <section className="order-card">

            <div className="order-card-header">
              <div>
                <span>Order Number</span>
                <h2>{order.orderNumber}</h2>
              </div>

              <span
                className={`status status-${order.status
                  .toLowerCase()
                  .replace(/_/g, "-")}`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>

            <div className="tracking-details">

              <div className="detail-item">
                <FiTruck />

                <div>
                  <span>Carrier</span>
                  <strong>
                    {order.carrier || "Not available"}
                  </strong>
                </div>
              </div>

              <div className="detail-item">
                <FiPackage />

                <div>
                  <span>Tracking Number</span>
                  <strong>
                    {order.trackingNumber || "Not available"}
                  </strong>
                </div>
              </div>

              <div className="detail-item">
                <FiCalendar />

                <div>
                  <span>Estimated Delivery</span>
                  <strong>
                    {formatDate(order.estimatedDelivery)}
                  </strong>
                </div>
              </div>

              <div className="detail-item">
                <FiMapPin />

                <div>
                  <span>Delivered</span>
                  <strong>
                    {formatDate(order.deliveredAt)}
                  </strong>
                </div>
              </div>

            </div>
          </section>
        )}

      </div>
    </main>
  );
};

export default OrderTracking;
