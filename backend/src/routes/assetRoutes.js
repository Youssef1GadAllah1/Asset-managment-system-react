import express from 'express';
import {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetsByUser
} from '../controllers/assetController.js';

const router = express.Router();

router.get('/', getAllAssets);
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);
router.get('/user/:userId', getAssetsByUser);

export default router;
