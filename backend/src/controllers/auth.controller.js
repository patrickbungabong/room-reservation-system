import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await authService.register({ name, email, password, role });
  res.status(201).json({ success: true, ...result });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({ success: true, ...result });
});
