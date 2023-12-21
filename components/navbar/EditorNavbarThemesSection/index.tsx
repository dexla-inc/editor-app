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
import { ICON_SIZE, INPUT_SIZE } from "@/utils/config";
import { getGoogleFonts } from "@/utils/googleFonts";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
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
import { useState } from "react";
import { IconArrowsDiagonal2 } from "@tabler/icons-react";
import { useGoogleFonts } from "@flyyer/use-googlefonts";
import { SelectFont } from "@/components/navbar/EditorNavbarThemesSection/SelectFont";
import { TypographyModal } from "@/components/navbar/EditorNavbarThemesSection/TypographyModal";
import { useDisclosure } from "@mantine/hooks";

type EditorNavbarThemesSectionProps = {
  isActive: boolean;
};

export const fontWeightLabels = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black",
};

export const pixelMetrics = Array.from({ length: 26 }, (_, index) =>
  String(index * 4),
);

export const EditorNavbarThemesSection =
  ({}: EditorNavbarThemesSectionProps) => {
    const router = useRouter();
    const startLoading = useAppStore((state) => state.startLoading);
    const stopLoading = useAppStore((state) => state.stopLoading);
    const [currentFontIndex, setCurrentFontIndex] = useState<number>(0);
    const mantineTheme = useMantineTheme();
    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure(false);

    const { usersTheme, setUsersTheme } = useEditorStore((state) => ({
      usersTheme: state.theme,
      setUsersTheme: state.setTheme,
    }));

    const projectId = router.query.id as string;

    useQuery({
      queryKey: ["theme"],
      queryFn: async () => {
        const theme = await getTheme(projectId);
        form.setValues(theme);
      },
      enabled: !!projectId,
    });

    const { data: googleFontsData = [] } = useQuery({
      queryKey: ["fonts"],
      queryFn: () => getGoogleFonts(),
    });

    const { mutate } = useMutation(saveTheme, {
      onMutate: () => {
        startLoading({
          id: "saving-brand",
          title: "Saving Brand",
          message: "Wait while your brand is being saved",
        });

        form.validate();

        return {};
      },
      onError: (error) => {
        console.error(error);
        stopLoading({
          id: "saving-brand",
          title: "Saving Brand Failed",
          message: "Validation failed",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["theme"]);
        stopLoading({
          id: "saving-brand",
          title: "Brand Saved",
          message: "The brand was saved successfully",
        });
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

    useGoogleFonts(
      [form.values.defaultFont, form.values.fonts[0]?.fontFamily]
        .filter(Boolean)
        .map((family) => ({ family: family ?? "", styles: ["100...900"] })),
    );

    const onSubmit = async (values: ThemeResponse) => {
      mutate({ params: values, projectId: projectId });
    };

    const selectedTagFontWeights =
      googleFontsData
        .find(
          (f: any) =>
            f.family === form.values.fonts[currentFontIndex]?.fontFamily,
        )
        ?.variants?.filter((v: string) => !isNaN(Number(v))) || [];

    const weightsList = selectedTagFontWeights.map(
      (v: keyof typeof fontWeightLabels) => ({
        label: fontWeightLabels[v],
        value: v,
      }),
    );

    return (
      <form onSubmit={form.onSubmit(onSubmit)}>
        <>
          <TypographyModal
            controls={{ opened, close }}
            form={form}
            onSubmit={form.onSubmit(onSubmit)}
            weightsList={weightsList}
          />
          <Stack spacing="xl">
            <Stack spacing={4}>
              <Title order={6} fw={600}>
                Color palette
              </Title>
              {form.values?.colors &&
                form.values?.colors.map(
                  ({ friendlyName, hex, name }, index) => (
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
                  ),
                )}

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
            <Stack>
              <Group position="apart">
                <Title order={6} fw={600}>
                  Typography
                </Title>

                <ActionIcon onClick={open} variant="default" radius="xs">
                  <IconArrowsDiagonal2
                    style={{ transform: "rotate(45deg)" }}
                    size={ICON_SIZE}
                  />
                </ActionIcon>
              </Group>
              <SelectFont
                label="Default Font Family"
                {...form.getInputProps("defaultFont")}
                onChange={(value: string) => {
                  form.setFieldValue(`defaultFont`, value);
                  form.values.fonts.forEach((font, index) => {
                    if (!font.tag.toLowerCase().startsWith("h")) {
                      form.setFieldValue(`fonts.${index}.fontFamily`, value);
                    }
                  });
                }}
              />
              <SelectFont
                label="Headings Font Family"
                value={form.values.fonts[0]?.fontFamily}
                onChange={(value: string) => {
                  form.values.fonts.forEach((font, index) => {
                    if (font.tag.toLowerCase().startsWith("h")) {
                      form.setFieldValue(`fonts.${index}.fontFamily`, value);
                    }
                  });
                }}
              />
              <SegmentedControl
                fullWidth
                size={INPUT_SIZE}
                data={form.values.fonts.map((f) => f.tag).filter(Boolean)}
                value={form.values.fonts[currentFontIndex]?.tag}
                onChange={(value: string) => {
                  const index = form.values.fonts.findIndex(
                    (ft) => ft.tag === value,
                  );
                  setCurrentFontIndex(index);
                }}
              />
              <Flex gap="sm" align="center">
                <Select
                  label="Weight"
                  data={weightsList}
                  {...form.getInputProps(
                    `fonts.${currentFontIndex}.fontWeight`,
                  )}
                  size={INPUT_SIZE}
                />
                <Select
                  label="Size"
                  data={pixelMetrics}
                  {...form.getInputProps(`fonts.${currentFontIndex}.fontSize`)}
                  size={INPUT_SIZE}
                />
              </Flex>
              <Flex align="center" gap="sm">
                <Select
                  label="Line Height"
                  data={pixelMetrics}
                  {...form.getInputProps(
                    `fonts.${currentFontIndex}.lineHeight`,
                  )}
                  value={
                    form.values.fonts[currentFontIndex]?.lineHeight === 1
                      ? "0"
                      : String(
                          Math.round(
                            (Number(
                              form.values.fonts[currentFontIndex]?.lineHeight,
                            ) -
                              1) *
                              100,
                          ),
                        )
                  }
                  onChange={(value) => {
                    form.setFieldValue(
                      `fonts.${currentFontIndex}.lineHeight`,
                      String(Number(value) / 100 + 1),
                    );
                  }}
                  size={INPUT_SIZE}
                />
                <Select
                  label="Letter Spacing"
                  data={pixelMetrics}
                  {...form.getInputProps(
                    `fonts.${currentFontIndex}.letterSpacing`,
                  )}
                  size={INPUT_SIZE}
                />
              </Flex>
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
          </Stack>
          <Button type="submit" size="sm" fullWidth my="xl" compact>
            Save
          </Button>
        </>
      </form>
    );
  };
