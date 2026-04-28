import mongoose from 'mongoose';

const recurringTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String },
  recurrence: {
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    days: [String], // for weekly: ['monday', 'tuesday'], for monthly: ['1', '15']
    interval: { type: Number, default: 1 }, // every N days/weeks/months
    endDate: String // optional end date
  },
  startDate: { type: String, required: true }, // the first occurrence
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model('RecurringTask', recurringTaskSchema);
