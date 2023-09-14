import { theme } from "@/pages/_app";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
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
import { Position } from "../mapper/GoogleMapPlugin";
import { useEffect, useState } from "react";
import { pick } from "next/dist/lib/pick";
import { ThemeColorSelector } from "../ThemeColorSelector";
import { nanoid } from "nanoid";

export const icon = IconMapPin;
export const label = "MapSettings";

export type MarkerItem = { id: string; name: string } & Position;
type Styler = Record<string, string | Record<string, any>[]>;

export const defaultMapValues = {
  language: "en",
  apiKey: "",
  center: {
    lat: 0.0,
    lng: 0.0,
  },
  options: {
    mapTypeId: "SATELITE",
    styles: [] as Styler[],
  },
  zoom: 10,
  markers: [] as Array<MarkerItem>,
};

export const Modifier = () => {
  const { editorTree, selectedComponentId } = useEditorStore((state) => ({
    editorTree: state.tree,
    selectedComponentId: state.selectedComponentId,
  }));
  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string,
  );

  const form = useForm({
    initialValues: defaultMapValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "language",
        "apiKey",
        "center",
        "options",
        "zoom",
        "markers",
      ]);

      form.setValues({
        language: data.language ?? defaultMapValues.language,
        apiKey: data.apiKey ?? defaultMapValues.apiKey,
        center: data.center?.lat ? data.center : defaultMapValues.center,
        options: data.options ?? defaultMapValues.options,
        zoom: data.zoom ?? defaultMapValues.zoom,
        markers: data.markers?.length ? data.markers : defaultMapValues.markers,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const addMarker = () => {
    const id = nanoid();
    const newMarker: MarkerItem = {
      id,
      name: "",
      position: { lat: 0.0, lng: 0.0 },
    };
    const updatedMarkers = [...form.values.markers, newMarker];
    form.setFieldValue("markers", updatedMarkers);
    debouncedTreeComponentPropsUpdate("markers", updatedMarkers);
  };

  const upDateMarker = (id: number, field: string, val: string | number) => {
    const updatedMarkerItems = [...form.values.markers];
    if (field === "name") updatedMarkerItems[id][field] = val as string;
    if (field === "lat" || field === "lng")
      updatedMarkerItems[id].position[field] = val as number;
    form.setValues({ ...form.values, markers: updatedMarkerItems });
    debouncedTreeComponentPropsUpdate("markers", updatedMarkerItems);
  };

  const removeMarker = (index: number) => {
    const updatedMarkers = form.values.markers;
    updatedMarkers.splice(index, 1);
    form.setValues({ ...form.values, markers: updatedMarkers });
    debouncedTreeComponentPropsUpdate("markers", updatedMarkers);
  };

  const addMapStyle = () => {
    const newMapStyle: Styler = {
      featureType: "all",
      elementType: "all",
      stylers: [
        {
          color: "",
        },
        {
          lightness: null! as number,
        },
      ],
    };
    const updatedMapStyle = [...form.values.options.styles, newMapStyle];
    const options = { ...form.values.options, styles: updatedMapStyle };
    form.setFieldValue("options.styles", updatedMapStyle);
    debouncedTreeComponentPropsUpdate("options", options);
  };

  const updateMapStyle = (id: number, field: string, val: any) => {
    const updatedMapStyles = [...form.values.options.styles];

    updatedMapStyles[id][field] = val;
    form.setValues({
      ...form.values,
      options: { ...form.values.options, styles: updatedMapStyles },
    });
    const options = { ...form.values.options, styles: updatedMapStyles };
    debouncedTreeComponentPropsUpdate("options", options);
  };

  const removeMapStyle = (id: number) => {
    const updatedMapStyles = form.values.options.styles;
    updatedMapStyles.splice(id, 1);
    form.setFieldValue("options.styles", updatedMapStyles);
    const options = { ...form.values.options, styles: updatedMapStyles };
    debouncedTreeComponentPropsUpdate("options", options);
  };

  const [isApiKey, setIsApiKey] = useState(false);

  useEffect(() => {
    form.values.apiKey.length > 0 ? setIsApiKey(true) : setIsApiKey(false);
  }, [form.values.apiKey]);

  return (
    <form key={selectedComponentId}>
      <Stack spacing="xs">
        <TextInput
          size="xs"
          label="API Key"
          {...form.getInputProps("apiKey")}
          onChange={(e) => {
            form.setFieldValue("apiKey", e.target.value);
            debouncedTreeComponentPropsUpdate("apiKey", e.target.value);
          }}
        />
        {isApiKey && (
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
              {form.values.markers.map((child, index) => (
                <Box key={child.id}>
                  <Flex justify="space-between">
                    <Text size="sm">Marker {index + 1}</Text>
                    <ActionIcon onClick={() => removeMarker(index)}>
                      <IconTrash size={ICON_SIZE} color="red" />
                    </ActionIcon>
                  </Flex>
                  <TextInput
                    label="Name"
                    size="xs"
                    value={child.name}
                    onChange={(e) =>
                      upDateMarker(index, "name", e.target.value)
                    }
                  />
                  <Group grow spacing="xs">
                    <NumberInput
                      label="Latitude"
                      size="xs"
                      precision={6}
                      step={0.000005}
                      value={child.position.lat}
                      onChange={(e) => upDateMarker(index, "lat", e as number)}
                    />
                    <NumberInput
                      label="Longitude"
                      size="xs"
                      precision={6}
                      step={0.000005}
                      value={child.position.lng}
                      onChange={(e) => upDateMarker(index, "lng", e as number)}
                    />
                  </Group>
                  <Divider my="sm" />
                </Box>
              ))}
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
                  ...form.values.options,
                  mapTypeId: value as string,
                };
                debouncedTreeComponentPropsUpdate("options", options);
              }}
            />
            <Group grow spacing="xs">
              <NumberInput
                size="xs"
                label="Zoom"
                {...form.getInputProps("zoom")}
                onChange={(value) => {
                  form.setFieldValue("zoom", value as number);
                  debouncedTreeComponentPropsUpdate("zoom", value as number);
                }}
              />
              <Select
                size="xs"
                label="Language"
                {...form.getInputProps("language")}
                data={[
                  { label: "English", value: "en" },
                  { label: "French", value: "fr" },
                ]}
                onChange={(value) => {
                  form.setFieldValue("language", value as string);
                  debouncedTreeComponentPropsUpdate(
                    "language",
                    value as string,
                  );
                }}
              />
            </Group>
            <Divider my="sm" />
            <Text size="sm">Center</Text>
            <Group grow spacing="xs">
              <NumberInput
                size="xs"
                label="Latitude"
                precision={6}
                step={0.000005}
                {...form.getInputProps("center.lat")}
                onChange={(value) => {
                  form.setFieldValue("center.lat", value as number);
                  const center = {
                    ...form.values.center,
                    lat: value as number,
                  };
                  debouncedTreeComponentPropsUpdate("center", center);
                }}
              />
              <NumberInput
                size="xs"
                label="Longitude"
                precision={6}
                step={0.000005}
                {...form.getInputProps("center.lng")}
                onChange={(value) => {
                  form.setFieldValue("center.lng", value as number);
                  const center = {
                    ...form.values.center,
                    lng: value as number,
                  };
                  debouncedTreeComponentPropsUpdate("center", center);
                }}
              />
            </Group>
            <Divider my={2} />
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
              {form.values.options.styles.map((child, index) => {
                return (
                  <Box key={index}>
                    <Flex justify="space-between">
                      <Text size="sm">Style {index + 1}</Text>
                      <ActionIcon onClick={() => removeMapStyle(index)}>
                        <IconTrash size={ICON_SIZE} color="red" />
                      </ActionIcon>
                    </Flex>
                    <Select
                      label="Feature Type"
                      size="xs"
                      value={child.featureType as string}
                      data={[
                        { label: "all", value: "all" },
                        { label: "administrative", value: "administrative" },
                        { label: "landscape", value: "landscape" },
                        { label: "poi", value: "poi" },
                        { label: "road", value: "road" },
                        { label: "transit", value: "transit" },
                        { label: "water", value: "water" },
                      ]}
                      onChange={(e) =>
                        updateMapStyle(index, "featureType", e as string)
                      }
                    />
                    <Select
                      label="Element Type"
                      size="xs"
                      value={child.elementType as string}
                      data={[
                        { label: "all", value: "all" },
                        { label: "geometry", value: "geometry" },
                        { label: "labels", value: "labels" },
                      ]}
                      onChange={(e) =>
                        updateMapStyle(index, "elementType", e as string)
                      }
                    />
                    <Divider my="sm" />
                  </Box>
                );
              })}
            </Stack>
          </>
        )}
      </Stack>
    </form>
  );
};
