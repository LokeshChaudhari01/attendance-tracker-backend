const express = require("express");
const isAdmin = require("../middlewares/isAdmin");

const {
  getAllStudents,
  getStudentAttendance,
  updateAttendance,
} = require("../controllers/adminController");

const router = express.Router();

// protect all admin routes
router.use(isAdmin);

router.get("/students", getAllStudents);
router.get("/students/:id/attendance", getStudentAttendance);
router.patch("/attendance/:attendanceId", updateAttendance);

module.exports = router;
        