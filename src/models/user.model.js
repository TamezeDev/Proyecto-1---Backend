import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    lastname: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
    },
    bornYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      trim: true,
      default: "user",
    },
    favouriteAlbums: [{ type: mongoose.Types.ObjectId, ref: "Album" }],
    favouriteSongs: [{ type: mongoose.Types.ObjectId, ref: "Song" }],
    imgUrl: { type: String, trim: true },
    imgId: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next;
});

const User = mongoose.model("User", userSchema, "users");

export default User;
