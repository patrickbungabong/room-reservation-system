import { asyncHandler } from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

export const getById = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json({ success: true, user });
});

export const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const result = await userService.getAll(page, limit);
  res.json({ success: true, ...result });
});

export const update = asyncHandler(async (req, res) => {
  const user = await userService.updateById(req.params.id, req.body);
  res.json({ success: true, user });
});

export const remove = asyncHandler(async (req, res) => {
  await userService.deleteById(req.params.id);
  res.status(200).json({ success: true, message: 'User deleted' });
});
