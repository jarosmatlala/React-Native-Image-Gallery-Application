import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import CameraPicker from './components/CameraPicker';
import SavedImageDisplay from './components/SavedImageDisplay';
import MapsLibrary from './components/MapsLibrary';
import ImageList from './components/ImageList';
export default function App() {

  const [imageUri, setImageUri] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [location, setLocation] = useState(null);
  const [savedImages, setSavedImages] = useState([]);


  const saveImageToFileSystem = async (imageUri) => {
    try {
      const fileName = imageUri.split('/').pop();
      const savedPath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: imageUri,
        to: savedPath,
      });

      console.log('Image saved to:', savedPath);
      return savedPath;
    } catch (error) {
      console.error('Failed to save image:', error);
      throw error;
    }
  };


  const handleImageCapture = async (uri) => {
    try {
      const savedPath = await saveImageToFileSystem(uri);
      const newImage = { uri: savedPath, location };
      setSavedImages([...savedImages, newImage]);
      setImageUri(savedPath);
      setFilePath(savedPath);
      setLocation(Location);
    } catch (error) {
      console.error('Failed to save image:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Image Picker</Text>
      <CameraPicker onImageCapture={handleImageCapture} />
      <SavedImageDisplay imageUri={imageUri} filePath={filePath} />
      {location && <MapsLibrary location={location} />}
      <Button title="View All Images with Locations" onPress={() => setImageUri('')}

      /> <ImageList images={savedImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});