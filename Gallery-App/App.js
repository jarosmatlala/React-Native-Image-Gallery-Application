import React, {useState} from 'react';
import { StyleSheet, Text, View ,Button} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import CameraPicker from './components/CameraPicker';
import SavedImageDisplay from './components/SavedImageDisplay';

export default function App() {

  const [imageUri, setImageUri] = useState(null); 
  const [filePath, setFilePath] = useState(null); 

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