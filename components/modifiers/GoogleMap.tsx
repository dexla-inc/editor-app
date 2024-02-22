import { Position } from "@/components/mapper/GoogleMapPlugin";
import { withModifier } from "@/hoc/withModifier";
import { ICON_SIZE } from "@/utils/config";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMapPin, IconPlus, IconTrash } from "@tabler/icons-react";
import merge from "lodash.merge";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

export const icon = IconMapPin;
export const label = "Map Settings";

export type MarkerItem = { id: string; name: string } & Position;
export type Styler = Record<string, string | Record<string, any>[]>;
export type Options = {
  mapTypeId: string;
  styles: Styler[];
  mapTypeControl: boolean;
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.mapSettings, {
          language: selectedComponent.props?.language,
          options: selectedComponent.props?.options,
          markers: selectedComponent.props?.markers,
          fade: selectedComponent.props?.fade,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const addMarker = () => {
      const id = nanoid();
      const newMarker: MarkerItem = {
        id,
        name: "",
        position: { lat: 0.0, lng: 0.0 },
      };
      const updatedMarkers = [...(form.values.markers as any[]), newMarker];
      form.setFieldValue("markers", updatedMarkers);
      debouncedTreeUpdate(selectedComponentIds, { markers: updatedMarkers });
    };

    const upDateMarker = (id: number, field: string, val: string | number) => {
      const updatedMarkerItems = [...(form.values.markers as any[])];
      if (field === "name") updatedMarkerItems[id][field] = val as string;
      if (field === "lat" || field === "lng")
        updatedMarkerItems[id].position[field] = val as number;
      form.setValues({ ...form.values, markers: updatedMarkerItems });
      debouncedTreeUpdate(selectedComponentIds, {
        markers: updatedMarkerItems,
      });
    };

    const removeMarker = (index: number) => {
      const updatedMarkers = form.values.markers as any[];
      updatedMarkers.splice(index, 1);
      form.setValues({ ...form.values, markers: updatedMarkers });
      debouncedTreeUpdate(selectedComponentIds, { markers: updatedMarkers });
    };

    const addMapStyle = () => {
      const newMapStyle: Styler = {
        featureType: "all",
        elementType: "all",
        stylers: [
          {
            saturation: 0,
            lightness: 0,
            gamma: 1,
          },
        ],
      };

      const updatedMapStyle = [
        ...(form.values.options as any).styles,
        newMapStyle,
      ];
      const options = {
        ...(form.values.options as any),
        styles: updatedMapStyle,
      };
      form.setFieldValue("options.styles", updatedMapStyle);
      debouncedTreeUpdate(selectedComponentIds, { options });
    };

    const updateMapStyle = (id: number, field: string, val: any) => {
      const updatedMapStyles = [...(form.values.options as any).styles];

      updatedMapStyles[id][field] = val;
      form.setValues({
        ...form.values,
        options: { ...(form.values.options as any), styles: updatedMapStyles },
      });
      const options = {
        ...(form.values.options as any),
        styles: updatedMapStyles,
      };
      debouncedTreeUpdate(selectedComponentIds, { options });
    };

    const removeMapStyle = (id: number) => {
      const updatedMapStyles = (form.values.options as any).styles;
      updatedMapStyles.splice(id, 1);
      form.setFieldValue("options.styles", updatedMapStyles);
      const options = {
        ...(form.values.options as any),
        styles: updatedMapStyles,
      };
      debouncedTreeUpdate(selectedComponentIds, { options });
    };

    const [isApiKey, setIsApiKey] = useState(false);

    useEffect(() => {
      (form.values.apiKey as string)?.length > 0
        ? setIsApiKey(true)
        : setIsApiKey(false);
    }, [form.values.apiKey]);

    return (
      <form key={selectedComponent?.id}>
        <Stack spacing="xs">
          <>
            <Stack>
              <Flex justify="space-between" align="center">
                <Text size="sm">Add Marker</Text>
                <Button
                  onClick={addMarker}
                  size="xs"
                  leftIcon={<IconPlus size={ICON_SIZE} />}
                >
                  Add
                </Button>
              </Flex>
              <Box>
                <Flex justify="space-between">
                  <Text size="sm">Marker </Text>
                  <ActionIcon onClick={() => removeMarker(0)}>
                    <IconTrash size={ICON_SIZE} color="red" />
                  </ActionIcon>
                </Flex>
                <TextInput
                  label="Name"
                  size="xs"
                  // value={child.name}
                  onChange={(e) => upDateMarker(0, "name", e.target.value)}
                />
                <Group grow spacing="xs">
                  <NumberInput
                    label="Latitude"
                    size="xs"
                    precision={6}
                    step={0.000005}
                    // value={position.lat}
                    onChange={(e) => upDateMarker(0, "lat", e as number)}
                  />
                  <NumberInput
                    label="Longitude"
                    size="xs"
                    precision={6}
                    step={0.000005}
                    // value={child.position.lng}
                    onChange={(e) => upDateMarker(0, "lng", e as number)}
                  />
                </Group>
              </Box>
            </Stack>
            <Select
              size="xs"
              label="Map Type"
              {...form.getInputProps("options.mapTypeId")}
              data={[
                { label: "Satelite", value: "SATELITE" },
                { label: "Roadmap", value: "ROADMAP" },
                { label: "Hybrid", value: "HYBRID" },
                { label: "Terrain", value: "TERRAIN" },
                { label: "Streetview", value: "STREETVIEW" },
              ]}
              onChange={(value) => {
                form.setFieldValue("options.mapTypeId", value as string);
                const options = {
                  ...(form.values.options as any),
                  mapTypeId: value as string,
                };
                debouncedTreeUpdate(selectedComponentIds, { options });
              }}
            />
            <Select
              label="Language"
              {...form.getInputProps("language")}
              data={[
                { label: "English", value: "en" },
                { label: "French", value: "fr" },
              ]}
              onChange={(value) => {
                form.setFieldValue("language", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  language: value,
                });
              }}
            />
            <SegmentedControlYesNo
              label="Show Control"
              {...form.getInputProps("options.mapTypeControl")}
              onChange={(value) => {
                form.setFieldValue("options.mapTypeControl", value);
                debouncedTreeUpdate(selectedComponentIds, {
                  options: {
                    mapTypeControl: value,
                    streetViewControl: value,
                    fullscreenControl: value,
                    zoomControl: value,
                  },
                });
              }}
            />
            <SegmentedControlYesNo
              label="Fade"
              {...form.getInputProps("fade")}
              onChange={(value) => {
                form.setFieldValue("fade", value);
                debouncedTreeUpdate(selectedComponentIds, {
                  fade: value,
                });
              }}
            />
            <Stack>
              <Flex justify="space-between" align="center">
                <Text size="sm">Add Map Style</Text>
                <Button
                  onClick={addMapStyle}
                  size="xs"
                  leftIcon={<IconPlus size={ICON_SIZE} />}
                >
                  Add
                </Button>
              </Flex>

              <Box key={0}>
                <Flex justify="space-between">
                  <Text size="sm">Style {0 + 1}</Text>
                  <ActionIcon onClick={() => removeMapStyle(0)}>
                    <IconTrash size={ICON_SIZE} color="red" />
                  </ActionIcon>
                </Flex>
                <Select
                  label="Feature Type"
                  size="xs"
                  // value={child.featureType as string}
                  data={[
                    { label: "all", value: "all" },
                    {
                      label: "administrative",
                      value: "administrative",
                    },
                    { label: "landscape", value: "landscape" },
                    { label: "poi", value: "poi" },
                    { label: "road", value: "road" },
                    { label: "transit", value: "transit" },
                    { label: "water", value: "water" },
                  ]}
                  onChange={(e) =>
                    updateMapStyle(0, "featureType", e as string)
                  }
                />
                <Select
                  label="Element Type"
                  size="xs"
                  // value={child.elementType as string}
                  data={[
                    { label: "all", value: "all" },
                    { label: "geometry", value: "geometry" },
                    { label: "labels", value: "labels" },
                  ]}
                  onChange={(e) =>
                    updateMapStyle(0, "elementType", e as string)
                  }
                />

                <Stack spacing="xs">
                  <Group noWrap>
                    <NumberInput
                      size="xs"
                      label="Saturation"
                      // value={style.saturation as number}
                      // onChange={(value) => {
                      //   const _stylers = [...child.stylers];
                      //   _stylers[styleIndex] = {
                      //     ...style,
                      //     saturation: value as number,
                      //   };
                      //   updateMapStyle(index, "stylers", _stylers);
                      // }}
                    />
                    <NumberInput
                      size="xs"
                      label="Lightness"
                      // value={style.lightness as number}
                      // onChange={(value) => {
                      //   const _stylers = [...child.stylers];
                      //   _stylers[styleIndex] = {
                      //     ...style,
                      //     lightness: value as number,
                      //   };
                      //   updateMapStyle(index, "stylers", _stylers);
                      // }}
                    />
                  </Group>
                  <NumberInput
                    size="xs"
                    label="Gamma"
                    precision={2}
                    step={0.05}
                    // value={style.gamma as number}
                    // onChange={(value) => {
                    //   const _stylers = [...child.stylers];
                    //   _stylers[styleIndex] = {
                    //     ...style,
                    //     gamma: value as number,
                    //   };
                    //   updateMapStyle(index, "stylers", _stylers);
                    // }}
                  />
                </Stack>
              </Box>
            </Stack>
          </>
        </Stack>
      </form>
    );
  },
);
