import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import CameraPicker from "./components/CameraPicker";
import SavedImageDisplay from "./components/SavedImageDisplay";
import MapsLibrary from "./components/MapsLibrary";
import ImageList from "./components/ImageList";
import * as Location from "expo-location";
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


const HomeScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [location, setLocation] = useState(null);
  const [savedImages, setSavedImages] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log("Location permission status:", status);
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied"
      );
      return false;
    }

    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Background location permission was denied"
      );
      return false;
    }

    return true;
  };

  const saveImageToFileSystem = async (imageUri) => {
    try {
      const fileName = imageUri.split("/").pop();
      const savedPath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: imageUri,
        to: savedPath,
      });

      console.log("Image saved to:", savedPath);
      return savedPath;
    } catch (error) {
      console.error("Failed to save image:", error);
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
        Alert.alert("Error", "Unable to fetch location");
        return;
      }

      console.log("Captured Location:", currentLocation.coords);
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

      console.log("New Image Saved:", newImage);

      setSavedImages((prevImages) => {
        const updatedImages = [...prevImages, newImage];
        console.log("Updated Saved Images:", updatedImages);
        return updatedImages;
      });

      setImageUri(savedPath);
      setFilePath(savedPath);
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error("Failed to save image:", error);
      Alert.alert("Error", error.message);
    }
  };

  const toggleImageVisibility = () => {
    setShowAllImages((prevState) => !prevState);
  };

  const navigateToAllImages = () => {
    navigation.navigate("AllImages", { savedImages });
  };

  const navigateToNextScreen = () => { 
    navigation.navigate("AllImages", { savedImages });
     };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery Application</Text>
      <CameraPicker onImageCapture={handleImageCapture} />
      <SavedImageDisplay imageUri={imageUri} filePath={filePath} />

      <View style={styles.mapContainer}>
        {location ? (
          <MapsLibrary location={location} />
        ) : (
          <Text>No location data available.</Text>
        )}

       
          <Button
           title="Gallery"
            onPress={navigateToNextScreen} 
            color="#841584" />
      </View>
    </View>
  );
};

const AllImagesScreen = ({ route }) => { 
  const { savedImages } = route.params;

  return ( 
  <View style={styles.container}>
     <ImageList images={savedImages} /> 
     </View> ); 
     };

     const NextScreen = () => {
       return (
         <View style={styles.container}>
           <Text style={styles.title}>Hello</Text>
            </View> 
            ); 
          };

  export default function App(){
    return(
      <NavigationContainer>
        <Stack.Navigator intialRouteName="Home"> 
        <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="AllImages" component={AllImagesScreen} />
          <Stack.Screen name="NextScreen" component={ImageList} />
          </Stack.Navigator>
      </NavigationContainer>
    );
  }        

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  mapContainer: {
    width: "100%",
    height: 100,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 20,
    width: "80%",
  },
});
