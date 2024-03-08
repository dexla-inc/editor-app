import { AssetsTextInput } from "@/components/AssetsTextInput";
import { CardStyleSelector } from "@/components/CardStyleSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { FaviconUrl } from "@/components/FaviconUrl";
import { FocusRingSelector } from "@/components/FocusRingSelector";
import { LoaderSelector } from "@/components/LoaderSelector";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { UnitInput } from "@/components/UnitInput";
import { SelectFont } from "@/components/navbar/EditorNavbarThemesSection/SelectFont";
import { TypographyModal } from "@/components/navbar/EditorNavbarThemesSection/TypographyModal";
import { useProjectQuery } from "@/hooks/reactQuery/useProjectQuery";
import { CardStyle } from "@/requests/projects/types";
import { saveTheme } from "@/requests/themes/mutations";
import { ThemeResponse } from "@/requests/themes/types";
import { useAppStore } from "@/stores/app";
import { useThemeStore } from "@/stores/theme";
import { ICON_SIZE, INPUT_SIZE } from "@/utils/config";
import { gapSizes, inputSizes, radiusSizes } from "@/utils/defaultSizes";
import { getGoogleFonts } from "@/utils/googleFonts";
import { useGoogleFonts } from "@flyyer/use-googlefonts";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Select,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowsMaximize } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

export const pixelMetrics = [
  0, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
  42, 44, 46, 48, 54, 60, 66, 72,
].map((num) => `${num}px`);

export const EditorNavbarThemesSection =
  ({}: EditorNavbarThemesSectionProps) => {
    const router = useRouter();
    const startLoading = useAppStore((state) => state.startLoading);
    const stopLoading = useAppStore((state) => state.stopLoading);
    const [currentFontIndex, setCurrentFontIndex] = useState<number>(0);
    const mantineTheme = useMantineTheme();

    const [opened, { open, close }] = useDisclosure(false);

    const usersTheme = useThemeStore((state) => state.theme);
    const setUsersTheme = useThemeStore((state) => state.setTheme);

    const projectId = router.query.id as string;

    const { data: project, refetch } = useProjectQuery(projectId);
    const userTheme = project?.branding;

    useEffect(() => {
      if (userTheme) form.setValues(userTheme);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userTheme]);

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
          isError: true,
        });
      },
      onSuccess: () => {
        refetch();
        stopLoading({
          id: "saving-brand",
          title: "Brand Saved",
          message: "The brand was saved successfully",
        });
      },
    });

    const form = useForm<ThemeResponse>({
      initialValues: {
        colors: userTheme?.colors ?? [],
        fonts: userTheme?.fonts ?? [],
        responsiveBreakpoints: userTheme?.responsiveBreakpoints ?? [],
        faviconUrl: userTheme?.faviconUrl ?? "",
        logoUrl: userTheme?.logoUrl ?? "",
        logos: userTheme?.logos ?? [],
        defaultRadius: userTheme?.defaultRadius ?? "sm",
        defaultSpacing: userTheme?.defaultSpacing ?? "md",
        inputSize: userTheme?.inputSize ?? "sm",
        cardStyle: userTheme?.cardStyle ?? "OUTLINED_ROUNDED",
        loader: userTheme?.loader ?? "OVAL",
        focusRing: userTheme?.focusRing ?? "DEFAULT",
        hasCompactButtons: userTheme?.hasCompactButtons ?? true,
        defaultFont: userTheme?.defaultFont ?? "Arial, sans-serif",
        theme: userTheme?.theme ?? "LIGHT",
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
        <TypographyModal
          controls={{ opened, close }}
          form={form}
          onSubmit={form.onSubmit(onSubmit)}
          weightsList={weightsList}
        />
        <Stack spacing="xl" p="xs" pr={0}>
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
          <Stack>
            <Group position="apart">
              <Title order={6} fw={600}>
                Typography
              </Title>

              <ActionIcon onClick={open} variant="default" radius="xs">
                <IconArrowsMaximize
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
            <Select
              label="Tag"
              size={INPUT_SIZE}
              value={form.values.fonts[currentFontIndex]?.tag}
              onChange={(value) => {
                const index = form.values.fonts.findIndex(
                  (ft) => ft.tag === value,
                );
                setCurrentFontIndex(index);
              }}
              data={form.values.fonts
                .map((font) => ({
                  value: font.tag,
                  label: font.tag,
                }))
                .filter((option) => Boolean(option.value))}
            />
            <Flex gap="sm" align="center">
              <Select
                label="Weight"
                data={weightsList}
                {...form.getInputProps(`fonts.${currentFontIndex}.fontWeight`)}
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
                {...form.getInputProps(`fonts.${currentFontIndex}.lineHeight`)}
                size={INPUT_SIZE}
              />
              <UnitInput
                label="Letter Spacing"
                size={INPUT_SIZE}
                options={[{ value: "px", label: "px" }]}
                {...form.getInputProps(
                  `fonts.${currentFontIndex}.letterSpacing`,
                )}
              />
            </Flex>
            <SegmentedControlInput
              label="Type"
              data={[
                {
                  label: "TITLE",
                  value: "TITLE",
                },
                {
                  label: "TEXT",
                  value: "TEXT",
                },
              ]}
              {...form.getInputProps(`fonts.${currentFontIndex}.type`)}
            />
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
            <SegmentedControlSizes
              sizing={radiusSizes}
              label="Default border edges"
              defaultValue={form.values.defaultRadius}
              {...form.getInputProps("defaultRadius")}
            />
            <SegmentedControlSizes
              sizing={gapSizes}
              label="Default spacing"
              defaultValue={form.values.defaultSpacing}
              {...form.getInputProps("defaultSpacing")}
            />
            <SegmentedControlSizes
              sizing={inputSizes}
              label="Input size"
              defaultValue={form.values.inputSize}
              {...form.getInputProps("inputSize")}
            />
            <SegmentedControlYesNo
              label="Compact buttons"
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
            <AssetsTextInput
              label="Logo"
              placeholder="https://example.com/logo.png"
              defaultValue={form.values.logoUrl}
              {...form.getInputProps("logoUrl")}
            />
            <FaviconUrl />
          </Stack>
        </Stack>
        <Button type="submit" size="sm" fullWidth my="xl" compact>
          Save
        </Button>
      </form>
    );
  };

function stripUnit(value: string) {
  if (!value) return 0;
  const numericValue = parseFloat(value);
  return isNaN(numericValue) ? 0 : numericValue;
}
