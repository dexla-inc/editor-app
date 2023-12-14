import { CardStyleSelector } from "@/components/CardStyleSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { FocusRingSelector } from "@/components/FocusRingSelector";
import { LoaderSelector } from "@/components/LoaderSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { UnitInput } from "@/components/UnitInput";
import { CardStyle } from "@/requests/projects/types";
import { saveTheme } from "@/requests/themes/mutations";
import { getTheme } from "@/requests/themes/queries";
import { ThemeResponse } from "@/requests/themes/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { INPUT_SIZE } from "@/utils/config";
import { getGoogleFonts } from "@/utils/googleFonts";
import {
  Box,
  Button,
  Flex,
  SegmentedControl,
  Select,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

type EditorNavbarThemesSectionProps = {
  isActive: boolean;
};

export const EditorNavbarThemesSection = ({
  isActive,
}: EditorNavbarThemesSectionProps) => {
  const router = useRouter();
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const [currentFontTag, setCurrentFontTag] = useState<string>("H1");
  const [fonts, setFonts] = useState<string[]>([]);
  const [allFonts, setAllFonts] = useState<string[]>([]);
  const [fontSearch, setFontSearch] = useState("");
  const [headingFonts, setHeadingFonts] = useState<string[]>([]);
  const [headingFontSearch, setHeadingFontSearch] = useState("");
  const mantineTheme = useMantineTheme();
  const queryClient = useQueryClient();

  const { usersTheme, setUsersTheme } = useEditorStore((state) => ({
    usersTheme: state.theme,
    setUsersTheme: state.setTheme,
  }));

  const projectId = router.query.id as string;

  const userTheme = useQuery({
    queryKey: ["theme"],
    queryFn: () => getTheme(projectId),
    enabled: !!projectId && isActive,
  });

  const { mutate } = useMutation(saveTheme, {
    onSettled(_, err) {
      if (err) {
        console.error(err);
      }

      queryClient.invalidateQueries(["theme"]);
    },
  });

  const form = useForm<ThemeResponse>({
    initialValues: {
      colors: [],
      fonts: [],
      responsiveBreakpoints: [],
      faviconUrl: "",
      logoUrl: "",
      logos: [],
      defaultRadius: "sm",
      defaultSpacing: "md",
      cardStyle: "OUTLINED_ROUNDED",
      loader: "OVAL",
      focusRing: "DEFAULT",
      hasCompactButtons: true,
      defaultFont: "Arial, sans-serif",
      theme: "LIGHT",
    },
    validate: {},
  });

  useEffect(() => {
    if (userTheme.isFetched) {
      form.setValues(userTheme.data as ThemeResponse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTheme.isFetched]);

  const onSubmit = async (values: ThemeResponse) => {
    try {
      startLoading({
        id: "saving-theme",
        title: "Saving Theme",
        message: "Wait while your theme is being saved",
      });

      form.validate();

      await mutate({ params: values, projectId: projectId });

      stopLoading({
        id: "saving-theme",
        title: "Theme Saved",
        message: "The theme was saved successfully",
      });
    } catch (error) {
      console.error(error);
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

  const setHeadingsFontFamily = (value: string) => {
    fontTags.forEach((_, index) => {
      form.setFieldValue(`fonts.${index}`, {
        ...form.values.fonts[index],
        fontFamily: value,
      });
    });
  };

  const currentFont = form.values.fonts.find((f) => f.tag === currentFontTag);

  useEffect(() => {
    const getFonts = async () => {
      try {
        const googleFonts = await getGoogleFonts();
        if (googleFonts) {
          const fonts = googleFonts.map((f: any) => f.family);
          setAllFonts(fonts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getFonts();
  }, []);

  useEffect(() => {
    const filteredFonts = allFonts
      .filter((f) => f.toLowerCase().includes(fontSearch.toLowerCase()))
      .slice(0, 10);
    setFonts(filteredFonts);
  }, [allFonts, fontSearch]);

  useEffect(() => {
    const filteredFonts = allFonts
      .filter((f) => f.toLowerCase().includes(headingFontSearch.toLowerCase()))
      .slice(0, 10);
    setHeadingFonts(filteredFonts);
  }, [allFonts, headingFontSearch]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <>
        <Stack spacing="xl">
          <Stack spacing={4}>
            <Title order={6} fw={600}>
              Color palette
            </Title>
            {form.values?.colors &&
              form.values?.colors.map(({ friendlyName, hex, name }, index) => (
                <ColorSelector
                  size={30}
                  key={`color-${name}`}
                  friendlyName={friendlyName}
                  hex={hex}
                  isDefault={form.values.colors[index].isDefault}
                  mantineTheme={mantineTheme}
                  onValueChange={(value) => {
                    form.setFieldValue(
                      `colors.${index}.friendlyName`,
                      value.friendlyName,
                    );
                    form.setFieldValue(`colors.${index}.hex`, value.hex);
                    if (!form.values.colors[index].isDefault) {
                      form.setFieldValue(
                        `colors.${index}.name`,
                        value.friendlyName,
                      );
                    }
                  }}
                  deleteColor={() => {
                    if (!form.values.colors[index].isDefault) {
                      form.removeListItem("colors", index);
                    }
                  }}
                />
              ))}

            <Button
              mt="md"
              type="button"
              variant="outline"
              fullWidth
              compact
              onClick={() =>
                form.insertListItem("colors", {
                  name: "",
                  friendlyName: "",
                  hex: "",
                  brightness: 0,
                  isDefault: false,
                })
              }
            >
              Add Color
            </Button>
            <Button type="submit" size="sm" fullWidth compact>
              Save
            </Button>
          </Stack>
          <Stack spacing={4}>
            <Title order={6} fw={600}>
              General defaults
            </Title>
            <CardStyleSelector
              defaultValue={form.values.cardStyle}
              {...form.getInputProps("cardStyle")}
              onChange={(value) => {
                form.setFieldValue("cardStyle", value as CardStyle);
                setUsersTheme({
                  ...usersTheme,
                  cardStyle: value as CardStyle,
                });
              }}
              size={INPUT_SIZE}
            />

            <SizeSelector
              label="Default border edges"
              defaultValue={form.values.defaultRadius}
              {...form.getInputProps("defaultRadius")}
              size={INPUT_SIZE}
            />
            <SizeSelector
              label="Default spacing"
              defaultValue={form.values.defaultSpacing}
              {...form.getInputProps("defaultSpacing")}
              size={INPUT_SIZE}
            />
            <SwitchSelector
              topLabel="Compact buttons"
              checked={form.values.hasCompactButtons}
              {...form.getInputProps("hasCompactButtons")}
            />
            <LoaderSelector
              defaultValue={form.values.loader}
              {...form.getInputProps("loader")}
              size={INPUT_SIZE}
            />
            <FocusRingSelector
              defaultValue={form.values.focusRing}
              {...form.getInputProps("focusRing")}
              size={INPUT_SIZE}
            />

            <TextInput
              label="Favicon"
              placeholder="https://example.com/favicon.ico"
              defaultValue={form.values.faviconUrl}
              {...form.getInputProps("faviconUrl")}
              size={INPUT_SIZE}
            />
            <TextInput
              label="Logo"
              placeholder="https://example.com/logo.png"
              defaultValue={form.values.logoUrl}
              {...form.getInputProps("logoUrl")}
              size={INPUT_SIZE}
            />
          </Stack>
          <Stack>
            <Title order={6} fw={600}>
              Fonts
            </Title>
            <Select
              label="Default Font Family"
              placeholder="Type to search"
              value={form?.values?.defaultFont}
              data={fonts}
              onChange={(value: string) => {
                form.setFieldValue("defaultFont", value);
              }}
              searchable
              searchValue={fontSearch}
              onSearchChange={setFontSearch}
              size={INPUT_SIZE}
            />
            <Select
              label="Headings Font Family"
              placeholder="Type to search"
              value={currentFont?.fontFamily}
              data={headingFonts}
              onChange={(value: string) => {
                setHeadingsFontFamily(value);
              }}
              searchable
              searchValue={headingFontSearch}
              onSearchChange={setHeadingFontSearch}
              size={INPUT_SIZE}
            />
            <SegmentedControl
              fullWidth
              size={INPUT_SIZE}
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
            <Flex gap="sm" align="center">
              <Select
                value={currentFont?.fontWeight}
                label="Weight"
                data={fontWeights}
                onChange={(value: string) => {
                  setFontValue("fontWeight", value);
                }}
                size={INPUT_SIZE}
              />
              <UnitInput
                label="Size"
                defaultValue={currentFont?.fontSize}
                onChange={(value: string) => {
                  setFontValue("fontSize", value);
                }}
                size={INPUT_SIZE}
              />
            </Flex>
            <Flex align="center" gap="sm">
              <UnitInput
                label="Line Height"
                defaultValue={currentFont?.lineHeight}
                onChange={(value: string) => {
                  setFontValue("lineHeight", value);
                }}
                size={INPUT_SIZE}
              />
              <UnitInput
                label="Letter Spacing"
                defaultValue={currentFont?.letterSpacing}
                onChange={(value: string) => {
                  setFontValue("letterSpacing", value);
                }}
                size={INPUT_SIZE}
              />
            </Flex>
          </Stack>
          <Box>
            <Stack spacing="xs">
              <Title order={6} fw={600}>
                Responsive Breakpoints
              </Title>
              {form.values.responsiveBreakpoints &&
                form.values.responsiveBreakpoints.map(
                  ({ type, breakpoint }, index) => (
                    <Flex key={index} align="center" gap="sm">
                      <Flex direction="column">
                        <TextInput value={type} disabled size={INPUT_SIZE} />
                      </Flex>
                      <Flex direction="column">
                        <UnitInput
                          value={breakpoint as any}
                          onChange={(value) =>
                            form.setFieldValue(
                              `responsiveBreakpoints.${index}.breakpoint`,
                              value,
                            )
                          }
                          size={INPUT_SIZE}
                        />
                      </Flex>
                    </Flex>
                  ),
                )}
            </Stack>
          </Box>
        </Stack>
        <Button type="submit" size="sm" fullWidth my="xl" compact>
          Save
        </Button>
      </>
    </form>
  );
};
