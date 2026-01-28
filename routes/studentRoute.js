const express = require("express");
const { getMyAttendance, updateAttendance } = require("../controllers/studentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/attendance", protect, getMyAttendance);
router.patch("/attendance/:attendanceId", updateAttendance);


module.exports = router;
