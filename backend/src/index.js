import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import assetAssignmentRoutes from './routes/assetAssignmentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(compression());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/assets', authenticateToken, assetRoutes);
app.use('/api/asset-assignments', authenticateToken, assetAssignmentRoutes);
app.use('/api/employees', authenticateToken, employeeRoutes);
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
