import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button,Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import CameraPicker from './components/CameraPicker';
import SavedImageDisplay from './components/SavedImageDisplay';
import MapsLibrary from './components/MapsLibrary';
import ImageList from './components/ImageList';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageGallery from './components/ImageGallery'; 


export default function App() {

  const [imageUri, setImageUri] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [location, setLocation] = useState(null);
  const [savedImages, setSavedImages] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);


  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('Location permission status:', status); 
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return false;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Background location permission was denied');
      return false;
    }

    return true;
  };


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

    try {
      const hasLocationPermission = await requestLocationPermission();
      if (!hasLocationPermission) return;

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });

      if (!currentLocation || !currentLocation.coords) {
        Alert.alert('Error', 'Unable to fetch location');
        return;
      }

      console.log('Captured Location:', currentLocation.coords);
      const timestamp = new Date().toISOString();
      const { uri } = imageData;
      const savedPath = await saveImageToFileSystem(uri);

      const newImage = {
        uri: savedPath,
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        timestamp,
      };

      console.log('New Image Saved:', newImage);

      setSavedImages((prevImages) => {
        const updatedImages = [...prevImages, newImage];
        console.log('Updated Saved Images:', updatedImages);
        return updatedImages;
      });

      setImageUri(savedPath);
      setFilePath(savedPath);
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error('Failed to save image:', error);
      Alert.alert('Error', error.message);
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
      
      {location ? (
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
    marginBottom:40
  },
  title: {
    marginTop:150,
    fontSize: 18,
    fontWeight: 'bold',
  },
});