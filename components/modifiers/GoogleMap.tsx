import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { withModifier } from "@/hoc/withModifier";
import { ICON_SIZE } from "@/utils/config";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMapPin, IconPlus, IconTrash } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect, useState } from "react";

export const icon = IconMapPin;
export const label = "Map Settings";

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
          fade: selectedComponent.props?.fade,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

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
      debouncedTreeComponentAttrsUpdate({ attrs: { props: { options } } });
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
      debouncedTreeComponentAttrsUpdate({ attrs: { props: { options } } });
    };

    const removeMapStyle = (id: number) => {
      const updatedMapStyles = (form.values.options as any).styles;
      updatedMapStyles.splice(id, 1);
      form.setFieldValue("options.styles", updatedMapStyles);
      const options = {
        ...(form.values.options as any),
        styles: updatedMapStyles,
      };
      debouncedTreeComponentAttrsUpdate({ attrs: { props: { options } } });
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
                debouncedTreeComponentAttrsUpdate({
                  attrs: { props: { options } },
                });
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
                debouncedTreeComponentAttrsUpdate({
                  attrs: { props: { language: value } },
                });
              }}
            />
            <SegmentedControlYesNo
              label="Show Control"
              {...form.getInputProps("options.mapTypeControl")}
              onChange={(value) => {
                form.setFieldValue("options.mapTypeControl", value);
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      options: {
                        mapTypeControl: value,
                        streetViewControl: value,
                        fullscreenControl: value,
                        zoomControl: value,
                      },
                    },
                  },
                });
              }}
            />
            <SegmentedControlYesNo
              label="Fade"
              {...form.getInputProps("fade")}
              onChange={(value) => {
                form.setFieldValue("fade", value);
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      fade: value,
                    },
                  },
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
