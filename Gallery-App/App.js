import React, {useState} from 'react';
import { StyleSheet, Text, View ,Button} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import CameraPicker from './components/CameraPicker';
import SavedImageDisplay from './components/SavedImageDisplay';
import MapsLibrary from './components/MapsLibrary';

export default function App() {

  const [imageUri, setImageUri] = useState(null); 
  const [filePath, setFilePath] = useState(null); 


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
      setImageUri(savedPath);
      setFilePath(savedPath);
    } catch (error) {
      console.error('Failed to save image:', error);
    }
  };

  


  return (
    <View style={styles.container}>
<Text style={styles.title}>React Native Image Picker</Text>
      <CameraPicker onImageCapture={handleImageCapture} />
      <SavedImageDisplay imageUri={imageUri} filePath={filePath} />
      <MapsLibrary />
     
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