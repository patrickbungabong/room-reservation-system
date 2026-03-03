import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Reservation from '../models/Reservation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/room-reservation';

const seedUsers = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { name: 'Student One', email: 'student1@example.com', password: 'student123', role: 'student' },
  { name: 'Student Two', email: 'student2@example.com', password: 'student123', role: 'student' },
];

const seedRooms = [
  { name: 'Room A', capacity: 10, location: 'Building 1, Floor 2', description: 'Meeting room with projector', isActive: true },
  { name: 'Room B', capacity: 20, location: 'Building 1, Floor 2', description: 'Large conference room', isActive: true },
  { name: 'Room C', capacity: 6, location: 'Building 2, Floor 1', description: 'Small study room', isActive: true },
  { name: 'Room D', capacity: 30, location: 'Building 2, Floor 3', description: 'Lecture hall', isActive: false },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});
  await Room.deleteMany({});
  await Reservation.deleteMany({});

  const users = await User.insertMany(seedUsers);
  const rooms = await Room.insertMany(seedRooms);

  const admin = users.find((u) => u.role === 'admin');
  const student1 = users.find((u) => u.email === 'student1@example.com');
  const student2 = users.find((u) => u.email === 'student2@example.com');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const reservations = [
    { student: student1._id, room: rooms[0]._id, date: tomorrow, startTime: '09:00', endTime: '10:00', purpose: 'Study group', status: 'pending' },
    { student: student1._id, room: rooms[1]._id, date: tomorrow, startTime: '14:00', endTime: '15:00', purpose: 'Project meeting', status: 'approved' },
    { student: student2._id, room: rooms[2]._id, date: tomorrow, startTime: '11:00', endTime: '12:00', purpose: 'Interview prep', status: 'rejected', adminComment: 'Room under maintenance' },
  ];

  await Reservation.insertMany(reservations);

  console.log('Seed completed:');
  console.log('- Users:', users.length);
  console.log('- Rooms:', rooms.length);
  console.log('- Reservations:', reservations.length);
  console.log('\nAdmin: admin@example.com / admin123');
  console.log('Student: student1@example.com / student123');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
