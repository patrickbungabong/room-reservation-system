import User from '../models/User.js';

export async function createUser(data) {
  return User.create(data);
}

export async function findUserByEmail(email) {
  return User.findOne({ email }).select('+password');
}

export async function findUserById(id) {
  return User.findById(id);
}

export async function findAllUsers(skip = 0, limit = 50) {
  return User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
}

export async function updateUserById(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteUserById(id) {
  return User.findByIdAndDelete(id);
}

export async function countUsers() {
  return User.countDocuments();
}
