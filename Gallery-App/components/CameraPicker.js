import React from 'react';
import { Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const CameraPicker = ({ onImageCapture }) => {

  const captureImage = async () => {



    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Camera permission is required!');
      return;
    }

    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    if (!mediaLibraryPermission.granted) {
      Alert.alert('Media library permission is required to save images!');
      return;
    }

    console.log('Opening camera...');
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image captured:', result.assets[0].uri);

      const asset = await MediaLibrary.createAssetAsync(uri);


      const uri = result.assets[0].uri;
      const location  = asset.location ? asset.location : null;

      onImageCapture({
         uri,
         location,
         });
         console.log('Image saved to media library:', uri);

    } else {
      console.log('Camera was canceled or no image was captured.');
    }
    
    
  };

  return <Button title="Capture Image" onPress={captureImage} />;
};

export default CameraPicker;
