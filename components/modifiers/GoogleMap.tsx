import { Position } from "@/components/mapper/GoogleMapPlugin";
import { withModifier } from "@/hoc/withModifier";
import { ICON_SIZE } from "@/utils/config";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
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
import merge from "lodash.merge";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { SwitchSelector } from "../SwitchSelector";

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
          apiKey: selectedComponent.props?.apiKey,
          center: selectedComponent.props?.center,
          options: selectedComponent.props?.options,
          zoom: selectedComponent.props?.zoom,
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
          <TextInput
            size="xs"
            label="API Key"
            {...form.getInputProps("apiKey")}
            onChange={(e) => {
              form.setFieldValue("apiKey", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                apiKey: e.target.value,
              });
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
                {(form.values.markers as any[]).map(
                  (child: any, index: any) => (
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
                          onChange={(e) =>
                            upDateMarker(index, "lat", e as number)
                          }
                        />
                        <NumberInput
                          label="Longitude"
                          size="xs"
                          precision={6}
                          step={0.000005}
                          value={child.position.lng}
                          onChange={(e) =>
                            upDateMarker(index, "lng", e as number)
                          }
                        />
                      </Group>
                      <Divider my="sm" />
                    </Box>
                  ),
                )}
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
              <Group grow spacing="xs">
                <NumberInput
                  size="xs"
                  label="Zoom"
                  {...form.getInputProps("zoom")}
                  onChange={(value) => {
                    form.setFieldValue("zoom", value as number);
                    debouncedTreeUpdate(selectedComponentIds, { zoom: value });
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
                    debouncedTreeUpdate(selectedComponentIds, {
                      language: value,
                    });
                  }}
                />
              </Group>
              <Group noWrap>
                <SwitchSelector
                  topLabel="Show Control"
                  {...form.getInputProps("options.mapTypeControl")}
                  checked={form.getInputProps("options.mapTypeControl").value}
                  onChange={(event) => {
                    form.setFieldValue(
                      "options.mapTypeControl",
                      event.currentTarget.checked,
                    );
                    debouncedTreeUpdate(selectedComponentIds, {
                      options: { mapTypeControl: event.currentTarget.checked },
                    });
                  }}
                />
                <SwitchSelector
                  topLabel="fade"
                  {...form.getInputProps("fade")}
                  checked={form.getInputProps("fade").value}
                  onChange={(event) => {
                    form.setFieldValue("fade", event.currentTarget.checked);
                    debouncedTreeUpdate(selectedComponentIds, {
                      fade: event.currentTarget.checked,
                    });
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
                      ...(form.values.center as any),
                      lat: value as number,
                    };
                    debouncedTreeUpdate(selectedComponentIds, {
                      center,
                    });
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
                      ...(form.values.center as any),
                      lng: value as number,
                    };
                    debouncedTreeUpdate(selectedComponentIds, {
                      center,
                    });
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
                {(form.values.options as any).styles.map(
                  (child: any, index: any) => {
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
                        {child.stylers.map((style: any, styleIndex: any) => {
                          return (
                            <Stack spacing="xs" key={styleIndex}>
                              <Group noWrap>
                                <NumberInput
                                  size="xs"
                                  label="Saturation"
                                  value={style.saturation as number}
                                  onChange={(value) => {
                                    const _stylers = [...child.stylers];
                                    _stylers[styleIndex] = {
                                      ...style,
                                      saturation: value as number,
                                    };
                                    updateMapStyle(index, "stylers", _stylers);
                                  }}
                                />
                                <NumberInput
                                  size="xs"
                                  label="Lightness"
                                  value={style.lightness as number}
                                  onChange={(value) => {
                                    const _stylers = [...child.stylers];
                                    _stylers[styleIndex] = {
                                      ...style,
                                      lightness: value as number,
                                    };
                                    updateMapStyle(index, "stylers", _stylers);
                                  }}
                                />
                              </Group>
                              <NumberInput
                                size="xs"
                                label="Gamma"
                                precision={2}
                                step={0.05}
                                value={style.gamma as number}
                                onChange={(value) => {
                                  const _stylers = [...child.stylers];
                                  _stylers[styleIndex] = {
                                    ...style,
                                    gamma: value as number,
                                  };
                                  updateMapStyle(index, "stylers", _stylers);
                                }}
                              />
                            </Stack>
                          );
                        })}
                      </Box>
                    );
                  },
                )}
              </Stack>
            </>
          )}
        </Stack>
      </form>
    );
  },
);
