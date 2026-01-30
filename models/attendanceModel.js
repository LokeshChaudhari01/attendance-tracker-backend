const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    attendedLecs: {
      type: Number,
      default: 0,
    },
    totalLecs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ student: 1, _id: 1 });
attendanceSchema.index({ student: 1, subject: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
