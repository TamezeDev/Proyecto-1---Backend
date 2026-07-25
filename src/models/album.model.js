import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;

const albumSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    rating: { type: Number, required: true },
    genre: { type: mongoose.Types.ObjectId, ref: "Genre" },
    tracklist: [{ type: mongoose.Types.ObjectId, ref: "Song" }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Album = mongoose.model("Album", albumSchema, "albums");

export default Album;
