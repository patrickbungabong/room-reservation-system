import * as reservationRepository from '../repositories/reservation.repository.js';
import * as roomRepository from '../repositories/room.repository.js';

function parseTime(t) {
  const [h, m] = (t || '').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

export async function create(studentId, data) {
  const room = await roomRepository.findRoomById(data.room);
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  if (!room.isActive) {
    const err = new Error('Cannot book inactive room');
    err.statusCode = 400;
    throw err;
  }
  const date = new Date(data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    const err = new Error('Cannot book past dates');
    err.statusCode = 400;
    throw err;
  }
  const startMin = parseTime(data.startTime);
  const endMin = parseTime(data.endTime);
  if (endMin <= startMin) {
    const err = new Error('endTime must be after startTime');
    err.statusCode = 400;
    throw err;
  }
  const existing = await reservationRepository.findApprovedByRoomAndDate(data.room, data.date);
  for (const r of existing) {
    if (overlaps(parseTime(r.startTime), parseTime(r.endTime), startMin, endMin)) {
      const err = new Error('Time slot conflicts with an approved reservation');
      err.statusCode = 409;
      throw err;
    }
  }
  const reservation = await reservationRepository.createReservation({
    student: studentId,
    room: data.room,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    purpose: data.purpose,
    status: 'pending',
  });
  return reservationRepository.findReservationById(reservation._id);
}

export async function getById(id, userId, isAdmin) {
  const reservation = await reservationRepository.findReservationById(id);
  if (!reservation) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (!isAdmin && reservation.student._id.toString() !== userId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  return reservation;
}

export async function getMyReservations(studentId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [reservations, total] = await Promise.all([
    reservationRepository.findReservationsByStudent(studentId, { skip, limit }),
    reservationRepository.countReservations({ student: studentId }),
  ]);
  return { reservations, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getAll(options = {}, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const opts = { ...options, skip, limit };
  const [reservations, total] = await Promise.all([
    reservationRepository.findAllReservations(opts),
    reservationRepository.countReservations(
      (() => {
        const f = {};
        if (options.status) f.status = options.status;
        if (options.roomId) f.room = options.roomId;
        if (options.fromDate) f.date = { ...f.date, $gte: new Date(options.fromDate) };
        if (options.toDate) f.date = { ...f.date, $lte: new Date(options.toDate) };
        return f;
      })()
    ),
  ]);
  return { reservations, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function approve(id, adminComment = '') {
  const reservation = await reservationRepository.findReservationById(id);
  if (!reservation) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (reservation.status !== 'pending') {
    const err = new Error('Only pending reservations can be approved');
    err.statusCode = 400;
    throw err;
  }
  const room = await roomRepository.findRoomById(reservation.room._id);
  if (!room?.isActive) {
    const err = new Error('Room is inactive');
    err.statusCode = 400;
    throw err;
  }
  const existing = await reservationRepository.findApprovedByRoomAndDate(
    reservation.room._id,
    reservation.date,
    id
  );
  const startMin = parseTime(reservation.startTime);
  const endMin = parseTime(reservation.endTime);
  for (const r of existing) {
    if (overlaps(parseTime(r.startTime), parseTime(r.endTime), startMin, endMin)) {
      const err = new Error('Time slot conflicts with an approved reservation');
      err.statusCode = 409;
      throw err;
    }
  }
  return reservationRepository.updateReservationById(id, {
    status: 'approved',
    adminComment: adminComment || reservation.adminComment,
  });
}

export async function reject(id, adminComment = '') {
  const reservation = await reservationRepository.findReservationById(id);
  if (!reservation) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (reservation.status !== 'pending') {
    const err = new Error('Only pending reservations can be rejected');
    err.statusCode = 400;
    throw err;
  }
  return reservationRepository.updateReservationById(id, {
    status: 'rejected',
    adminComment: adminComment || reservation.adminComment,
  });
}

export async function cancel(id, userId, isAdmin) {
  const reservation = await reservationRepository.findReservationById(id);
  if (!reservation) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (!isAdmin && reservation.student._id.toString() !== userId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  if (reservation.status === 'approved') {
    const err = new Error('Approved reservations cannot be cancelled this way');
    err.statusCode = 400;
    throw err;
  }
  if (reservation.status !== 'pending') {
    const err = new Error('Only pending reservations can be cancelled');
    err.statusCode = 400;
    throw err;
  }
  return reservationRepository.updateReservationById(id, { status: 'cancelled' });
}

export async function deleteById(id, isAdmin) {
  const reservation = await reservationRepository.findReservationById(id);
  if (!reservation) {
    const err = new Error('Reservation not found');
    err.statusCode = 404;
    throw err;
  }
  if (!isAdmin) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  await reservationRepository.deleteReservationById(id);
  return { deleted: true };
}
