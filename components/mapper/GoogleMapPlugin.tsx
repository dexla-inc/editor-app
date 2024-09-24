import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { safeJsonParse } from "@/utils/common";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, BoxProps, Overlay, Skeleton, Text } from "@mantine/core";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = EditableComponentMapper & BoxProps;

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

const GoogleMapPluginComponent = forwardRef<GoogleMap, Props>(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
    const [map, setMap] = useState<any | null>(null);

    const { options, language, loading, fade, triggers, ...componentProps } =
      component.props as GoogleMapProps;
    const {
      apiKey,
      zoom: zoomValue,
      centerLat,
      centerLng,
      markers,
    } = component.onLoad;

    const zoom = Number(zoomValue);
    const center = {
      lat: centerLat ?? defaultCenter.lat,
      lng: centerLng ?? defaultCenter.lng,
    };

    const MAP_SCRIPT_DELAY_DURATION = 800;

    const {
      width,
      height,
      borderBottomLeftRadius,
      borderStyle,
      borderBottomRightRadius,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderWidth,
      borderColor,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      border,
      ...googleStyles
    } = props.style ?? {};

    const containerStyle = {
      width,
      height,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderRadius,
      borderWidth,
      borderColor,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderStyle,
      border,
    };

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
      triggers?.onClick?.(e);
      setActiveMarkerId(null);
    };

    const validMarkers = useMemo(() => {
      const markersParsed =
        (safeJsonParse(markers) as MarkerItem[] | undefined) ?? [];
      return Array.isArray(markersParsed)
        ? markersParsed.filter((marker) => {
            const isValidId = !isEmpty(marker.id);
            const isValidLat = !isEmpty(Number(marker.position.lat));
            const isValidLng = !isEmpty(Number(marker.position.lng));
            if (isValidLat || isValidLng || isValidId) {
              console.error(
                `Component: ${component.description} - Invalid marker position:`,
                marker,
                isValidId,
                isValidLat,
                isValidLng,
              );
              return false;
            }
            return true;
          })
        : [];
    }, [component.description, markers]);

    const gmOnLoad = useCallback(
      (map: google.maps.Map) => {
        setMap(map);

        const bounds = new window.google.maps.LatLngBounds();
        validMarkers?.forEach(({ position }: Position) =>
          bounds.extend(position),
        );
        map.fitBounds(bounds);
      },
      [validMarkers],
    );

    useEffect(() => {
      setTimeout(() => {
        if (map) {
          map.setZoom(zoom);
        }
      }, MAP_SCRIPT_DELAY_DURATION);
    }, [zoom, map]);

    const unMount = useCallback(() => {
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
        style={{ width, height }}
        id={component.id}
        {...triggers}
        onClick={(e) => handleClick(e)}
      >
        <GoogleMap
          ref={ref}
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
          {validMarkers?.map?.(({ id, position }) => (
            <Marker key={id} position={position} />
          ))}
        </GoogleMap>

        {fade && <Overlay color="#fff" opacity={0.7} blur={0.5} zIndex={1} />}
      </Box>
    );
  },
);

GoogleMapPluginComponent.displayName = "GoogleMapPlugin";
export const GoogleMapPlugin = memo(
  withComponentWrapper(GoogleMapPluginComponent),
);
