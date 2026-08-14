import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

//ENUMS
export const orderStatusEnum = pgEnum("order_status", [
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

export const returnStatusEnum = pgEnum("return_status", [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "RECEIVED",
  "COMPLETED",
]);

export const refundStatusEnum = pgEnum("refund_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

export const supportCategoryEnum = pgEnum("support_category", [
  "ORDER_TRACKING",
  "RETURNS_REFUNDS",
]);

export const resolutionTypeEnum = pgEnum("resolution_type", [
  "AUTOMATED",
  "ESCALATED",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]);

//CUSTOMERS
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  email: varchar("email", {
    length: 150,
  }).notNull().unique(),
  phone: varchar("phone", {
    length: 20,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

//PRODUCTS
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", {
    length: 150,
  }).notNull(),
  sku: varchar("sku", {
    length: 50,
  }).notNull().unique(),
  price: decimal("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

//ORDERS
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", {
    length: 50,
  }).notNull().unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),
  status: orderStatusEnum("status")
    .default("PROCESSING")
    .notNull(),
  carrier: varchar("carrier", {
    length: 100,
  }),
  trackingNumber: varchar("tracking_number", {
    length: 100,
  }),
  estimatedDelivery: timestamp("estimated_delivery", {
    withTimezone: true,
  }),
  deliveredAt: timestamp("delivered_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

//ORDER ITEMS
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "restrict",
    }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

// RETURNS
export const returns = pgTable("returns", {
  id: serial("id").primaryKey(),
  returnNumber: varchar("return_number", {
    length: 50,
  }).notNull().unique(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),
  reason: varchar("reason", {
    length: 255,
  }).notNull(),
  status: returnStatusEnum("status")
    .default("REQUESTED")
    .notNull(),
  requestedAt: timestamp("requested_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  approvedAt: timestamp("approved_at", {
    withTimezone: true,
  }),
});

//REFUNDS
export const refunds = pgTable("refunds", {
  id: serial("id").primaryKey(),
  refundNumber: varchar("refund_number", {
    length: 50,
  }).notNull().unique(),
  returnId: integer("return_id")
    .notNull()
    .references(() => returns.id, {
      onDelete: "cascade",
    }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  amount: decimal("amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  status: refundStatusEnum("status")
    .default("PENDING")
    .notNull(),
  processedAt: timestamp("processed_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

//SUPPORT QUERIES
export const supportQueries = pgTable("support_queries", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  category: supportCategoryEnum("category").notNull(),
  resolved: boolean("resolved")
    .default(false)
    .notNull(),
  resolutionType: resolutionTypeEnum("resolution_type"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

//SUPPORT TICKETS
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: varchar("ticket_number", {
    length: 50,
  }).notNull().unique(),
  category: supportCategoryEnum("category").notNull(),
  subject: varchar("subject", {
    length: 255,
  }).notNull(),
  description: text("description").notNull(),
  status: ticketStatusEnum("status")
    .default("OPEN")
    .notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

//RELATIONS
export const customersRelations = relations(
  customers,
  ({ many }) => ({
    orders: many(orders),
    returns: many(returns),
  })
);

export const productsRelations = relations(
  products,
  ({ many }) => ({
    orderItems: many(orderItems),
  })
);

export const ordersRelations = relations(
  orders,
  ({ one, many }) => ({
    customer: one(customers, {
      fields: [orders.customerId],
      references: [customers.id],
    }),
    items: many(orderItems),
    returns: many(returns),
    refunds: many(refunds),
  })
);

export const orderItemsRelations = relations(
  orderItems,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
    }),
    product: one(products, {
      fields: [orderItems.productId],
      references: [products.id],
    }),
  })
);

export const returnsRelations = relations(
  returns,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [returns.orderId],
      references: [orders.id],
    }),

    customer: one(customers, {
      fields: [returns.customerId],
      references: [customers.id],
    }),

    refunds: many(refunds),
  })
);

export const refundsRelations = relations(
  refunds,
  ({ one }) => ({
    return: one(returns, {
      fields: [refunds.returnId],
      references: [returns.id],
    }),

    order: one(orders, {
      fields: [refunds.orderId],
      references: [orders.id],
    }),
  })
);