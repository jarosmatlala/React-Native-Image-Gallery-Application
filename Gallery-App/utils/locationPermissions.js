import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const requestPermissions = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "Location access is required.");
    return false;
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== "granted") {
    Alert.alert("Permission Denied", "Background location access is required.");
    return false;
  }

  return true;
};
