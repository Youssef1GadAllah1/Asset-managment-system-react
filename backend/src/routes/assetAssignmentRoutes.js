import express from 'express';
import {
  getAssetAssignments,
  getAssetAssignmentsByUser,
  getAssetAssignmentsByAsset,
  assignAssets,
  updateAssignment,
  returnAsset,
  deleteAssignment
} from '../controllers/assetAssignmentController.js';

const router = express.Router();

router.get('/', getAssetAssignments);
router.get('/asset/:assetId', getAssetAssignmentsByAsset);
router.get('/user/:userId', getAssetAssignmentsByUser);
router.post('/', assignAssets);
router.put('/:id', updateAssignment);
router.put('/:id/return', returnAsset);
router.delete('/:id', deleteAssignment);

export default router;
