import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "images.db";
const database_version = "1.0";
const database_displayname = "SQLite Database";
const database_size = 200000;

let db;

export const initializeDatabase = async () => {
  try {
    db = await SQLite.openDatabase(
        { name: database_name, location: 'default' }
    );
    console.log('Database opened successfully');

    if (!db) { 
        throw new Error("Database object is null or undefined");
     }

    await db.executeSql(
      'CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY NOT NULL, uri TEXT, location TEXT, timestamp TEXT);'
    );
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error opening database or creating table:', error);
  }
};

export const addImage = async (uri, location, timestamp) => {
  try {
    if (!db) { 
        throw new Error("Database not initialized"); 
    }
    await db.executeSql(
      'INSERT INTO images (uri, location, timestamp) VALUES (?, ?, ?);',
      [uri, JSON.stringify(location), timestamp]
    );
    console.log('Image added successfully');
  } catch (error) {
    console.error('Error adding image:', error);
  }
};

export const getImages = async (callback) => {
  try {
    if (!db) { 
        throw new Error("Database not initialized"); 
    }
    const [results] = await db.executeSql('SELECT * FROM images;');
    callback(results.rows.raw());
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

export const updateImage = async (id, uri, location, timestamp) => {
  try {
    if (!db) { 
        throw new Error("Database not initialized"); 
    }
    await db.executeSql(
      'UPDATE images SET uri = ?, location = ?, timestamp = ? WHERE id = ?;',
      [uri, JSON.stringify(location), timestamp, id]
    );
    console.log('Image updated successfully');
  } catch (error) {
    console.error('Error updating image:', error);
  }
};

export const deleteImage = async (id) => {
  try {
    if (!db) { 
        throw new Error("Database not initialized");
     }
    await db.executeSql(
      'DELETE FROM images WHERE id = ?;',
      [id]
    );
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
