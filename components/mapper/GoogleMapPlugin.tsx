import { MarkerItem, Options } from "@/components/modifiers/GoogleMap";
import { Component } from "@/utils/editor";
import { BoxProps, Skeleton, Text } from "@mantine/core";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

type GoogleMapProps = {
  markers: MarkerItem[];
  options: Options;
  style?: { width?: string; height?: string; [key: string]: any };
  apiKey: string;
  language?: string;
  zoom: number;
  center: { lat: number; lng: number };
  [i: string]: any;
};

export type Position = {
  position: { lat: number; lng: number };
};

const LOADING_TEXT = <Text>Enter API key and refresh the page...</Text>;

export const GoogleMapPlugin = ({ renderTree, component, ...props }: Props) => {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [map, setMap] = useState<any | null>(null);

  const {
    markers,
    options,
    apiKey,
    language,
    zoom,
    center,
    loading,
    ...componentProps
  } = component.props as GoogleMapProps;

  const [internalZoom, setInternalZoom] = useState<number>(zoom);
  const MAP_SCRIPT_DELAY_DURATION = 800;

  const { width, height, ...googleStyles } = props.style ?? {};
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

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds(center);
      markers.forEach(({ position }: Position) => bounds.extend(position));
      map.fitBounds(bounds);

      setMap(map);

      setInternalZoom(internalZoom);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, center, apiKey, markers],
  );

  useEffect(() => {
    setTimeout(() => {
      if (map) {
        map.setZoom(internalZoom);
      }
    }, MAP_SCRIPT_DELAY_DURATION);
  }, [internalZoom, map]);

  const unMount = useCallback((map: any) => {
    setMap(null);
  }, []);

  if (!isLoaded || !apiKey) {
    return LOADING_TEXT;
  }

  return (
    <Skeleton visible={loading}>
      <GoogleMap
        key={apiKey}
        center={center}
        onLoad={onLoad}
        onUnmount={unMount}
        zoom={(internalZoom ?? 0) as any}
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
              onMouseOver={() => handleActiveMarker(id)}
              onMouseOut={() => setActiveMarkerId(null)}
            >
              {activeMarkerId === id && (
                <InfoWindow onCloseClick={() => setActiveMarkerId(null)}>
                  <Text>{name}</Text>
                </InfoWindow>
              )}
            </Marker>
          ))}
      </GoogleMap>
    </Skeleton>
  );
};
