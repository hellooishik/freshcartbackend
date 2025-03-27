const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"],
    },
    name: {
      type: String,
      trim: true,
      default: null, // ✅ Name is now optional
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /\S+@\S+\.\S+/.test(v); // ✅ Validates only if email exists
        },
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving if present
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// ✅ Compare passwords
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// ✅ Clear OTP after Verification
UserSchema.methods.clearOTP = async function () {
  this.otp = null;
  this.otpExpiry = null;
  await this.save();
};

module.exports = mongoose.model("User", UserSchema);
