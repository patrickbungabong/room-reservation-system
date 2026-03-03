import { body, query } from 'express-validator';
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { getById, getAll, update, remove } from '../controllers/user.controller.js';

const router = Router();

router.use(authenticateToken);

router.get(
  '/',
  authorizeRoles('admin'),
  [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 100 })],
  validate,
  getAll
);

router.get('/:id', getById);

router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['student', 'admin']).withMessage('Invalid role'),
  ],
  validate,
  update
);

router.delete('/:id', authorizeRoles('admin'), remove);

export default router;
