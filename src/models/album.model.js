import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;

const albumSchema = new Schema({
  title: { type: String, trim: true, required: true },
  rating: { type: Number, trim: true, required: true },
  genre: { type: mongoose.Types.ObjectId, ref: "Genre" },
  tracKlist: { type: mongoose.Types.ObjectId, ref: "Song" },
});

const Album = mongoose.model("Album", albumSchema, "albums");

export default Album;
