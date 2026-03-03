import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model('Room', roomSchema);
