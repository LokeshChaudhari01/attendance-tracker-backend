// utils/parseRoll.js
module.exports = function parseRoll(roll) {
  roll = roll.toLowerCase();

  // bt24cse234
  if (!/^bt\d{2}[a-z]{3}\d{3}$/.test(roll)) {
    throw new Error("Invalid roll number format");
  }

  const year = Number(roll.slice(2, 4)); // 24
  const branch = roll.slice(4, 7); // cse
  const rollInBranch = Number(roll.slice(7)); // 234

  const allowedBranches = ["cse", "csa", "csd", "csh", "ece", "eci"];
  if (!allowedBranches.includes(branch)) {
    throw new Error("Invalid branch");
  }

  return { year, branch, rollInBranch };
};
