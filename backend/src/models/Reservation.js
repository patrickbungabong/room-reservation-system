import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    purpose: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    adminComment: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

reservationSchema.index({ room: 1, date: 1, status: 1 });
reservationSchema.index({ student: 1 });

export default mongoose.model('Reservation', reservationSchema);
