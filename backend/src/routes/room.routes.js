import { body, param } from 'express-validator';
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { create, getById, getAll, update, remove } from '../controllers/room.controller.js';

const router = Router();

router.get('/', authenticateToken, getAll);

router.get('/:id', authenticateToken, getById);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').optional().trim(),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  ],
  validate,
  create
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    body('description').optional().trim(),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  ],
  validate,
  update
);

router.delete('/:id', authenticateToken, authorizeRoles('admin'), remove);

export default router;
