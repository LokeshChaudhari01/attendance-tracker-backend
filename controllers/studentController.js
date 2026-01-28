const Attendance = require("../models/attendanceModel");

exports.getMyAttendance = async (req, res) => {
  try {
    const user = req.user;

    const records = await Attendance.find({ student: user._id });

    let formatted = records.map((r) => ({
      id: r._id,
      subject: r.subject,
      attended: r.attendedLecs,
      total: r.totalLecs,
      percentage:
        r.totalLecs === 0
          ? 0
          : Number(((r.attendedLecs / r.totalLecs) * 100).toFixed(2)),
    }));

    // for future calculations
    // for future calculations
    formatted = formatted.map((el) => {
      let moreToAttend = 0;
      let canBunk = 0;

      if (el.total !== 0) {
        // If attendance is below 75%
        if (el.percentage < 75) {
          let tempAttendance = el.percentage;
          let i = el.attended;
          let j = el.total;
          let ct = 0;

          while (tempAttendance < 75) {
            i++;
            j++;
            tempAttendance = Number(((i / j) * 100).toFixed(2));
            ct++;
          }

          moreToAttend = ct;
        }

        // If attendance is 75% or above
        else {
          let tempAttendance = el.percentage;
          let i = el.attended;
          let j = el.total;
          let ct = 0;

          while (tempAttendance >= 75) {
            j++;
            tempAttendance = Number(((i / j) * 100).toFixed(2));
            ct++;
          }

          canBunk = ct - 1; // because last step breaks condition
        }
      }

      return { ...el, canBunk, moreToAttend };
    });

    res.json({
      status: "success",
      rollNumber: user.rollNumber,
      attendance: formatted,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { deltaTotal, deltaAttended } = req.body;
    const user = req.user;

    // Must belong to this logged in student
    const record = await Attendance.findOne({
      _id: attendanceId,
      student: user._id,
    });

    if (!record) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    record.attendedLecs += deltaAttended;
    record.totalLecs += deltaTotal;

    if (record.totalLecs < 0) record.totalLecs = 0;
    if (record.attendedLecs < 0) record.attendedLecs = 0;

    if (record.attendedLecs >= record.totalLecs) {
      record.attendedLecs = record.totalLecs;
    }

    await record.save();

    res.json({
      status: "success",
      updated: {
        id: record._id,
        subject: record.subject,
        attended: record.attendedLecs,
        total: record.totalLecs,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
