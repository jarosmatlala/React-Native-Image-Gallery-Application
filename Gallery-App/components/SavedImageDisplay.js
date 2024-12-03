import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SavedImageDisplay = ({ imageUri, filePath }) => {
  if (!imageUri || !filePath) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.pathText}>Saved to: {filePath}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 10 },
  pathText: { fontSize: 12, color: 'gray', textAlign: 'center' },
});

export default SavedImageDisplay;
