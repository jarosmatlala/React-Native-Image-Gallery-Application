import React from 'react';
import { Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const CameraPicker = ({ onImageCapture }) => {
  const captureImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
    
      const asset = await MediaLibrary.createAssetAsync(uri);
      const { location } = asset;
      
      if (location) {
        onImageCapture({ uri, location });
      } else {
        Alert.alert('No location metadata found for this image.');
      }
    }
  };

  return <Button title="Capture Image" onPress={captureImage} />;
};

export default CameraPicker;
