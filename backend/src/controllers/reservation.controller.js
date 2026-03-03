import { asyncHandler } from '../utils/asyncHandler.js';
import * as reservationService from '../services/reservation.service.js';

export const create = asyncHandler(async (req, res) => {
  const reservation = await reservationService.create(req.user._id, req.body);
  res.status(201).json({ success: true, reservation });
});

export const getById = asyncHandler(async (req, res) => {
  const reservation = await reservationService.getById(
    req.params.id,
    req.user._id.toString(),
    req.user.role === 'admin'
  );
  res.json({ success: true, reservation });
});

export const getMy = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const result = await reservationService.getMyReservations(req.user._id, page, limit);
  res.json({ success: true, ...result });
});

export const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const options = {
    status: req.query.status,
    roomId: req.query.roomId,
    fromDate: req.query.fromDate,
    toDate: req.query.toDate,
  };
  const result = await reservationService.getAll(options, page, limit);
  res.json({ success: true, ...result });
});

export const approve = asyncHandler(async (req, res) => {
  const reservation = await reservationService.approve(req.params.id, req.body?.adminComment);
  res.json({ success: true, reservation });
});

export const reject = asyncHandler(async (req, res) => {
  const reservation = await reservationService.reject(req.params.id, req.body?.adminComment);
  res.json({ success: true, reservation });
});

export const cancel = asyncHandler(async (req, res) => {
  const reservation = await reservationService.cancel(
    req.params.id,
    req.user._id.toString(),
    req.user.role === 'admin'
  );
  res.json({ success: true, reservation });
});

export const remove = asyncHandler(async (req, res) => {
  await reservationService.deleteById(req.params.id, req.user.role === 'admin');
  res.status(200).json({ success: true, message: 'Reservation deleted' });
});
