import { asyncHandler } from '../utils/asyncHandler.js';
import * as roomService from '../services/room.service.js';

export const create = asyncHandler(async (req, res) => {
  const room = await roomService.create(req.body);
  res.status(201).json({ success: true, room });
});

export const getById = asyncHandler(async (req, res) => {
  const room = await roomService.getById(req.params.id);
  res.json({ success: true, room });
});

export const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const filters = {
    capacityMin: req.query.capacityMin,
    capacityMax: req.query.capacityMax,
    isActive: req.query.isActive,
  };
  const result = await roomService.getAll(filters, page, limit);
  res.json({ success: true, ...result });
});

export const update = asyncHandler(async (req, res) => {
  const room = await roomService.updateById(req.params.id, req.body);
  res.json({ success: true, room });
});

export const remove = asyncHandler(async (req, res) => {
  await roomService.deleteById(req.params.id);
  res.status(200).json({ success: true, message: 'Room deleted' });
});
