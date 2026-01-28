const express = require("express");
const {
  signup,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "backend working !!!",
  });
});
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/me", getMe);

module.exports = router;
