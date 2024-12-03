import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function MapsLibrary() {
  return (
    <View style={styles.container}>
      <Text>Google Maps</Text>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    map: {
      width: Dimensions.get("window"),width,
      height: Dimensions.get("window").height
    },

  },
});
