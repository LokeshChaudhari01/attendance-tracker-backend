const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // don't send password by default
    },

    year: {
      type: Number,
      required: true,
    },

    branch: {
      type: String,
      enum: ["csh", "csa", "csd", "ece", "eci", "cse"],
      required: true,
    },

    rollInBranch: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

// Hash password before save
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

// compare passwords while login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
