import * as userRepository from '../repositories/user.repository.js';

export async function getById(id) {
  const user = await userRepository.findUserById(id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

export async function getAll(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    userRepository.findAllUsers(skip, limit),
    userRepository.countUsers(),
  ]);
  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function updateById(id, data) {
  const user = await userRepository.findUserById(id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const { password, ...rest } = data;
  const updateData = { ...rest };
  if (password && password.length >= 6) updateData.password = password;
  return userRepository.updateUserById(id, updateData);
}

export async function deleteById(id) {
  const user = await userRepository.findUserById(id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  await userRepository.deleteUserById(id);
  return { deleted: true };
}
