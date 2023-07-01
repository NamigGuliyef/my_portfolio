import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  project_name: { type: String },
  message: { type: String },
}, { versionKey: false, timestamps: true })

export const userModel = model('guest', userSchema)
