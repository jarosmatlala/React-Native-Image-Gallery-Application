import * as FileSystem from 'expo-file-system';

export const saveImageToFileSystem = async (uri) => {
  const fileName = uri.split('/').pop();
  const destination = `${FileSystem.documentDirectory}${fileName}`;
  try {
    await FileSystem.moveAsync({
      from: uri,
      to: destination,
    });
    return destination;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};
