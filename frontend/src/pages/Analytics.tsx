import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

interface AnalyticsData {
  support: {
    totalQueries: number;
    automated: number;
    escalated: number;
    resolved: number;
    deflectionRate: number;
    estimatedHoursSaved: string | number;
  };

  tickets: {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  };

  orders: {
    total: number;
    delivered: number;
    cancelled: number;
  };

  returns: {
    total: number;
  };

  refunds: {
    total: number;
  };
}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "22px",
  boxShadow: "0 4px 15px rgba(15, 23, 42, 0.06)",
};

const chartStyle: React.CSSProperties = {
  ...cardStyle,
  minWidth: 0,
};

export default function Analytics() {
  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/analytics`);

      if (!response.ok) {
        throw new Error(
          `Analytics request failed: ${response.status}`
        );
      }

      const result = await response.json();

      const data =
        result.analytics ??
        result.data?.analytics ??
        result.data ??
        result;

      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);

      setError(
        "Unable to load analytics. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #dbeafe",
              borderTop: "4px solid #2563eb",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite",
            }}
          />

          <p
            style={{
              marginTop: "16px",
              color: "#64748b",
            }}
          >
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "#ffffff",
            border: "1px solid #fecaca",
            borderRadius: "14px",
            padding: "35px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px" }}>⚠️</div>

          <h2
            style={{
              color: "#0f172a",
              marginTop: "15px",
            }}
          >
            Unable to load analytics
          </h2>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
            }}
          >
            {error ||
              "No analytics data was returned by the server."}
          </p>

          <button
            onClick={fetchAnalytics}
            style={{
              marginTop: "20px",
              padding: "11px 20px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const supportResolutionData = [
    {
      name: "Automated",
      value: analytics.support.automated,
    },
    {
      name: "Escalated",
      value: analytics.support.escalated,
    },
  ];

  const ticketData = [
    {
      name: "Open",
      value: analytics.tickets.open,
    },
    {
      name: "In Progress",
      value: analytics.tickets.inProgress,
    },
    {
      name: "Closed",
      value: analytics.tickets.closed,
    },
  ];

  const orderData = [
    {
      name: "Total",
      value: analytics.orders.total,
    },
    {
      name: "Delivered",
      value: analytics.orders.delivered,
    },
    {
      name: "Cancelled",
      value: analytics.orders.cancelled,
    },
  ];

  const returnsRefundsData = [
    {
      name: "Returns",
      value: analytics.returns.total,
    },
    {
      name: "Refunds",
      value: analytics.refunds.total,
    },
  ];

  const performanceData = [
    {
      name: "Resolved",
      value: analytics.support.resolved,
    },
    {
      name: "Automated",
      value: analytics.support.automated,
    },
    {
      name: "Escalated",
      value: analytics.support.escalated,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              📊 Support & Workload Analytics
            </h1>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              Monitor customer support, tickets, orders, returns
              and refunds
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            style={{
              padding: "11px 18px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ↻ Refresh
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                TOTAL SUPPORT QUERIES
              </span>

              <span style={{ fontSize: "22px" }}>💬</span>
            </div>

            <div
              style={{
                fontSize: "34px",
                fontWeight: 700,
                color: "#0f172a",
                marginTop: "15px",
              }}
            >
              {analytics.support.totalQueries}
            </div>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              All recorded customer support queries
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                DEFLECTION RATE
              </span>

              <span style={{ fontSize: "22px" }}>📈</span>
            </div>

            <div
              style={{
                fontSize: "34px",
                fontWeight: 700,
                color: "#059669",
                marginTop: "15px",
              }}
            >
              {analytics.support.deflectionRate}%
            </div>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Queries handled automatically
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                AUTO-RESOLVED
              </span>

              <span style={{ fontSize: "22px" }}>✅</span>
            </div>

            <div
              style={{
                fontSize: "34px",
                fontWeight: 700,
                color: "#0f172a",
                marginTop: "15px",
              }}
            >
              {analytics.support.automated}
            </div>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Automated support resolutions
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                EST. HOURS SAVED
              </span>

              <span style={{ fontSize: "22px" }}>⏱️</span>
            </div>

            <div
              style={{
                fontSize: "34px",
                fontWeight: 700,
                color: "#0f172a",
                marginTop: "15px",
              }}
            >
              {analytics.support.estimatedHoursSaved}h
            </div>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Estimated support time saved
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={chartStyle}>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "19px",
              }}
            >
              Support Resolution
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Automated versus escalated support queries
            </p>

            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supportResolutionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={chartStyle}>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "19px",
              }}
            >
              Ticket Status
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Current support ticket distribution
            </p>

            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Tickets"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={chartStyle}>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "19px",
              }}
            >
              Order Performance
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Overall order processing performance
            </p>

            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Orders"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={chartStyle}>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "19px",
              }}
            >
              Returns & Refunds
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Customer returns and refund activity
            </p>

            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={returnsRefundsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Count"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={chartStyle}>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "19px",
              }}
            >
              Support Performance
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Resolved, automated and escalated support activity
            </p>

            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Queries"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={chartStyle}>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "19px",
              }}
            >
              Ticket Issues
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Current customer support ticket workload
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "14px",
                marginTop: "25px",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Total Tickets
                </p>

                <strong
                  style={{
                    display: "block",
                    fontSize: "32px",
                    color: "#0f172a",
                    marginTop: "8px",
                  }}
                >
                  {analytics.tickets.total}
                </strong>
              </div>

              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#2563eb",
                    fontSize: "14px",
                  }}
                >
                  Open
                </p>

                <strong
                  style={{
                    display: "block",
                    fontSize: "32px",
                    color: "#1d4ed8",
                    marginTop: "8px",
                  }}
                >
                  {analytics.tickets.open}
                </strong>
              </div>

              <div
                style={{
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#ea580c",
                    fontSize: "14px",
                  }}
                >
                  In Progress
                </p>

                <strong
                  style={{
                    display: "block",
                    fontSize: "32px",
                    color: "#c2410c",
                    marginTop: "8px",
                  }}
                >
                  {analytics.tickets.inProgress}
                </strong>
              </div>

              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#059669",
                    fontSize: "14px",
                  }}
                >
                  Closed
                </p>

                <strong
                  style={{
                    display: "block",
                    fontSize: "32px",
                    color: "#047857",
                    marginTop: "8px",
                  }}
                >
                  {analytics.tickets.closed}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
          }}
        >
          <div
            style={{
              ...cardStyle,
              borderLeft: "5px solid #2563eb",
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              TOTAL ORDERS
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "30px",
                color: "#0f172a",
                marginTop: "8px",
              }}
            >
              {analytics.orders.total}
            </strong>
          </div>

          <div
            style={{
              ...cardStyle,
              borderLeft: "5px solid #10b981",
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              DELIVERED
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "30px",
                color: "#059669",
                marginTop: "8px",
              }}
            >
              {analytics.orders.delivered}
            </strong>
          </div>

          <div
            style={{
              ...cardStyle,
              borderLeft: "5px solid #ef4444",
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              CANCELLED
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "30px",
                color: "#dc2626",
                marginTop: "8px",
              }}
            >
              {analytics.orders.cancelled}
            </strong>
          </div>

          <div
            style={{
              ...cardStyle,
              borderLeft: "5px solid #f97316",
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              RETURNS
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "30px",
                color: "#ea580c",
                marginTop: "8px",
              }}
            >
              {analytics.returns.total}
            </strong>
          </div>

          <div
            style={{
              ...cardStyle,
              borderLeft: "5px solid #8b5cf6",
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              REFUNDS
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "30px",
                color: "#7c3aed",
                marginTop: "8px",
              }}
            >
              {analytics.refunds.total}
            </strong>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 700px) {
            .analytics-page {
              padding: 20px;
            }
          }
        `}
      </style>
    </div>
  );
}