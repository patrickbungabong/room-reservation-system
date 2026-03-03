import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export async function register({ name, email, password, role = 'student' }) {
  const existing = await userRepository.findUserByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }
  const user = await userRepository.createUser({ name, email, password, role });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
}

export async function login(email, password) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
  const match = await user.comparePassword(password);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
}
