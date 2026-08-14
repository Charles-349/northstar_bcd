import { useState } from "react";
import OrderTracking from "./components/OrderTracking";
import Analytics from "./pages/Analytics";
import "./App.css";

function App() {
  const [page, setPage] = useState<"orders" | "analytics">("orders");

  return (
    <div className="app">
      <nav className="app-navigation">
        <button
          onClick={() => setPage("orders")}
          className={page === "orders" ? "nav-button active" : "nav-button"}
        >
          Order Tracking
        </button>

        <button
          onClick={() => setPage("analytics")}
          className={
            page === "analytics" ? "nav-button active" : "nav-button"
          }
        >
          Analytics
        </button>
      </nav>

      <main className="app-content">
        {page === "orders" && <OrderTracking />}
        {page === "analytics" && <Analytics />}
      </main>
    </div>
  );
}

export default App;