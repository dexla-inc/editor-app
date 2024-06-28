import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { EnvironmentTypes } from "@/requests/datasources/types";
import { patchProject } from "@/requests/projects/mutations";
import { ProjectUpdateParams } from "@/requests/projects/types";
import { useAppStore } from "@/stores/app";
import { convertToPatchParams } from "@/types/dashboardTypes";
import { Button, Container, Group, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { EnvironmentFormSection } from "./EnvironmentFormSection";

type Props = {
  projectId: string;
};

type FormProps = Pick<ProjectUpdateParams, "liveUrls">;

type SupportedEnvironmentTypes = Extract<
  EnvironmentTypes,
  "Staging" | "Production"
>;

const environments: SupportedEnvironmentTypes[] = ["Staging", "Production"];

const domainsToVerify: Partial<Record<SupportedEnvironmentTypes, string>> = {};

const verifyDomains = async (
  domains: Partial<Record<EnvironmentTypes, string>>,
) => {
  const results = await Promise.all(
    Object.keys(domains).map(async (env) => {
      const domain = domains[env as EnvironmentTypes];
      try {
        const verifyResponse = await fetch(
          `/api/domain/verify?domain=${domain}`,
        );
        const json = await verifyResponse.json();
        return { env: env as EnvironmentTypes, status: json.status };
      } catch (error) {
        console.error({ error });
        return { env: env as EnvironmentTypes, status: "Error" };
      }
    }),
  );
  return results;
};

export default function DomainSettings({ projectId }: Props) {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const { data: project } = useProjectQuery(projectId);

  const [verificationStatus, setVerificationStatus] = useState<
    Partial<Record<EnvironmentTypes, string>>
  >({
    Staging: "",
    Production: "",
  });

  const form = useForm<FormProps>({
    initialValues: {
      liveUrls: {
        Staging: {
          domain: "",
          subDomain: "",
        },
        Production: {
          domain: "",
          subDomain: "",
        },
      },
    },
  });

  useEffect(() => {
    if (project) {
      form.setValues({
        liveUrls: {
          Staging: {
            domain: project.liveUrls?.Staging?.domain || "",
            subDomain: project.liveUrls?.Staging?.subDomain || "",
          },
          Production: {
            domain: project.liveUrls?.Production?.domain || "",
            subDomain: project.liveUrls?.Production?.subDomain || "",
          },
        },
      });
    }
  }, [project]);

  const handleSubmit = async (values: FormProps) => {
    try {
      startLoading({ id: "domain", message: "Saving..." });

      const fullDomainStaging = values.liveUrls?.Staging?.subDomain
        ? `${values.liveUrls.Staging?.subDomain}.${values.liveUrls.Staging?.domain}`
        : values.liveUrls?.Staging?.domain;

      const fullDomainProduction = values.liveUrls?.Production?.subDomain
        ? `${values.liveUrls.Production?.subDomain}.${values.liveUrls.Production?.domain}`
        : values.liveUrls?.Production?.domain;

      await fetch(`/api/domain/addToVercel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: fullDomainStaging,
        }),
      });

      await fetch(`/api/domain/addToVercel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: fullDomainProduction,
        }),
      });

      const patchParams = convertToPatchParams<FormProps>(values);

      await patchProject(projectId, patchParams);
      stopLoading({ id: "domain", message: "Saved!" });

      const verifyResponseStaging = await fetch(
        `/api/domain/verify?domain=${fullDomainStaging}`,
      );
      const verifyJsonStaging = await verifyResponseStaging.json();

      const verifyResponseProduction = await fetch(
        `/api/domain/verify?domain=${fullDomainProduction}`,
      );
      const verifyJsonProduction = await verifyResponseProduction.json();

      setVerificationStatus({
        Staging: verifyJsonStaging.status,
        Production: verifyJsonProduction.status,
      });
    } catch (error) {
      console.error(error);
      stopLoading({
        id: "domain",
        message: "Something went wrong",
        isError: true,
      });
    }
  };

  const verifyDomain = async () => {
    if (project) {
      const domainsToVerify: Partial<
        Record<SupportedEnvironmentTypes, string>
      > = {};

      environments.forEach((env) => {
        const subDomain = project.liveUrls?.[env]?.subDomain;
        const domain = project.liveUrls?.[env]?.domain;
        const fullDomain = subDomain ? `${subDomain}.${domain}` : domain || "";

        if (domain && verificationStatus[env] !== "Valid Configuration") {
          domainsToVerify[env] = fullDomain;
        }
      });

      const verificationResults = await verifyDomains(domainsToVerify);

      const newVerificationStatus = { ...verificationStatus };

      verificationResults.forEach(({ env, status }) => {
        newVerificationStatus[env as SupportedEnvironmentTypes] = status;
      });

      setVerificationStatus(newVerificationStatus);
    }
  };

  useEffect(() => {
    verifyDomain();
  }, [project]);

  return (
    <Container py="xl">
      <Stack spacing="xl">
        <Title order={2}>Domain Settings</Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="lg">
            {(["Staging", "Production"] as EnvironmentTypes[]).map((env) => (
              <EnvironmentFormSection
                key={env}
                env={env}
                form={form}
                verificationStatus={verificationStatus}
              />
            ))}
          </Stack>
          <Group mt="md">
            <Button type="submit">Save</Button>
            <Button onClick={verifyDomain} variant="default">
              Refresh
            </Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
}
