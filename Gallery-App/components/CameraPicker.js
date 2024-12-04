import React , {useState} from "react";
import { Button, Alert, ScrollView, View ,StyleSheet,Image} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";

const CameraPicker = ({ onImageCapture }) => {
  const [capturedImageUri, setCapturedImageUri] = useState(null);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return false;
    }
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    console.log("Background location permission status:", backgroundStatus);

    if (backgroundStatus !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Background location permission was denied"
      );
      return false;
    }
    return true;
  };

  const captureImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Camera permission is required!");
      return;
    }

    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    if (!mediaLibraryPermission.granted) {
      Alert.alert("Media library permission is required to save images!");
      return;
    }

    console.log("Opening camera...");
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      console.log("Image captured:", result.assets[0].uri);

      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const location = asset.location ? asset.location : null;

        setCapturedImageUri(asset.uri);


        onImageCapture({
          uri: asset.uri,
          location: location,
        });
        console.log("Image saved to media library:", uri);
      } catch (error) {
        Alert.alert("Error saving image", error.message);
      }
    } else {
      console.log("Camera was canceled or no image was captured.");
    }
  };


  return (
    <ScrollView style={styles.scrollView}
    contentContainerStyle={styles.contentContainer}
    >  
      <View>
        <Button title="Capture Image" onPress={captureImage} />
        {capturedImageUri && (
          <Image
            source={{ uri: capturedImageUri }}
            style={styles.capturedImage}
          />
        )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  capturedImage: {
    width: 300, 
    height: 300, 
    marginTop: 20, 
    borderRadius: 10, 
  },
});

export default CameraPicker;


