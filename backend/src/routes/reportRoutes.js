import express from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  publishReport
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/', getAllReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);
router.put('/:id/publish', publishReport);

export default router;
