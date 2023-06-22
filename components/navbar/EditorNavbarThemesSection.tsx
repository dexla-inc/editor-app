import { UnitInput } from "@/components/UnitInput";
import { saveTheme } from "@/requests/themes/mutations";
import { getTheme } from "@/requests/themes/queries";
import { ThemeMutationParams } from "@/requests/themes/types";
import { useAppStore } from "@/stores/app";
import {
  Box,
  Button,
  Flex,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const fontTags = [
  { label: "H1", value: "H1" },
  { label: "H2", value: "H2" },
  { label: "H3", value: "H3" },
  { label: "H4", value: "H4" },
  { label: "H5", value: "H5" },
  { label: "H6", value: "H6" },
  { label: "P", value: "p" },
];

const fontWeights = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

export const EditorNavbarThemesSection = () => {
  const router = useRouter();
  const isLoading = useAppStore((state) => state.isLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const [currentFontTag, setCurrentFontTag] = useState<string>("H1");

  const fonts = [
    "Arial",
    "Helvetica",
    "Lato",
    "Open Sans",
    "Roboto",
    "Raleway",
    "Times New Roman",
  ];

  const projectId = router.query.id as string;

  const form = useForm<ThemeMutationParams>({
    initialValues: {
      colors: [],
      fonts: [],
      responsiveBreakpoints: [],
      faviconUrl: "",
      logoUrl: "",
      defaultBorderRadius: 0,
      defaultSpacing: 0,
    },
    validate: {},
  });

  useEffect(() => {
    const fetchTheme = async () => {
      const theme = await getTheme(projectId);
      form.setValues(theme);
    };

    fetchTheme();
  }, [projectId]);

  const onSubmit = async (values: ThemeMutationParams) => {
    try {
      startLoading({
        id: "saving-theme",
        title: "Saving Theme",
        message: "Wait while your theme is being saved",
      });

      form.validate();

      const theme = await saveTheme(values, projectId);
      console.log(values);
      stopLoading({
        id: "saving-theme",
        title: "Theme Saved",
        message: "The theme was saved successfully",
      });
    } catch (error) {
      stopLoading({
        id: "saving-theme",
        title: "Saving Theme Failed",
        message: "Validation failed",
      });
    }
  };

  const setFontValue = (key: string, value: string) => {
    const index = fontTags.findIndex((ft) => ft.value === currentFontTag);
    form.setFieldValue(`fonts.${index}`, {
      ...form.values.fonts[index],
      [key]: value,
    });
  };

  const currentFont = form.values.fonts.find((f) => f.tag === currentFontTag);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Stack spacing="xs">
          {/* {initialValues?.colors &&
            initialValues?.colors.map(({ name, hex, isDefault }, index) => (
              <ColorSelector
                key={`color-${name}`}
                isDefault={isDefault}
                name={name}
                hex={hex}
                onChange={(value) => {
                  form.setFieldValue(`colors.${index}`, { ...value });
                }}
              />
            ))} 
          <Button
            type="button"
            fullWidth
            onClick={() =>
              form.insertListItem("colors", {
                name: "",
                hex: "",
                isDefault: false,
              })
            }
          >
            Add Colour
          </Button>
          */}
        </Stack>
        <Stack spacing="xs">
          <SegmentedControl
            fullWidth
            size="xs"
            data={fontTags}
            onChange={(value: string) => {
              const index = fontTags.findIndex((ft) => ft.value === value);
              form.setFieldValue(`fonts.${index}`, {
                ...form.values.fonts[index],
                tag: value,
              });
              setCurrentFontTag(value);
            }}
          />
          <Select
            label="Family"
            placeholder="Type to search"
            value={currentFont?.fontFamily}
            data={fonts.map((f) => f)}
            onChange={(value: string) => {
              setFontValue("fontFamily", value);
            }}
          />
          <Flex gap="sm" align="center">
            <Select
              value={currentFont?.fontWeight}
              label="Weight"
              data={fontWeights}
              onChange={(value: string) => {
                setFontValue("fontWeight", value);
              }}
            />

            <UnitInput
              label="Size"
              defaultValue={currentFont?.fontSize}
              onChange={(value: string) => {
                setFontValue("fontSize", value);
              }}
            />
          </Flex>
          <Flex align="center" gap="sm">
            <UnitInput
              label="Line Height"
              defaultValue={currentFont?.lineHeight}
              onChange={(value: string) => {
                setFontValue("lineHeight", value);
              }}
            />
            <UnitInput
              label="Letter Spacing"
              defaultValue={currentFont?.letterSpacing}
              onChange={(value: string) => {
                setFontValue("letterSpacing", value);
              }}
            />
          </Flex>
        </Stack>

        <Box>
          <Text size="sm" weight="500">
            Responsive Breakpoints
          </Text>
          <Stack spacing="xs">
            {form.values.responsiveBreakpoints &&
              form.values.responsiveBreakpoints.map(
                ({ type, breakpoint }, index) => (
                  <Flex key={index} align="center" gap="sm">
                    <Flex direction="column">
                      <TextInput value={type} disabled />
                    </Flex>
                    <Flex direction="column">
                      <UnitInput
                        value={breakpoint as any}
                        onChange={(value) =>
                          form.setFieldValue(
                            `responsiveBreakpoints.${index}.breakpoint`,
                            value
                          )
                        }
                      />
                    </Flex>
                  </Flex>
                )
              )}
          </Stack>
        </Box>
        <Stack spacing="xs">
          <TextInput
            label="Favicon"
            placeholder="https://example.com/favicon.ico"
            defaultValue={form.values.faviconUrl}
            {...form.getInputProps("faviconUrl")}
          />
          <TextInput
            label="Logo"
            placeholder="https://example.com/logo.png"
            defaultValue={form.values.logoUrl}
            {...form.getInputProps("logoUrl")}
          />
        </Stack>
        <Stack spacing="xs">
          <UnitInput
            label="Default border edges"
            defaultValue={form.values.defaultBorderRadius}
            {...form.getInputProps("defaultBorderRadius")}
          />
          <UnitInput
            label="Default spacing"
            defaultValue={form.values.defaultSpacing}
            {...form.getInputProps("defaultSpacing")}
          />
        </Stack>
        <Button type="submit" size="sm" fullWidth my="xl">
          Save
        </Button>
      </Stack>
    </form>
  );
};
