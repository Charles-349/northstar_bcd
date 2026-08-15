import { useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiMessageCircle,
  FiSearch,
  FiSend,
} from "react-icons/fi";

import "./ReturnsSupport.css";

const API_URL = import.meta.env.VITE_API_URL;

interface EligibilityResponse {
  eligible: boolean;
  reason: string;
}

interface ReturnResponse {
  id: number;
  returnNumber: string;
  orderId: number;
  customerId: number;
  reason: string;
  status: string;
  requestedAt: string;
  approvedAt: string | null;
}

interface RefundResponse {
  returnNumber: string;
  returnStatus: string;
  refundStatus: string;
  refundAmount: string | null;
}

interface TicketResponse {
  id: number;
  ticketNumber: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ReturnsSupport = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [eligibility, setEligibility] =
    useState<EligibilityResponse | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnData, setReturnData] =
    useState<ReturnResponse | null>(null);
  const [creatingReturn, setCreatingReturn] = useState(false);

  const [returnNumber, setReturnNumber] = useState("");
  const [refundData, setRefundData] =
    useState<RefundResponse | null>(null);
  const [checkingRefund, setCheckingRefund] = useState(false);

  const [queryId, setQueryId] = useState("");
  const [subject, setSubject] = useState("");
  const [ticket, setTicket] =
    useState<TicketResponse | null>(null);
  const [escalating, setEscalating] = useState(false);

  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketResult, setTicketResult] =
    useState<TicketResponse | null>(null);
  const [checkingTicket, setCheckingTicket] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCheckEligibility = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const trimmedOrderNumber = orderNumber.trim();

    if (!trimmedOrderNumber) {
      setError("Please enter an order number.");
      return;
    }

    setError("");
    setSuccess("");
    setEligibility(null);
    setCheckingEligibility(true);

    try {
      const response = await fetch(
        `${API_URL}/returns/eligibility/${encodeURIComponent(
          trimmedOrderNumber
        )}`
      );

      const data: EligibilityResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.reason || "Unable to check return eligibility."
        );
      }

      setEligibility(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to check return eligibility."
      );
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleCreateReturn = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const trimmedOrderNumber = orderNumber.trim();
    const parsedCustomerId = Number(customerId);
    const trimmedReason = returnReason.trim();

    if (!trimmedOrderNumber) {
      setError("Please enter an order number.");
      return;
    }

    if (
      !customerId ||
      Number.isNaN(parsedCustomerId) ||
      parsedCustomerId <= 0
    ) {
      setError("Please enter a valid customer ID.");
      return;
    }

    if (!trimmedReason) {
      setError("Please provide a reason for the return.");
      return;
    }

    setError("");
    setSuccess("");
    setCreatingReturn(true);

    try {
      const response = await fetch(`${API_URL}/returns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: trimmedOrderNumber,
          customerId: parsedCustomerId,
          reason: trimmedReason,
        }),
      });

      const data: ReturnResponse & { message?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create return request."
        );
      }

      setReturnData(data);
      setSuccess(
        `Return request created successfully. Your return number is ${data.returnNumber}.`
      );
      setReturnNumber(data.returnNumber);
      setReturnReason("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create return request."
      );
    } finally {
      setCreatingReturn(false);
    }
  };

  const handleCheckRefund = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const trimmedReturnNumber = returnNumber.trim();

    if (!trimmedReturnNumber) {
      setError("Please enter a return number.");
      return;
    }

    setError("");
    setSuccess("");
    setRefundData(null);
    setCheckingRefund(true);

    try {
      const response = await fetch(
        `${API_URL}/returns/${encodeURIComponent(
          trimmedReturnNumber
        )}/refund-status`
      );

      const data: RefundResponse & { message?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to retrieve refund status."
        );
      }

      setRefundData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve refund status."
      );
    } finally {
      setCheckingRefund(false);
    }
  };

  const handleEscalate = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const parsedQueryId = Number(queryId);
    const trimmedSubject = subject.trim();

    if (
      !queryId ||
      Number.isNaN(parsedQueryId) ||
      parsedQueryId <= 0
    ) {
      setError("Please enter a valid support query ID.");
      return;
    }

    setError("");
    setSuccess("");
    setTicket(null);
    setEscalating(true);

    try {
      const response = await fetch(
        `${API_URL}/support/escalate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queryId: parsedQueryId,
            subject: trimmedSubject || undefined,
          }),
        }
      );

      const data: TicketResponse & { message?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to escalate support query."
        );
      }

      setTicket(data);
      setTicketNumber(data.ticketNumber);
      setSuccess(
        `Your support request has been escalated successfully. Ticket number: ${data.ticketNumber}`
      );
      setSubject("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to escalate support query."
      );
    } finally {
      setEscalating(false);
    }
  };

  const handleCheckTicket = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const trimmedTicketNumber = ticketNumber.trim();

    if (!trimmedTicketNumber) {
      setError("Please enter a ticket number.");
      return;
    }

    setError("");
    setSuccess("");
    setTicketResult(null);
    setCheckingTicket(true);

    try {
      const response = await fetch(
        `${API_URL}/support/tickets/${encodeURIComponent(
          trimmedTicketNumber
        )}`
      );

      const data: TicketResponse & { message?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Ticket not found."
        );
      }

      setTicketResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve ticket."
      );
    } finally {
      setCheckingTicket(false);
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

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  return (
    <main className="returns-support-page">
      <div className="returns-support-container">
        <section className="returns-support-header">
          <div className="returns-support-icon">
            <FiRefreshCw />
          </div>

          <h1>Returns & Support</h1>

          <p>
            Check your return eligibility, request a return,
            track your refund, or get help from our support team.
          </p>
        </section>

        {error && (
          <div className="support-error" role="alert">
            <FiAlertCircle />

            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="support-success" role="status">
            <FiCheckCircle />

            <div>
              <strong>Success</strong>
              <p>{success}</p>
            </div>
          </div>
        )}

        <section className="support-card">
          <div className="support-card-header">
            <div className="support-card-icon">
              <FiRefreshCw />
            </div>

            <div>
              <h2>Check Return Eligibility</h2>

              <p>
                Enter your order number to find out whether
                your order can be returned.
              </p>
            </div>
          </div>

          <form
            className="support-form"
            onSubmit={handleCheckEligibility}
          >
            <label htmlFor="orderNumber">
              Order Number
            </label>

            <div className="support-input-group">
              <input
                id="orderNumber"
                type="text"
                placeholder="e.g. OR1002"
                value={orderNumber}
                onChange={(event) =>
                  setOrderNumber(event.target.value)
                }
              />

              <button
                type="submit"
                disabled={checkingEligibility}
              >
                <FiSearch />

                {checkingEligibility
                  ? "Checking..."
                  : "Check Eligibility"}
              </button>
            </div>
          </form>

          {eligibility && (
            <div
              className={
                eligibility.eligible
                  ? "eligibility-result eligible"
                  : "eligibility-result not-eligible"
              }
            >
              {eligibility.eligible ? (
                <FiCheckCircle />
              ) : (
                <FiAlertCircle />
              )}

              <div>
                <strong>
                  {eligibility.eligible
                    ? "Eligible for Return"
                    : "Not Eligible for Return"}
                </strong>

                <p>{eligibility.reason}</p>
              </div>
            </div>
          )}

          {eligibility?.eligible && (
            <form
              className="return-request-form"
              onSubmit={handleCreateReturn}
            >
              <h3>Request a Return</h3>

              <label htmlFor="customerId">
                Customer ID
              </label>

              <input
                id="customerId"
                type="number"
                min="1"
                placeholder="e.g. 6"
                value={customerId}
                onChange={(event) =>
                  setCustomerId(event.target.value)
                }
              />

              <label htmlFor="returnReason">
                Reason for Return
              </label>

              <textarea
                id="returnReason"
                placeholder="Tell us why you want to return this order..."
                value={returnReason}
                onChange={(event) =>
                  setReturnReason(event.target.value)
                }
              />

              <button
                type="submit"
                disabled={creatingReturn}
              >
                <FiRefreshCw />

                {creatingReturn
                  ? "Submitting..."
                  : "Request Return"}
              </button>
            </form>
          )}

          {returnData && (
            <div className="eligibility-result eligible">
              <FiCheckCircle />

              <div>
                <strong>Return Request Created</strong>

                <p>
                  Return Number:{" "}
                  <strong>{returnData.returnNumber}</strong>
                </p>

                <p>
                  Status:{" "}
                  <strong>
                    {formatStatus(returnData.status)}
                  </strong>
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="support-card">
          <div className="support-card-header">
            <div className="support-card-icon">
              <FiRefreshCw />
            </div>

            <div>
              <h2>Check Refund Status</h2>

              <p>
                Enter your return number to check the current
                status of your refund.
              </p>
            </div>
          </div>

          <form
            className="support-form"
            onSubmit={handleCheckRefund}
          >
            <label htmlFor="returnNumber">
              Return Number
            </label>

            <div className="support-input-group">
              <input
                id="returnNumber"
                type="text"
                placeholder="e.g. RET-123456789"
                value={returnNumber}
                onChange={(event) =>
                  setReturnNumber(event.target.value)
                }
              />

              <button
                type="submit"
                disabled={checkingRefund}
              >
                <FiSearch />

                {checkingRefund
                  ? "Checking..."
                  : "Check Refund"}
              </button>
            </div>
          </form>

          {refundData && (
            <div className="refund-result">
              <div className="refund-row">
                <span>Return Number</span>

                <strong>
                  {refundData.returnNumber}
                </strong>
              </div>

              <div className="refund-row">
                <span>Return Status</span>

                <strong
                  className={`status status-${refundData.returnStatus
                    .toLowerCase()
                    .replace(/_/g, "-")}`}
                >
                  {formatStatus(refundData.returnStatus)}
                </strong>
              </div>

              <div className="refund-row">
                <span>Refund Status</span>

                <strong
                  className={`status status-${refundData.refundStatus
                    .toLowerCase()
                    .replace(/_/g, "-")}`}
                >
                  {formatStatus(refundData.refundStatus)}
                </strong>
              </div>

              <div className="refund-row">
                <span>Refund Amount</span>

                <strong>
                  {refundData.refundAmount
                    ? `KES ${Number(
                        refundData.refundAmount
                      ).toLocaleString("en-KE", {
                        minimumFractionDigits: 2,
                      })}`
                    : "Not available"}
                </strong>
              </div>
            </div>
          )}
        </section>

        <section className="support-card">
          <div className="support-card-header">
            <div className="support-card-icon">
              <FiMessageCircle />
            </div>

            <div>
              <h2>Contact Human Support</h2>

              <p>
                If your question was not resolved automatically,
                escalate it to a support agent.
              </p>
            </div>
          </div>

          <form
            className="support-form"
            onSubmit={handleEscalate}
          >
            <label htmlFor="queryId">
              Support Query ID
            </label>

            <input
              id="queryId"
              type="number"
              min="1"
              placeholder="e.g. 6"
              value={queryId}
              onChange={(event) =>
                setQueryId(event.target.value)
              }
            />

            <label htmlFor="subject">
              Subject
            </label>

            <input
              id="subject"
              type="text"
              placeholder="e.g. My order has not arrived"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
            />

            <button
              type="submit"
              disabled={escalating}
            >
              <FiSend />

              {escalating
                ? "Escalating..."
                : "Contact Support"}
            </button>
          </form>

          {ticket && (
            <div className="ticket-result">
              <div className="ticket-success">
                <FiCheckCircle />

                <div>
                  <strong>
                    Support Ticket Created
                  </strong>

                  <p>
                    Your ticket number is{" "}
                    <strong>
                      {ticket.ticketNumber}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="ticket-details">
                <div>
                  <span>Ticket Number</span>
                  <strong>{ticket.ticketNumber}</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>
                    {formatStatus(ticket.category)}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong
                    className={`status status-${ticket.status
                      .toLowerCase()
                      .replace(/_/g, "-")}`}
                  >
                    {formatStatus(ticket.status)}
                  </strong>
                </div>

                <div>
                  <span>Created</span>
                  <strong>
                    {formatDate(ticket.createdAt)}
                  </strong>
                </div>
              </div>

              <div className="ticket-description">
                <span>Subject</span>
                <p>{ticket.subject}</p>
              </div>
            </div>
          )}
        </section>

        <section className="support-card">
          <div className="support-card-header">
            <div className="support-card-icon">
              <FiMessageCircle />
            </div>

            <div>
              <h2>Track Support Ticket</h2>

              <p>
                Enter your ticket number to see its current
                status.
              </p>
            </div>
          </div>

          <form
            className="support-form"
            onSubmit={handleCheckTicket}
          >
            <label htmlFor="ticketNumber">
              Ticket Number
            </label>

            <div className="support-input-group">
              <input
                id="ticketNumber"
                type="text"
                placeholder="e.g. TCK-123456789"
                value={ticketNumber}
                onChange={(event) =>
                  setTicketNumber(event.target.value)
                }
              />

              <button
                type="submit"
                disabled={checkingTicket}
              >
                <FiSearch />

                {checkingTicket
                  ? "Checking..."
                  : "Check Ticket"}
              </button>
            </div>
          </form>

          {ticketResult && (
            <div className="ticket-result">
              <div className="ticket-details">
                <div>
                  <span>Ticket Number</span>
                  <strong>
                    {ticketResult.ticketNumber}
                  </strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>
                    {formatStatus(ticketResult.category)}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong
                    className={`status status-${ticketResult.status
                      .toLowerCase()
                      .replace(/_/g, "-")}`}
                  >
                    {formatStatus(ticketResult.status)}
                  </strong>
                </div>

                <div>
                  <span>Created</span>

                  <strong>
                    {formatDate(ticketResult.createdAt)}
                  </strong>
                </div>

                <div>
                  <span>Last Updated</span>

                  <strong>
                    {formatDate(ticketResult.updatedAt)}
                  </strong>
                </div>
              </div>

              <div className="ticket-description">
                <span>Subject</span>
                <p>{ticketResult.subject}</p>
              </div>

              <div className="ticket-description">
                <span>Description</span>
                <p>{ticketResult.description}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ReturnsSupport;