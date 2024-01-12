import BackButton from "@/components/BackButton";
import { ColorSelector } from "@/components/ColorSelector";
import NextButton from "@/components/NextButton";
import { useGetThemeQuery } from "@/hooks/reactQuery/useThemeQuery";
import { generateThemeFromScreenshot } from "@/requests/ai/queries";
import { saveBasicTheme, saveTheme } from "@/requests/themes/mutations";
import { Color, ThemeResponse } from "@/requests/themes/types";
import { useEditorStore } from "@/stores/editor";
import { convertToBase64 } from "@/utils/common";
import { componentMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import {
  LoadingStore,
  NextStepperClickEvent,
  PreviousStepperClickEvent,
  fonts,
  isWebsite,
} from "@/utils/dashboardTypes";
import { Component } from "@/utils/editor";
import {
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  MantineProvider,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBrush } from "@tabler/icons-react";
import { SetStateAction, useEffect, useState } from "react";

export interface BrandingStepProps
  extends LoadingStore,
    NextStepperClickEvent,
    PreviousStepperClickEvent {
  projectId: string;
  websiteUrl: string;
  setWebsiteUrl: (value: SetStateAction<string>) => void;
  themeResponse?: ThemeResponse;
  setThemeResponse: (value: SetStateAction<ThemeResponse | undefined>) => void;
  screenshots: File[];
}

type BrandingParams = {
  websiteUrl: string;
};

function updateThemeResponseColor(
  themeResponse: ThemeResponse,
  colorIndex: number,
  updatedColor: Color,
): ThemeResponse {
  // Deep clone the themeResponse object
  const updatedThemeResponse: ThemeResponse = JSON.parse(
    JSON.stringify(themeResponse),
  );

  // Update the color
  updatedThemeResponse.colors[colorIndex] = updatedColor;

  return updatedThemeResponse;
}

function updateThemeResponseFontFamily(
  themeResponse: ThemeResponse,
  fontFamily: string,
): ThemeResponse {
  // Deep clone the themeResponse object
  const updatedThemeResponse: ThemeResponse = JSON.parse(
    JSON.stringify(themeResponse),
  );

  // Update the fontFamily for all fonts
  updatedThemeResponse.fonts.forEach((font) => {
    font.fontFamily = fontFamily;
  });

  return updatedThemeResponse;
}

export default function BrandingStep({
  prevStep,
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  projectId,
  websiteUrl,
  setWebsiteUrl,
  themeResponse,
  setThemeResponse,
  screenshots,
}: BrandingStepProps) {
  const [websiteUrlError, setWebsiteUrlError] = useState("");
  const mantineTheme = useMantineTheme();

  const renderTree = (component: Component) => {
    const componentToRender = componentMapper[component.name];

    return componentToRender?.Component({ component, renderTree });
  };

  const buttonComponent = componentMapper["Button"];

  const linkComponent = componentMapper["Link"];
  const theme = useEditorStore((state) => state.theme);
  const setTheme = useEditorStore((state) => state.setTheme);
  const userTheme = useGetThemeQuery(projectId);

  const previews = screenshots.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        alt={file.name}
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        width={220}
        height={140}
        fit="cover"
      />
    );
  });

  const [selectedScreenshot, setSelectedScreenshot] = useState<
    number | undefined
  >();

  const selectScreenshot = (index: number) => {
    if (index === selectedScreenshot) {
      setSelectedScreenshot(undefined);
    } else {
      setSelectedScreenshot(index);
    }
  };

  useEffect(() => {
    if (userTheme.isFetched) {
      setTheme({
        ...theme,
        colors: {
          ...theme.colors,
          ...themeResponse?.colors.reduce((userColors, color) => {
            const hex = color.hex.substring(0, 7);
            return {
              ...userColors,
              [color.name]: [
                theme.fn.lighten(hex, 0.9),
                theme.fn.lighten(hex, 0.8),
                theme.fn.lighten(hex, 0.7),
                theme.fn.lighten(hex, 0.6),
                theme.fn.lighten(hex, 0.5),
                theme.fn.lighten(hex, 0.4),
                color.hex,
                theme.fn.darken(hex, 0.1),
                theme.fn.darken(hex, 0.2),
                theme.fn.darken(hex, 0.3),
              ],
            };
          }, {}),
        },
        primaryColor: "Primary",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTheme.isFetched, setTheme, themeResponse]);

  const form = useForm({
    initialValues: {
      websiteUrl: "",
    },
    validate: {
      websiteUrl: (value) =>
        value && !isWebsite(value) ? "Must be a valid website URL" : null,
    },
  });

  const next = async () => {
    try {
      setIsLoading && setIsLoading(true);
      startLoading({
        id: "saving",
        title: "Saving Your Brand",
        message: "Wait while we save your brand",
      });

      const theme = await saveTheme(projectId, themeResponse as ThemeResponse);

      stopLoading({
        id: "saving",
        title: "Brand Saved",
        message: "Your brand was saved successfully",
      });
      nextStep();
    } catch (error) {
      stopLoading({
        id: "saving",
        title: "Brand Failed",
        message: "Validation failed",
        isError: true,
      });
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  const onSubmit = async (values: BrandingParams) => {
    try {
      if (websiteUrl && !isWebsite(websiteUrl)) {
        setWebsiteUrlError("Must be a valid website URL");
        return;
      }

      setIsLoading && setIsLoading(true);
      startLoading({
        id: "creating",
        title: "Fetching Your Brand",
        message: "Wait while we get your brand",
      });

      // if selectedScreenshot is not null then get theme prompt
      let theme: ThemeResponse | undefined;

      if (selectedScreenshot !== undefined) {
        const screenshot = screenshots[selectedScreenshot];
        const base64Image = await convertToBase64(screenshot);

        const themeScreenshotResponse = await generateThemeFromScreenshot(
          "",
          base64Image,
        );

        theme = await saveBasicTheme(projectId, themeScreenshotResponse);
      } else {
        theme = await saveTheme(projectId, {} as ThemeResponse, websiteUrl);
      }

      setThemeResponse(theme);

      stopLoading({
        id: "creating",
        title: "Brand Fetched",
        message: "Your brand was fetched successfully",
      });
    } catch (error) {
      stopLoading({
        id: "creating",
        title: "Brand Failed",
        message: "Validation failed",
      });
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing={40} my={25}>
        {/* <InformationAlert
          title="Branding time!"
          text="We will fetch your brand from your website. If you don’t have a website, you can skip this step."
        /> */}
        <TextInput
          label="Website URL"
          description="Enter the URL of your website so we can fetch your brand. e.g. https://dexla.ai"
          placeholder="https://www.dexla.ai"
          error={websiteUrlError}
          value={websiteUrl}
          onChange={(event) => {
            const newUrl = event.currentTarget.value;
            setWebsiteUrl(newUrl);
            form.setFieldValue("websiteUrl", newUrl);
            if (!isWebsite(newUrl)) {
              setWebsiteUrlError("Must be a valid website URL");
            } else {
              setWebsiteUrlError("");
            }
          }}
        />
        {themeResponse && (
          <Flex sx={{ width: "100%" }} justify="space-between" gap="xl">
            <Stack sx={{ width: "100%" }}>
              <Title order={4}>Main Colors</Title>
              {themeResponse?.colors
                .filter(
                  (t) =>
                    t.name === "Primary" ||
                    t.name === "PrimaryText" ||
                    t.name === "Secondary" ||
                    t.name === "SecondaryText" ||
                    t.name === "Tertiary" ||
                    t.name === "TertiaryText",
                )
                .map(({ friendlyName, hex, name }, index) => (
                  <ColorSelector
                    key={`color-${name}`}
                    friendlyName={friendlyName}
                    hex={hex}
                    isDefault={themeResponse.colors[index].isDefault}
                    mantineTheme={mantineTheme}
                    onValueChange={(value) => {
                      setThemeResponse((prevThemeResponse) => {
                        if (!prevThemeResponse) {
                          return prevThemeResponse;
                        }

                        const updatedColor = {
                          ...prevThemeResponse.colors[index],
                          friendlyName: value.friendlyName,
                          hex: value.hex,
                          name: !prevThemeResponse.colors[index].isDefault
                            ? value.friendlyName
                            : prevThemeResponse.colors[index].name,
                        };

                        return updateThemeResponseColor(
                          prevThemeResponse,
                          index,
                          updatedColor,
                        );
                      });
                    }}
                  />
                ))}
              {/* <Button
                type="button"
                fullWidth
                onClick={() =>
                  form.insertListItem("colors", {
                    friendlyName: "",
                    name: "",
                    hex: "",
                    isDefault: false,
                  })
                }
              >
                Add Color
              </Button> */}
              <Title order={4}>Fonts</Title>
              <Select
                label="Family"
                placeholder="Type to search"
                value={themeResponse?.fonts[0].fontFamily}
                data={fonts.map((f) => f)}
                onChange={(value) => {
                  const updatedThemeResponse = updateThemeResponseFontFamily(
                    themeResponse,
                    value as string,
                  );
                  setThemeResponse(updatedThemeResponse);
                }}
              />
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Title order={4}>Preview</Title>
              <Title order={6}>Button</Title>
              <MantineProvider withNormalizeCSS theme={theme}>
                {buttonComponent.Component({
                  component: {
                    props: {
                      children: <>Button Preview</>,
                      textColor: "PrimaryText.6",
                    },
                  },
                  renderTree,
                })}
              </MantineProvider>

              <Title order={6}>Link</Title>
              <MantineProvider withNormalizeCSS theme={theme}>
                {linkComponent.Component({
                  component: {
                    props: { children: <>Link Preview</>, size: "sm" },
                  },
                  renderTree,
                })}
              </MantineProvider>
            </Stack>
          </Flex>
        )}
        {screenshots.length > 0 && (
          <>
            <Divider m="xs" label="Or" labelPosition="center" />
            <Stack spacing="xs">
              <Text size="sm" fw={500}>
                Choose a screenshot you want to use for your brand
              </Text>

              <SimpleGrid
                cols={4}
                breakpoints={[
                  { maxWidth: "md", cols: 3 },
                  { maxWidth: "sm", cols: 1 },
                ]}
              >
                {previews.map((preview, index) => (
                  <Paper
                    key={preview.key}
                    pos="relative"
                    sx={{
                      width: "220px",
                      borderRadius: 0,
                      ...(selectedScreenshot === index && {
                        boxShadow: `0 0 0 3px ${mantineTheme.colors.teal[6]}`,
                      }),
                      "&:hover > div": {
                        opacity: 1,
                      },
                    }}
                  >
                    {preview}
                    <Paper
                      display="flex"
                      onClick={() => selectScreenshot(index)}
                      sx={{
                        opacity: 0,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        borderRadius: 0,
                        width: "220px",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "opacity 0.3s ease",
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    ></Paper>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>
          </>
        )}
        <Group position="apart">
          <BackButton onClick={prevStep}></BackButton>
          <Flex gap="lg" align="end">
            {!themeResponse && (
              <Anchor
                onClick={async () => {
                  nextStep();
                }}
              >
                Skip
              </Anchor>
            )}
            <Button
              type="submit"
              variant="light"
              loading={isLoading}
              disabled={websiteUrl === "" && selectedScreenshot === undefined}
              leftIcon={<IconBrush size={ICON_SIZE} />}
            >
              {themeResponse ? "Refetch Brand" : "Get Brand"}
            </Button>
            {themeResponse && (
              <NextButton
                onClick={next}
                isLoading={isLoading}
                disabled={isLoading}
              ></NextButton>
            )}
          </Flex>
        </Group>
      </Stack>
    </form>
  );
}
