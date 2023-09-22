import { InformationAlert } from "@/components/Alerts";
import BackButton from "@/components/BackButton";
import { ColorSelector } from "@/components/ColorSelector";
import NextButton from "@/components/NextButton";
import { saveTheme } from "@/requests/themes/mutations";
import { getTheme } from "@/requests/themes/queries";
import { Color, ThemeResponse } from "@/requests/themes/types";
import { useEditorStore } from "@/stores/editor";
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
  MantineProvider,
  Select,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBrush } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
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

  const userTheme = useQuery({
    queryKey: ["theme"],
    queryFn: () => getTheme(projectId),
    enabled: !!themeResponse,
  });

  useEffect(() => {
    if (userTheme.isFetched) {
      setTheme({
        ...theme,
        colors: {
          ...theme.colors,
          ...themeResponse?.colors.reduce((userColors, color) => {
            return {
              ...userColors,
              [color.name]: [
                theme.fn.lighten(color.hex, 0.9),
                theme.fn.lighten(color.hex, 0.8),
                theme.fn.lighten(color.hex, 0.7),
                theme.fn.lighten(color.hex, 0.6),
                theme.fn.lighten(color.hex, 0.5),
                theme.fn.lighten(color.hex, 0.4),
                color.hex,
                theme.fn.darken(color.hex, 0.1),
                theme.fn.darken(color.hex, 0.2),
                theme.fn.darken(color.hex, 0.3),
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
        !isWebsite(value) ? "Must be a valid website URL" : null,
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
        title: "Theme Saved",
        message: "Your brand was saved successfully",
      });
      nextStep();
    } catch (error) {
      stopLoading({
        id: "saving",
        title: "Theme Failed",
        message: "Validation failed",
        isError: true,
      });
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  const onSubmit = async (values: BrandingParams) => {
    try {
      if (!isWebsite(websiteUrl)) {
        setWebsiteUrlError("Must be a valid website URL");
        return;
      }

      setIsLoading && setIsLoading(true);
      startLoading({
        id: "creating",
        title: "Fetching Your Brand",
        message: "Wait while we get your brand",
      });

      const theme = await saveTheme(projectId, {} as ThemeResponse, websiteUrl);

      setThemeResponse(theme);

      stopLoading({
        id: "creating",
        title: "Theme Fetched",
        message: "Your brand was fetched successfully",
      });
    } catch (error) {
      stopLoading({
        id: "creating",
        title: "Theme Failed",
        message: "Validation failed",
      });
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xl">
        <InformationAlert
          title="Let's get started!"
          text="Unlock the magic of AI! Answer a few questions and we'll tailor a unique experience just for you!"
        />
        <TextInput
          label="Website URL"
          description="Enter the URL of your website so we can fetch your brand. e.g. https://evalio.io"
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
          required
        />
        {themeResponse && (
          <Flex sx={{ width: "100%" }} justify="space-between" gap="xl">
            <Stack sx={{ width: "100%" }}>
              <Title order={4}>Main Colors</Title>
              {themeResponse?.colors &&
                themeResponse?.colors
                  .filter((t) => t.name === "Primary" || t.name === "Accent")
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
                Add Colour
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
                  component: { props: { children: <>Button Preview</> } },
                  renderTree,
                })}
              </MantineProvider>

              <Title order={6}>Link</Title>
              <MantineProvider withNormalizeCSS theme={theme}>
                {linkComponent.Component({
                  component: { props: { children: <>Link Preview</> } },
                  renderTree,
                })}
              </MantineProvider>
            </Stack>
          </Flex>
        )}
        <Divider></Divider>
        <Group position="apart">
          <BackButton onClick={prevStep}></BackButton>
          <Flex gap="lg" align="end">
            <Anchor onClick={nextStep}>I don’t have a website, skip</Anchor>
            <Button
              type="submit"
              variant="light"
              loading={isLoading}
              disabled={websiteUrl === ""}
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
