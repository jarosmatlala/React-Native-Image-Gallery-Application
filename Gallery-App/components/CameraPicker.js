import React from 'react';
import { Button, Alert,StyleSheet,TouchableOpacity,Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';


const CameraPicker = ({ onImageCapture }) => {

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return false;
    }
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    console.log('Background location permission status:', backgroundStatus);
  
    if (backgroundStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Background location permission was denied');
      return false;
    }
    return true;
  };

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
      const uri = result.assets[0].uri;

      console.log('Image captured:', result.assets[0].uri);

try{
      const asset = await MediaLibrary.createAssetAsync(uri);
      const location  = asset.location ? asset.location : null;
      onImageCapture({ uri: asset.uri, location: location });
    
      onImageCapture({ uri:asset.uri  });

         console.log('Image saved to media library and database:', uri);
        } catch (error) {
          Alert.alert('Error saving image', error.message);
        }
    } else {
      console.log('Camera was canceled or no image was captured.');
    }
    
    
  };

  return (
     <TouchableOpacity style={styles.button} onPress={captureImage}>
       <Icon name="camera-alt" size={24} color="#fff" />
        <Text style={styles.buttonText}>Capture Image</Text> 
        </TouchableOpacity> );
        
      };

      const styles = StyleSheet.create({ 
        button: { 
          flexDirection: 'row',
          backgroundColor: "#007bff",
         padding: 10, 
         borderRadius: 5, 
         alignItems: 'center', 
         marginBottom: 10,
         },
         buttonText: { 
          color: "#fff", 
          fontSize: 18, 
          marginLeft: 10, 
        }, 
      });

export default CameraPicker;
