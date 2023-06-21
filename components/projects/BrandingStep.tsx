import { InformationAlert } from "@/components/Alerts";
import { getTheme } from "@/requests/projects/queries";
import { ICON_SIZE } from "@/utils/config";
import { BrandingStepProps } from "@/utils/projectTypes";
import {
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconBrush } from "@tabler/icons-react";
import { useState } from "react";
import BackButton from "./BackButton";
import NextButton from "./NextButton";

export default function BrandingStep({
  prevStep,
  nextStep,
  isLoading,
  startLoading,
  stopLoading,
  projectId,
}: BrandingStepProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteUrlError, setWebsiteUrlError] = useState("");

  function isWebsite(value: string): boolean {
    return /^https?:\/\/.+/i.test(value);
  }

  const fetchTheme = async () => {
    if (!isWebsite(websiteUrl)) {
      setWebsiteUrlError("Must be a valid website URL");
      return;
    }

    try {
      startLoading({
        id: "creating-theme",
        title: "Fetching Your Brand",
        message: "Wait while we get your brand",
      });

      const theme = await getTheme(projectId, websiteUrl);

      stopLoading({
        id: "creating-theme",
        title: "Project Created",
        message: "Your brand was fetched successfully",
      });
    } catch (error) {
      stopLoading({
        id: "creating-theme",
        title: "Project Failed",
        message: "Validation failed",
      });
    }
  };

  return (
    <Stack spacing="xl">
      <InformationAlert
        title="Let's get started!"
        text="Unlock the magic of AI! Answer a few questions and we'll tailor a unique experience just for you!"
      />
      <TextInput
        label="Website URL"
        description="Enter the URL of your website so we can fetch your brand"
        error={websiteUrlError} // Show error message if it exists
        onChange={(event) => {
          setWebsiteUrl(event.currentTarget.value);
          if (!isWebsite(event.currentTarget.value)) {
            setWebsiteUrlError("Must be a valid website URL");
          } else {
            setWebsiteUrlError(""); // Clear error message when valid URL is entered
          }
        }}
        withAsterisk={false}
      />
      <Flex>
        <Button
          variant="light"
          leftIcon={<IconBrush size={ICON_SIZE} />}
          onClick={fetchTheme}
          loading={isLoading}
          disabled={isLoading}
        >
          Fetch Brand
        </Button>
      </Flex>
      <Divider></Divider>
      <Group position="apart">
        <BackButton onClick={prevStep}></BackButton>
        <Flex gap="lg" align="end">
          <Anchor onClick={nextStep}>I don’t have a website, skip</Anchor>
          <NextButton
            onClick={nextStep}
            isLoading={isLoading}
            disabled={isLoading}
          ></NextButton>
        </Flex>
      </Group>
    </Stack>
  );
}
