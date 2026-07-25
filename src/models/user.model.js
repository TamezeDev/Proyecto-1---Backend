import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, trim: true, required: true },
  lastname: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true },
  password: { type: String, trim: true, required: true },
  bornYear: {
    type: Number,
    trim: true,
    min: 1900,
    max: new Date.getFullYear(),
  },
  favouriteAlbums: { type: mongoose.Types.ObjectId, ref: "Album" },
  favouriteSongs: { type: mongoose.Types.ObjectId, ref: "Songs" },
  imgUrl: { type: String, trim: true },
  imgId: { type: String, trim: true },
});

const User = mongoose.model("User", userSchema, "users");

export default User;
