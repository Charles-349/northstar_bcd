import { useState } from "react";
import OrderTracking from "./components/OrderTracking";
import ReturnsSupport from "./pages/Returnssupport";
import Analytics from "./pages/Analytics";

import "./App.css";

type Page = "orders" | "returns" | "analytics";

function App() {
  const [page, setPage] = useState<Page>("orders");

  return (
    <div className="app">
      <nav className="app-navigation">
        <button
          onClick={() => setPage("orders")}
          className={
            page === "orders"
              ? "nav-button active"
              : "nav-button"
          }
        >
          Order Tracking
        </button>

        <button
          onClick={() => setPage("returns")}
          className={
            page === "returns"
              ? "nav-button active"
              : "nav-button"
          }
        >
          Returns & Support
        </button>

        <button
          onClick={() => setPage("analytics")}
          className={
            page === "analytics"
              ? "nav-button active"
              : "nav-button"
          }
        >
          Analytics
        </button>
      </nav>

      <main className="app-content">
        {page === "orders" && <OrderTracking />}

        {page === "returns" && <ReturnsSupport />}

        {page === "analytics" && <Analytics />}
      </main>
    </div>
  );
}

export default App;