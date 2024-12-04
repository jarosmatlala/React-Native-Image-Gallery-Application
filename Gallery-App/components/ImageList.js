import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const ImageList = ({ images }) => {
    if (images.length === 0) return <Text>No images available</Text>;

    return (
        <ScrollView style={styles.scrollView}>
            {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    {image.location ? (
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: image.location.latitude,
                                longitude: image.location.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: image.location.latitude,
                                    longitude: image.location.longitude,
                                }}
                                title={`Image ${index + 1} Location`}
                            />
                        </MapView>
                    ) : (
                        <Text style={styles.text}>No location data available for this image.</Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'center',
    },
    map: {
        width: '100%',
        height: 200,
    },
});

export default ImageList;
