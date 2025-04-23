import express from 'express';
import {
  getCakes,
  getCakeById,
  createCake,
  updateCake,
  deleteCake,
  createCakeReview,
  getFeaturedCakes
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCakes).post(protect, admin, createCake);
router.route('/featured').get(getFeaturedCakes);
router.route('/:id/reviews').post(protect, createCakeReview);
router
  .route('/:id')
  .get(getCakeById)
  .put(protect, admin, updateCake)
  .delete(protect, admin, deleteCake);

export default router;