import db from "./db";
import {
    customers,
    products,
    orders,
    orderItems,
    returns,
    refunds,
    supportQueries,
    supportTickets
} from "./schema";

async function seed() {

    console.log("Seeding Northstar database started...");

    // Insert customers
    await db.insert(customers).values([
        {
            name: "Charles David",
            email: "charles.david@example.com",
            phone: "0701656349"
        },
        {
            name: "Evelyne Munguti",
            email: "evelyne.munguti@example.com",
            phone: "0757249082"
        },
        {
            name: "Cliffton Maina",
            email: "cliffton.maina@example.com",
            phone: "0721900326"
        },
        {
            name: "Mary Achieng",
            email: "mary.achieng@example.com",
            phone: "0745678901"
        },
        {
            name: "Damaris Kanga'chu",
            email: "damaris.kangachu@example.com",
            phone: "0796074373"
        },
        {
            name: "Abdul Akim",
            email: "abdul.akim@example.com",
            phone: "0780178931"
        },
        {
            name: "Kevin Ochieng",
            email: "kevin.ochieng@example.com",
            phone: "0778901234"
        },
        {
            name: "Sarah Wambui",
            email: "sarah.wambui@example.com",
            phone: "0789012345"
        }
    ]);

    // Insert products
    await db.insert(products).values([
        {
            name: "Samsung Galaxy S25",
            sku: "SAM-S25-256",
            price: "85000.00"
        },
        {
            name: "Apple iPhone 16",
            sku: "IPH-16-128",
            price: "95000.00"
        },
        {
            name: "HP Pavilion 15",
            sku: "HP-PAV-15",
            price: "78000.00"
        },
        {
            name: "Dell Inspiron 15",
            sku: "DELL-INS-15",
            price: "72000.00"
        },
        {
            name: "Nike Air Max 270",
            sku: "NIKE-AM270",
            price: "12500.00"
        },
        {
            name: "Adidas Ultraboost",
            sku: "ADI-UB-22",
            price: "15000.00"
        },
        {
            name: "Sony WH-1000XM5",
            sku: "SONY-WH1000",
            price: "35000.00"
        },
        {
            name: "JBL Charge 5",
            sku: "JBL-CHARGE5",
            price: "18000.00"
        }
    ]);

    // Insert orders
    await db.insert(orders).values([
        {
            orderNumber: "OR1001",
            customerId: 1,
            status: "PROCESSING",
            carrier: null,
            trackingNumber: null,
            estimatedDelivery: new Date("2026-08-18"),
            deliveredAt: null
        },
        {
            orderNumber: "OR1002",
            customerId: 2,
            status: "SHIPPED",
            carrier: "DHL",
            trackingNumber: "DHL123456789",
            estimatedDelivery: new Date("2026-08-16"),
            deliveredAt: null
        },
        {
            orderNumber: "OR1003",
            customerId: 3,
            status: "OUT_FOR_DELIVERY",
            carrier: "FedEx",
            trackingNumber: "FDX987654321",
            estimatedDelivery: new Date("2026-08-14"),
            deliveredAt: null
        },
        {
            orderNumber: "OR1004",
            customerId: 4,
            status: "DELIVERED",
            carrier: "DHL",
            trackingNumber: "DHL111222333",
            estimatedDelivery: new Date("2026-08-10"),
            deliveredAt: new Date("2026-08-10")
        },
        {
            orderNumber: "OR1005",
            customerId: 5,
            status: "DELIVERED",
            carrier: "FedEx",
            trackingNumber: "FDX444555666",
            estimatedDelivery: new Date("2026-08-05"),
            deliveredAt: new Date("2026-08-05")
        },
        {
            orderNumber: "OR1006",
            customerId: 6,
            status: "DELIVERED",
            carrier: "UPS",
            trackingNumber: "UPS777888999",
            estimatedDelivery: new Date("2026-07-01"),
            deliveredAt: new Date("2026-07-01")
        },
        {
            orderNumber: "OR1007",
            customerId: 7,
            status: "CANCELLED",
            carrier: null,
            trackingNumber: null,
            estimatedDelivery: null,
            deliveredAt: null
        },
        {
            orderNumber: "OR1008",
            customerId: 8,
            status: "SHIPPED",
            carrier: "Kenya Post",
            trackingNumber: "KP123456789",
            estimatedDelivery: new Date("2026-08-19"),
            deliveredAt: null
        }
    ]);

    // Insert order items
    await db.insert(orderItems).values([
        {
            orderId: 1,
            productId: 1,
            quantity: 1,
            price: "85000.00"
        },
        {
            orderId: 2,
            productId: 2,
            quantity: 1,
            price: "95000.00"
        },
        {
            orderId: 3,
            productId: 3,
            quantity: 1,
            price: "78000.00"
        },
        {
            orderId: 4,
            productId: 5,
            quantity: 1,
            price: "12500.00"
        },
        {
            orderId: 5,
            productId: 6,
            quantity: 1,
            price: "15000.00"
        },
        {
            orderId: 6,
            productId: 7,
            quantity: 1,
            price: "35000.00"
        },
        {
            orderId: 7,
            productId: 8,
            quantity: 2,
            price: "18000.00"
        },
        {
            orderId: 8,
            productId: 4,
            quantity: 1,
            price: "72000.00"
        }
    ]);

    // Insert returns
    await db.insert(returns).values([
        {
            returnNumber: "RET1001",
            orderId: 4,
            customerId: 4,
            reason: "Wrong size",
            status: "REQUESTED",
            requestedAt: new Date("2026-08-12"),
            approvedAt: null
        },
        {
            returnNumber: "RET1002",
            orderId: 5,
            customerId: 5,
            reason: "Changed my mind",
            status: "APPROVED",
            requestedAt: new Date("2026-08-08"),
            approvedAt: new Date("2026-08-09")
        },
        {
            returnNumber: "RET1003",
            orderId: 6,
            customerId: 6,
            reason: "Product damaged",
            status: "REJECTED",
            requestedAt: new Date("2026-08-05"),
            approvedAt: null
        }
    ]);

    // Insert refunds
    await db.insert(refunds).values([
        {
            refundNumber: "REF1001",
            returnId: 2,
            orderId: 5,
            amount: "15000.00",
            status: "PROCESSING",
            processedAt: null
        },
        {
            refundNumber: "REF1002",
            returnId: 3,
            orderId: 6,
            amount: "35000.00",
            status: "FAILED",
            processedAt: null
        }
    ]);

    // Insert support queries
    await db.insert(supportQueries).values([
        {
            question: "Where is my order OR1002?",
            category: "ORDER_TRACKING",
            resolved: true,
            resolutionType: "AUTOMATED"
        },
        {
            question: "Has my order OR1003 been shipped?",
            category: "ORDER_TRACKING",
            resolved: true,
            resolutionType: "AUTOMATED"
        },
        {
            question: "Where is my order OR1001?",
            category: "ORDER_TRACKING",
            resolved: true,
            resolutionType: "AUTOMATED"
        },
        {
            question: "I want to return order OR1004",
            category: "RETURNS_REFUNDS",
            resolved: true,
            resolutionType: "AUTOMATED"
        },
        {
            question: "When will I get my refund for OR1005?",
            category: "RETURNS_REFUNDS",
            resolved: true,
            resolutionType: "AUTOMATED"
        },
        {
            question: "I want a refund for an order delivered 45 days ago",
            category: "RETURNS_REFUNDS",
            resolved: false,
            resolutionType: "ESCALATED"
        }
    ]);

    // Insert support tickets
    await db.insert(supportTickets).values([
        {
            ticketNumber: "TKT1001",
            category: "RETURNS_REFUNDS",
            subject: "Return request outside return window",
            description: "Customer requested a return for an order delivered more than 30 days ago.",
            status: "OPEN"
        },
        {
            ticketNumber: "TKT1002",
            category: "RETURNS_REFUNDS",
            subject: "Refund processing issue",
            description: "Customer refund failed and requires manual support intervention.",
            status: "IN_PROGRESS"
        }
    ]);

    console.log("Northstar database seeding completed successfully.");

    process.exit(0);
}

seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});