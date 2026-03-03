import Room from '../models/Room.js';

export async function createRoom(data) {
  return Room.create(data);
}

export async function findRoomById(id) {
  return Room.findById(id);
}

export async function findRooms(filter = {}, options = {}) {
  const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options;
  return Room.find(filter).sort(sort).skip(skip).limit(limit).lean();
}

export async function updateRoomById(id, data) {
  return Room.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteRoomById(id) {
  return Room.findByIdAndDelete(id);
}

export async function countRooms(filter = {}) {
  return Room.countDocuments(filter);
}
