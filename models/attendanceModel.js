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
      ref: "Subject",
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

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
