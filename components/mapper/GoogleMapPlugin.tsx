import { safeJsonParse } from "@/utils/common";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, BoxProps, Overlay, Skeleton, Text } from "@mantine/core";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import merge from "lodash.merge";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useCallback, useEffect, useState } from "react";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";

type Props = EditableComponentMapper & {
  onClick?: (e: any) => void;
} & BoxProps;

type GoogleMapProps = {
  markers: MarkerItem[];
  options: any;
  style?: { width?: string; height?: string; [key: string]: any };
  apiKey: string;
  language?: string;
  [i: string]: any;
};
export type MarkerItem = { id: string; name: string } & Position;
type LatLng = { lat: number; lng: number };
type Position = {
  position: LatLng;
};

const defaultCenter = { lat: 25.816347481537285, lng: -80.1219500315037 };

export const GoogleMapPlugin = ({
  component,
  shareableContent,
  onClick,
  ...props
}: Props) => {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [map, setMap] = useState<any | null>(null);

  const { options, language, loading, fade, ...componentProps } =
    component.props as GoogleMapProps;
  const { apiKey, zoom, centerLat, centerLng, markers } = component.onLoad;

  const center = {
    lat: centerLat ?? defaultCenter.lat,
    lng: centerLng ?? defaultCenter.lng,
  };

  const markersParsed = safeJsonParse(markers) as MarkerItem[];
  const MAP_SCRIPT_DELAY_DURATION = 800;

  const { width, height, ...googleStyles } = props.style ?? {};
  const containerStyle = { width, height };

  const otherProps = omit(props, ["style"]);

  const LOADING_TEXT = (
    <Text {...otherProps} w="100%" h="auto" pos="relative">
      Enter API key and refresh the page...
    </Text>
  );

  const loadScript = useLoadScript({
    id: `map-${component.id}`,
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

  const handleClick = (e: any) => {
    onClick?.(e);
    setActiveMarkerId(null);
  };

  const gmOnLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      const bounds = new window.google.maps.LatLngBounds({
        lat: Number(center.lat),
        lng: Number(center.lng),
      });

      markersParsed?.forEach?.(({ position }: Position) =>
        bounds.extend(position),
      );
      map.fitBounds(bounds);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [center, markersParsed, zoom],
  );

  useEffect(() => {
    setTimeout(() => {
      if (map) {
        map.setZoom(zoom);
      }
    }, MAP_SCRIPT_DELAY_DURATION);
  }, [zoom, map]);

  const unMount = useCallback((map: any) => {
    setMap(null);
  }, []);

  if (!isLoaded || !apiKey) {
    return LOADING_TEXT;
  }

  if (loading) {
    return <Skeleton height={300} visible />;
  }

  const customOptions = merge({}, options, {
    // @ts-ignore
    mapTypeId: google.maps.MapTypeId[options?.mapTypeId],
  });

  return (
    <Box
      pos="relative"
      {...otherProps}
      style={containerStyle}
      id={component.id}
      onClick={handleClick}
    >
      <GoogleMap
        key={apiKey}
        options={customOptions}
        onLoad={gmOnLoad}
        onUnmount={unMount}
        mapContainerStyle={containerStyle}
        {...componentProps}
        {...props}
        {...googleStyles}
        center={{
          lat: Number(center.lat),
          lng: Number(center.lng),
        }}
        zoom={zoom}
      >
        {markersParsed?.map?.(({ id, name, position }) => (
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

      {fade && <Overlay color="#fff" opacity={0.7} blur={0.5} zIndex={1} />}
    </Box>
  );
};
