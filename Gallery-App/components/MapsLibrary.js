import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";



export default function MapsLibrary({ location }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Google Maps</Text>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="Image Location"
      />
    </MapView>
  ) : (
    <Text style={styles.text}>No location data available.</Text>
  )}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: 'white',
    margin: 10,
    fontSize: 18,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
