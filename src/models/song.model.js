import mongoose from "mongoose";

const Schema = mongoose.Schema;

const songSchema = new Schema({
  title: { type: String, trim: true, required: true },
  artists: { type: String, trim: true, required: true },
  genre: { type: mongoose.Types.ObjectId, ref: "Genre" },
  rating: { type: Number, trim: true, required: true },
  durationSeconds: {
    type: Number,
    trim: true,
    min: 10,
    max: 1000,
  },
});

const Song = mongoose.model("Song", songSchema, "songs");

export default Song;
