import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const INTERESTS = ["nature", "heritage", "beaches", "food", "adventure"];

const preferencesSchema = new mongoose.Schema(
  {
    defaultBudget: { type: Number, default: 30000, min: 1 },
    defaultTravelers: { type: Number, default: 2, min: 1, max: 20 },
    food: { type: String, enum: ["any", "vegetarian", "non-vegetarian"], default: "any" },
    stay: { type: String, enum: ["budget", "mid", "premium"], default: "mid" },
    interests: { type: [{ type: String, enum: INTERESTS }], default: ["nature", "food"] },
    avoidTolls: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    preferences: { type: preferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    preferences: this.preferences,
  };
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);