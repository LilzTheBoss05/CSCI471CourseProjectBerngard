import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true }, // adding this to plan for future days
  duration: { type: String }, // keeping track of how long tasks take
  recurrence: {
    type: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
    days: [String], // for weekly: ['monday', 'tuesday'], for monthly: ['1', '15'] or ['first monday']
    interval: { type: Number, default: 1 }, // every N days/weeks/months
    endDate: String // optional end date
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // essential for ownership checks [cite: 63]
});

export default mongoose.model('Task', taskSchema);
