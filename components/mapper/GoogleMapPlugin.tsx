import { Component } from "@/utils/editor";
import { BoxProps, Text } from "@mantine/core";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export type Position = {
  position: { lat: number; lng: number };
};

type MarkerProp = {
  id: string;
  name: string;
} & Position;

export const GoogleMapPlugin = ({ renderTree, component, ...props }: Props) => {
  const [activeMarker, setActiveMarker] = useState<string>(null!);

  const { markers, options, ...componentProps } = component.props as any;

  const { width, height, ...googleStyles } = componentProps?.style;
  const containerStyle = { width, height };

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: componentProps?.apiKey as string,
    language: componentProps?.language as string,
  });

  const handleActiveMarker = (marker: string) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map: any) => {
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach(({ position }: Position) => bounds.extend(position));
    map.fitBounds(bounds);
  };

  return (
    isLoaded && (
      <GoogleMap
        onLoad={handleOnLoad}
        onClick={() => setActiveMarker(null!)}
        mapContainerStyle={containerStyle}
        {...componentProps}
        {...props}
        {...googleStyles}
      >
        {markers &&
          markers.length > 0 &&
          markers.map(({ id, name, position }: MarkerProp) => {
            return (
              <Marker
                key={id}
                position={position}
                onClick={() => handleActiveMarker(id)}
              >
                {activeMarker === id && (
                  <InfoWindow onCloseClick={() => setActiveMarker(null!)}>
                    <Text>{name}</Text>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
      </GoogleMap>
    )
  );
};
