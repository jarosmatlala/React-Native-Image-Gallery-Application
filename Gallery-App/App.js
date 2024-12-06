import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert,TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { initializeDatabase, getImages, addImage } from './database';
import { requestPermissions } from './utils/locationPermissions';  
import CameraPicker from "./components/CameraPicker";
import SavedImageDisplay from "./components/SavedImageDisplay";
import MapsLibrary from "./components/MapsLibrary";
import ImageList from "./components/ImageList";
import Icon from 'react-native-vector-icons/MaterialIcons';


const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [location, setLocation] = useState(null);
  const [savedImages, setSavedImages] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('Initializing database...');
        await initializeDatabase();
        console.log('Fetching saved images...');
        fetchSavedImages();
      } catch (error) {
        console.error('Error in database setup:', error);
        Alert.alert('Database Setup Error', `Error in database setup: ${error.message}`);
      }
    };
    setupDatabase();
  }, []);

  const fetchSavedImages = async () => { 
    try {
      if (!db) { 
        console.error('Database not initialized');
         Alert.alert('Database Error', 'Database not initialized'); 
         return;
         }

      await getImages(images => {
        setSavedImages(images);
      });
      console.log('Images fetched successfully');
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Fetch Images Error', `Error fetching images: ${error.message}`);
    }
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
      const hasLocationPermission = await requestPermissions();
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

      setSavedImages((prevImages) => [...prevImages, newImage]);

      await addImage(savedPath, newImage.location, timestamp);
      
      setImageUri(savedPath);
      setFilePath(savedPath);
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error("Failed to save image:", error);
      Alert.alert("Error", error.message);
    }
  };

  const navigateToNextScreen = () => { 
    navigation.navigate("AllImages", { savedImages });
  };

  return (
    <View style={styles.container}>
       <Text style={styles.title}>Gallery Application</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToNextScreen}> 
          <Icon name="photo-library" size={24} color="#fff" />
           <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
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
            color="#841584" 
        />
      </View>
    </View>
  );
};

const AllImagesScreen = ({ route }) => { 
  const { savedImages } = route.params;

  return ( 
    <View style={styles.container}>
      <ImageList images={savedImages} />
    </View>
  ); 
};

const NextScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  ); 
};

export default function App() {
  useEffect(() => { 
    const setupDatabase = async () => { 
      try {
         await initializeDatabase();
         console.log('Database initialized successfully'); 
        } catch (error) { 
          console.error('Error in database setup:', error);
         Alert.alert('Database Setup Error', `Error in database setup: ${error.message}`);
         } 
        }; 
        setupDatabase();
       }, 
       []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
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
    fontSize: 24,
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
   button: {
     flexDirection: 'row', 
     backgroundColor: "#841584", 
     padding: 10, 
     borderRadius: 5, 
     alignItems: 'center',
      marginBottom: 10,
     }, 
     buttonText: { 
      color: "#fff",
       fontSize: 18, 
       marginLeft: 10, 
      }
});
