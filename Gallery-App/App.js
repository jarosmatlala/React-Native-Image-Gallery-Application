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
  const [showAllImages, setShowAllImages] = useState(false); 
  

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

  const handleImageCapture = async (imageData) => {
      const {uri,location} = imageData;
      console.log('Captured Image Data:',uri, location);


      try {
      const savedPath = await saveImageToFileSystem(uri);
      const newImage = { uri: savedPath, location };
      console.log('New Image Saved:', newImage); 


      setSavedImages((prevImages) => {
        const updatedImages = [...prevImages, newImage];
        console.log('Updated Saved Images:', updatedImages); 
        return updatedImages;
      });

      setImageUri(savedPath);
      setFilePath(savedPath);
      setLocation(location);
    } catch (error) {
      console.error('Failed to save image:', error);
    }
  };

  const toggleImageVisibility = () => {
    setShowAllImages((prevState) => !prevState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Image Picker</Text>
      <CameraPicker onImageCapture={handleImageCapture} />
      <SavedImageDisplay imageUri={imageUri} filePath={filePath} />
      {location ?(
        <MapsLibrary location={location} /> 

      ) : (
         <Text>No location data available.</Text> 
         )}

      <Button
        title={showAllImages ? "Hide All Images" : "View All Images with Locations"}
        onPress={toggleImageVisibility} 
      />
      {showAllImages && savedImages.length > 0 ? (
        <ImageList images={savedImages} />
      ) : (
        savedImages.length === 0 && <Text>No images available.</Text>
      )}

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