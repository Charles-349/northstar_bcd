import { Router, Request, Response } from 'express';

const router = Router();

export interface SupportQueryLog {
  id: number;
  category: 'Order Status' | 'Returns & Refunds' | 'Stock Availability' | string;
  status: 'resolved' | 'escalated';
  timestamp: Date;
}

// Pre-seeded query data
export const queryLogs: SupportQueryLog[] = [
  { id: 1, category: 'Order Status', status: 'resolved', timestamp: new Date() },
  { id: 2, category: 'Returns & Refunds', status: 'resolved', timestamp: new Date() },
  { id: 3, category: 'Returns & Refunds', status: 'escalated', timestamp: new Date() },
  { id: 4, category: 'Order Status', status: 'resolved', timestamp: new Date() }
];

// =========================================================================
// TICKET NS-11: Add support query logging
// Endpoint: POST /api/support/log
// =========================================================================
router.post('/api/support/log', (req: Request, res: Response) => {
  const { category, status } = req.body;

  if (!category || !status) {
    return res.status(400).json({ error: 'Missing required fields: category and status' });
  }

  if (status !== 'resolved' && status !== 'escalated') {
    return res.status(400).json({ 
      error: "Invalid status value. Must be either 'resolved' or 'escalated'." 
    });
  }

  const newLog: SupportQueryLog = {
    id: queryLogs.length + 1,
    category,
    status,
    timestamp: new Date()
  };

  queryLogs.push(newLog);
  return res.status(201).json({ message: 'Query logged successfully', log: newLog });
});

// =========================================================================
// TICKET NS-13: Build analytics calculation endpoint
// Endpoint: GET /api/analytics
// =========================================================================
router.get('/api/analytics', (_req: Request, res: Response) => {
  const totalQueries = queryLogs.length;
  const automaticallySolved = queryLogs.filter(q => q.status === 'resolved').length;
  const escalated = queryLogs.filter(q => q.status === 'escalated').length;

  const deflectionRate = totalQueries > 0 
    ? Math.round((automaticallySolved / totalQueries) * 100) 
    : 0;

  const categoryBreakdown = {
    order_status: {
      total: queryLogs.filter(q => q.category === 'Order Status').length,
      solved: queryLogs.filter(q => q.category === 'Order Status' && q.status === 'resolved').length
    },
    returns_refunds: {
      total: queryLogs.filter(q => q.category === 'Returns & Refunds').length,
      solved: queryLogs.filter(q => q.category === 'Returns & Refunds' && q.status === 'resolved').length
    }
  };

  return res.json({
    total_queries: totalQueries,
    automatically_solved: automaticallySolved,
    escalated: escalated,
    deflection_rate: `${deflectionRate}%`,
    breakdown: categoryBreakdown
  });
});

export default router;
