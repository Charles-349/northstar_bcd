import express from 'express';
import cors from 'cors';
import order from './orders/orders.router';
import returnRoutes from './returns/returns.router';
import analyticsRouter from './analytics';
import supportRoutes from './support/support.router';
import analytics from './analytics/analytics.router';

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json());
app.use(express.static('public'));

// Routes
order(app);
app.use('/api', analyticsRouter);
returnRoutes(app);
supportRoutes(app);
analytics(app);



// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.listen(8081, () => {
    console.log('Server is running on http://localhost:8081');
})

export default app;
