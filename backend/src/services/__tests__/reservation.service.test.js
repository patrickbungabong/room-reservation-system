import { jest } from '@jest/globals';

const findRoomByIdMock = jest.fn();
const findApprovedByRoomAndDateMock = jest.fn();
const createReservationMock = jest.fn();
const findReservationByIdMock = jest.fn();

jest.unstable_mockModule('../../repositories/room.repository.js', () => ({
  findRoomById: findRoomByIdMock,
  createRoom: jest.fn(),
  findRooms: jest.fn(),
  updateRoomById: jest.fn(),
  deleteRoomById: jest.fn(),
  countRooms: jest.fn(),
}));

jest.unstable_mockModule('../../repositories/reservation.repository.js', () => ({
  createReservation: createReservationMock,
  findReservationById: findReservationByIdMock,
  findReservationsByStudent: jest.fn(),
  findAllReservations: jest.fn(),
  findApprovedByRoomAndDate: findApprovedByRoomAndDateMock,
  updateReservationById: jest.fn(),
  deleteReservationById: jest.fn(),
  countReservations: jest.fn(),
}));

const reservationService = await import('../reservation.service.js');

describe('Reservation Service', () => {
  const mockRoom = { _id: 'room1', name: 'Room A', isActive: true };
  const mockReservation = {
    _id: 'res1',
    room: { _id: 'room1' },
    date: new Date('2025-06-15'),
    startTime: '10:00',
    endTime: '11:00',
    status: 'pending',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should reject booking inactive room', async () => {
      findRoomByIdMock.mockResolvedValue({ ...mockRoom, isActive: false });
      await expect(
        reservationService.create('student1', {
          room: 'room1',
          date: '2025-06-15',
          startTime: '10:00',
          endTime: '11:00',
          purpose: 'Study',
        })
      ).rejects.toMatchObject({ message: 'Cannot book inactive room', statusCode: 400 });
      expect(createReservationMock).not.toHaveBeenCalled();
    });

    it('should reject past date', async () => {
      findRoomByIdMock.mockResolvedValue(mockRoom);
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      await expect(
        reservationService.create('student1', {
          room: 'room1',
          date: pastDate.toISOString(),
          startTime: '10:00',
          endTime: '11:00',
          purpose: 'Study',
        })
      ).rejects.toMatchObject({ message: 'Cannot book past dates', statusCode: 400 });
    });

    it('should reject when time conflicts with approved reservation', async () => {
      findRoomByIdMock.mockResolvedValue(mockRoom);
      findApprovedByRoomAndDateMock.mockResolvedValue([
        { startTime: '10:00', endTime: '11:00' },
      ]);
      createReservationMock.mockResolvedValue({ _id: 'new' });
      findReservationByIdMock.mockResolvedValue({});

      await expect(
        reservationService.create('student1', {
          room: 'room1',
          date: new Date(Date.now() + 86400000).toISOString(),
          startTime: '10:30',
          endTime: '11:30',
          purpose: 'Study',
        })
      ).rejects.toMatchObject({ message: 'Time slot conflicts with an approved reservation', statusCode: 409 });
    });

    it('should create when no conflict', async () => {
      findRoomByIdMock.mockResolvedValue(mockRoom);
      findApprovedByRoomAndDateMock.mockResolvedValue([]);
      const created = { _id: 'new', room: mockRoom, student: {} };
      createReservationMock.mockResolvedValue(created);
      findReservationByIdMock.mockResolvedValue(created);

      const future = new Date();
      future.setDate(future.getDate() + 1);
      const result = await reservationService.create('student1', {
        room: 'room1',
        date: future.toISOString(),
        startTime: '14:00',
        endTime: '15:00',
        purpose: 'Meeting',
      });
      expect(createReservationMock).toHaveBeenCalledWith(
        expect.objectContaining({
          student: 'student1',
          room: 'room1',
          startTime: '14:00',
          endTime: '15:00',
          purpose: 'Meeting',
          status: 'pending',
        })
      );
      expect(result).toEqual(created);
    });
  });

  describe('approve', () => {
    it('should reject when reservation is not pending', async () => {
      findReservationByIdMock.mockResolvedValue({
        ...mockReservation,
        status: 'approved',
      });
      await expect(reservationService.approve('res1')).rejects.toMatchObject({
        message: 'Only pending reservations can be approved',
        statusCode: 400,
      });
    });
  });

  describe('cancel', () => {
    it('should reject when student tries to cancel approved', async () => {
      findReservationByIdMock.mockResolvedValue({
        ...mockReservation,
        status: 'approved',
        student: { _id: 'student1' },
      });
      await expect(
        reservationService.cancel('res1', 'student1', false)
      ).rejects.toMatchObject({
        message: 'Approved reservations cannot be cancelled this way',
        statusCode: 400,
      });
    });
  });
});
