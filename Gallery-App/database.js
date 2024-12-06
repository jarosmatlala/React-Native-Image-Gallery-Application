import SQLite from 'react-native-sqlite-storage';
import { Alert } from 'react-native';  // Ensure Alert is imported

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "images.db";
const database_version = "1.0";
const database_displayname = "SQLite Database";
const database_size = 200000;

let db;

export const initializeDatabase = async () => {
  try {
    console.log('Attempting to open database...');
    db = await SQLite.openDatabase(
      { name: database_name, location: 'default' }
    );
    console.log('Database opened:', db);

    if (!db) {
      console.error("Database object is null or undefined");
      throw new Error("Database object is null or undefined");
    }

    console.log('Creating table if not exists...');
    const result = await db.executeSql(
      'CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY NOT NULL, uri TEXT, location TEXT, timestamp TEXT);'
    );
    console.log('Table created successfully, Result:', result);
  } catch (error) {
    console.error('Error opening database or creating table:', error);
    Alert.alert('Database Error', `Error opening database or creating table: ${error.message}`);
  }
};

export const addImage = async (uri, location, timestamp) => {
  try {
    if (!db) {
      console.error("Database not initialized");
      throw new Error("Database not initialized");
    }
    console.log('Adding image to database...');
    const result = await db.executeSql(
      'INSERT INTO images (uri, location, timestamp) VALUES (?, ?, ?);',
      [uri, JSON.stringify(location), timestamp]
    );
    console.log('Image added successfully, Result:', result);
  } catch (error) {
    console.error('Error adding image:', error);
    Alert.alert('Database Error', `Error adding image: ${error.message}`);
  }
};

export const getImages = async (callback) => {
  try {
    if (!db) {
      console.error("Database not initialized");
      throw new Error("Database not initialized");
    }
    console.log('Fetching images from database...');
    const [results] = await db.executeSql('SELECT * FROM images;');
    console.log('Images fetched successfully, Result:', results);
    callback(results.rows.raw());
  } catch (error) {
    console.error('Error fetching images:', error);
    Alert.alert('Database Error', `Error fetching images: ${error.message}`);
  }
};

export const updateImage = async (id, uri, location, timestamp) => {
  try {
    if (!db) {
      console.error("Database not initialized");
      throw new Error("Database not initialized");
    }
    console.log('Updating image in database...');
    const result = await db.executeSql(
      'UPDATE images SET uri = ?, location = ?, timestamp = ? WHERE id = ?;',
      [uri, JSON.stringify(location), timestamp, id]
    );
    console.log('Image updated successfully, Result:', result);
  } catch (error) {
    console.error('Error updating image:', error);
    Alert.alert('Database Error', `Error updating image: ${error.message}`);
  }
};

export const deleteImage = async (id) => {
  try {
    if (!db) {
      console.error("Database not initialized");
      throw new Error("Database not initialized");
    }
    console.log('Deleting image from database...');
    const result = await db.executeSql(
      'DELETE FROM images WHERE id = ?;',
      [id]
    );
    console.log('Image deleted successfully, Result:', result);
  } catch (error) {
    console.error('Error deleting image:', error);
    Alert.alert('Database Error', `Error deleting image: ${error.message}`);
  }
};
