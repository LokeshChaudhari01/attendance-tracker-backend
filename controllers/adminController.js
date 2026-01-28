const User = require("../models/userModel");
const Attendance = require("../models/attendanceModel");

// GET /api/v1/admin/students
exports.getAllStudents = async (req, res) => {
  const students = await User.find().select("rollNumber year branch role");
  res.json({ status: "success", students });
};

// GET /api/v1/admin/students/:id/attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const records = await Attendance.find({ student: id }).populate(
      "subject",
      "name",
    );

    const formatted = records.map((r) => ({
      subject: r.subject.name,
      attended: r.attendedLecs,
      total: r.totalLecs,
      percentage:
        r.totalLecs === 0
          ? 0
          : Number(((r.attendedLecs / r.totalLecs) * 100).toFixed(2)),
    }));

    res.json({ status: "success", attendance: formatted });
  } catch {
    res.status(400).json({ message: "Invalid student id" });
  }
};

// PATCH /api/v1/admin/attendance/:attendanceId
exports.updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { attendedLecs, totalLecs } = req.body;

    const updated = await Attendance.findByIdAndUpdate(
      attendanceId,
      { attendedLecs, totalLecs },
      { new: true },
    ).populate("subject", "name");

    if (!updated) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json({
      status: "success",
      updated: {
        subject: updated.subject.name,
        attended: updated.attendedLecs,
        total: updated.totalLecs,
      },
    });
  } catch {
    res.status(400).json({ message: "Invalid request" });
  }
};
