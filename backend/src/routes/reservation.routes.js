import { body, param } from 'express-validator';
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import {
  create,
  getById,
  getMy,
  getAll,
  approve,
  reject,
  cancel,
  remove,
} from '../controllers/reservation.controller.js';

const router = Router();

router.use(authenticateToken);

router.post(
  '/',
  [
    body('room').isMongoId().withMessage('Valid room ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('startTime').matches(/^\d{1,2}:\d{2}$/).withMessage('startTime must be HH:MM'),
    body('endTime').matches(/^\d{1,2}:\d{2}$/).withMessage('endTime must be HH:MM'),
    body('purpose').trim().notEmpty().withMessage('Purpose is required'),
  ],
  validate,
  create
);

router.get('/my', getMy);

router.get('/', authorizeRoles('admin'), getAll);

router.get('/:id', getById);

router.put('/:id/approve', authorizeRoles('admin'), body('adminComment').optional().trim(), validate, approve);

router.put('/:id/reject', authorizeRoles('admin'), body('adminComment').optional().trim(), validate, reject);

router.put('/:id/cancel', cancel);

router.delete('/:id', authorizeRoles('admin'), remove);

export default router;
