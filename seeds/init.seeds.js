import usersData from "../seeds/data/users.data.js";
import genresData from "../seeds/data/genres.data.js";
import songsData from "../seeds/data/songs.data.js";
import albumsData from "../seeds/data/albums.data.js";

import User from "../src/models/user.model.js";
import Genre from "../src/models/genre.model.js";
import Song from "../src/models/song.model.js";
import Album from "../src/models/album.model.js";

import bcrypt from "bcrypt";
import { connectToDb, disconnectFromDb } from "../config/database.config.js";

/* Delete full data  */
const wipeDatabase = async () => {
  await User.deleteMany();
  await Genre.deleteMany();
  await Song.deleteMany();
  await Album.deleteMany();
};
/* Return genres id to link them*/
const insertGenres = async () => {
  const genres = await Genre.insertMany(genresData);
  return new Map(genres.map((genre) => [genre.name, genre._id]));
};
/* Return songs id to link them*/
const insertSongs = async (genres) => {
  songsData.forEach((song) => {
    song.genre = genres.get(song.genreName);
    delete song.genreName;
  });
  const songs = await Song.insertMany(songsData);
  return new Map(songs.map((song) => [song.title, song._id]));
};
/* Return albums id to link them*/
const insertAlbums = async (genres, songs) => {
  albumsData.forEach((album) => {
    album.genre = genres.get(album.genreName);
    album.tracklist = album.tracks.map((track) => songs.get(track));
    delete album.genreName;
    delete album.tracks;
  });
  const albums = await Album.insertMany(albumsData);
  return new Map(albums.map((album) => [album.title, album._id]));
};

const insertUsers = async (songs, albums) => {
  usersData.forEach((user) => {
    user.password = bcrypt.hashSync(user.password, 10);
    user.favouriteAlbums = user.albumsName.map((album) => albums.get(album));
    user.favouriteSongs = user.songsName.map((song) => songs.get(song));
    delete user.albumsName;
    delete user.songsName;
  });
  await User.insertMany(usersData);
};
/* MAIN FUNCTION */
const runScript = async () => {
  try {
    await connectToDb();

    await wipeDatabase();

    const genres = await insertGenres();
    const songs = await insertSongs(genres);
    const albums = await insertAlbums(genres, songs);

    await insertUsers(songs, albums);
    console.log("✅ Script loaded in database");
  } catch (error) {
    console.error(`❌ Something happened loading script -> ${error}`);
  } finally {
    await disconnectFromDb();
  }
};

runScript();
