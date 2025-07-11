import React from "react";
import { View } from "react-native";
import MapboxGL from "@rnmapbox/maps";

MapboxGL.setAccessToken(process.env.MAPBOX_KEY);

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        styleURL={process.env.MAPBOX_STYLE_URL}
        style={{ flex: 1 }}
      >
        <MapboxGL.Camera centerCoordinate={[126.978, 37.5665]} zoomLevel={5} />
      </MapboxGL.MapView>
    </View>
  );
}
