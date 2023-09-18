import { Component } from "@/utils/editor";
import { BoxProps, Text } from "@mantine/core";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { MarkerItem } from "../modifiers/GoogleMap";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

type GoogleMapProps = {
  markers: MarkerItem[];
  options?: any;
  style?: { width?: string; height?: string; [key: string]: any };
  apiKey: string;
  language?: string;
  zoom?: number;
};

export type Position = {
  position: { lat: number; lng: number };
};

const LOADING_TEXT = <Text>Loading...</Text>;

export const GoogleMapPlugin = ({ renderTree, component, ...props }: Props) => {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [map, setMap] = useState<any | null>(null);

  const {
    markers,
    options,
    style = {},
    apiKey,
    language,
    zoom,
    ...componentProps
  } = component.props as GoogleMapProps;

  const { width, height, ...googleStyles } = style;
  const containerStyle = { width, height };

  const loadScript = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    language: language,
  });

  // Determine whether the maps API is loaded
  const isAlreadyLoaded = !!window.google;
  const isLoaded = isAlreadyLoaded || loadScript.isLoaded;

  const handleActiveMarker = (markerId: string) => {
    if (markerId !== activeMarkerId) {
      setActiveMarkerId(markerId);
    }
  };

  const handleOnLoad = (loadedMap: any) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }: Position) => bounds.extend(position));
    loadedMap.fitBounds(bounds);
  };

  useEffect(
    () => {
      if (map) {
        handleOnLoad(map);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiKey, map, markers],
  );

  if (!isLoaded) {
    return LOADING_TEXT;
  }

  return (
    <GoogleMap
      key={apiKey}
      onLoad={handleOnLoad}
      onUnmount={() => setMap(null)}
      zoom={zoom as number}
      onClick={() => setActiveMarkerId(null)}
      mapContainerStyle={containerStyle}
      {...componentProps}
      {...props}
      {...googleStyles}
    >
      {markers &&
        markers.length > 0 &&
        (markers as MarkerItem[]).map(({ id, name, position }) => (
          <Marker
            key={id}
            position={position}
            onClick={() => handleActiveMarker(id)}
          >
            {activeMarkerId === id && (
              <InfoWindow onCloseClick={() => setActiveMarkerId(null)}>
                <Text>{name}</Text>
              </InfoWindow>
            )}
          </Marker>
        ))}
    </GoogleMap>
  );
};
