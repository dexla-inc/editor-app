import { InformationAlert } from "@/components/Alerts";
import BackButton from "@/components/BackButton";
import NextButton from "@/components/NextButton";
import { getTheme } from "@/requests/themes/queries";
import {
  LoadingStore,
  NextStepperClickEvent,
  PreviousStepperClickEvent,
  isWebsite,
} from "@/utils/dashboardTypes";
import { Anchor, Divider, Flex, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { SetStateAction, useState } from "react";

export interface BrandingStepProps
  extends LoadingStore,
    NextStepperClickEvent,
    PreviousStepperClickEvent {
  projectId: string;
  websiteUrl: string;
  setWebsiteUrl: (value: SetStateAction<string>) => void;
}

type BrandingParams = {
  websiteUrl: string;
};

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
}: BrandingStepProps) {
  const [websiteUrlError, setWebsiteUrlError] = useState("");

  const form = useForm({
    initialValues: {
      websiteUrl: "",
    },
    validate: {
      websiteUrl: (value) =>
        !isWebsite(value) ? "Must be a valid website URL" : null,
    },
  });

  const onSubmit = async (values: BrandingParams) => {
    try {
      setIsLoading && setIsLoading(true);
      startLoading({
        id: "creating-theme",
        title: "Fetching Your Brand",
        message: "Wait while we get your brand",
      });

      await getTheme(projectId, values.websiteUrl);

      stopLoading({
        id: "creating-theme",
        title: "Project Created",
        message: "Your brand was fetched successfully",
      });
      nextStep();
    } catch (error) {
      stopLoading({
        id: "creating-theme",
        title: "Project Failed",
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
          description="Enter the URL of your website so we can fetch your brand"
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
        <Divider></Divider>
        <Group position="apart">
          <BackButton onClick={prevStep}></BackButton>
          <Flex gap="lg" align="end">
            <Anchor onClick={nextStep}>I don’t have a website, skip</Anchor>
            <NextButton
              isSubmit
              isLoading={isLoading}
              disabled={isLoading}
            ></NextButton>
          </Flex>
        </Group>
      </Stack>
    </form>
  );
}
