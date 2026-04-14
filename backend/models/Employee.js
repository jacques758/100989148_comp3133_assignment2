const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    designation: { type: String },
    salary: { type: Number },
    department: { type: String },
    profilePicture: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', EmployeeSchema);