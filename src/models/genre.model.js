import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;

const genreSchema = new Schema({
  name: { type: String, trim: true, required: true },
});

const Genre = mongoose.model("Genre", genreSchema, "genres");

export default Album;
