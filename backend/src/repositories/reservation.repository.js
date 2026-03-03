import Reservation from '../models/Reservation.js';

export async function createReservation(data) {
  return Reservation.create(data);
}

export async function findReservationById(id) {
  return Reservation.findById(id).populate('room').populate('student', 'name email');
}

export async function findReservationsByStudent(studentId, options = {}) {
  const { skip = 0, limit = 50 } = options;
  return Reservation.find({ student: studentId })
    .populate('room')
    .sort({ date: -1, startTime: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

export async function findAllReservations(options = {}) {
  const { skip = 0, limit = 50, status, roomId, fromDate, toDate } = options;
  const filter = {};
  if (status) filter.status = status;
  if (roomId) filter.room = roomId;
  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate);
    if (toDate) filter.date.$lte = new Date(toDate);
  }
  return Reservation.find(filter)
    .populate('room')
    .populate('student', 'name email')
    .sort({ date: -1, startTime: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

export async function findApprovedByRoomAndDate(roomId, date, excludeId = null) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const query = { room: roomId, date: { $gte: start, $lte: end }, status: 'approved' };
  if (excludeId) query._id = { $ne: excludeId };
  return Reservation.find(query).lean();
}

export async function updateReservationById(id, data) {
  return Reservation.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('room')
    .populate('student', 'name email');
}

export async function deleteReservationById(id) {
  return Reservation.findByIdAndDelete(id);
}

export async function countReservations(filter = {}) {
  return Reservation.countDocuments(filter);
}
