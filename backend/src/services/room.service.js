import * as roomRepository from '../repositories/room.repository.js';

export async function create(data) {
  return roomRepository.createRoom(data);
}

export async function getById(id) {
  const room = await roomRepository.findRoomById(id);
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  return room;
}

export async function getAll(filters = {}, page = 1, limit = 20) {
  const filter = {};
  if (filters.capacityMin != null) filter.capacity = { ...filter.capacity, $gte: Number(filters.capacityMin) };
  if (filters.capacityMax != null) filter.capacity = { ...filter.capacity, $lte: Number(filters.capacityMax) };
  if (filters.isActive !== undefined) filter.isActive = filters.isActive === 'true' || filters.isActive === true;
  const skip = (page - 1) * limit;
  const [rooms, total] = await Promise.all([
    roomRepository.findRooms(filter, { skip, limit }),
    roomRepository.countRooms(filter),
  ]);
  return { rooms, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function updateById(id, data) {
  const room = await roomRepository.findRoomById(id);
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  return roomRepository.updateRoomById(id, data);
}

export async function deleteById(id) {
  const room = await roomRepository.findRoomById(id);
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  await roomRepository.deleteRoomById(id);
  return { deleted: true };
}
