import { updateProject } from "@/requests/projects/mutations";
import { getProject } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import { addDomainToVercel } from "@/utils/domains";
import { Button, Container, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  projectId: string;
};

export default function DomainSettings({ projectId }: Props) {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const form = useForm({
    initialValues: {
      domain: "",
      subDomain: "",
      friendlyName: "",
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      startLoading({ id: "domain", message: "Saving..." });
      const fullDomain = values.subDomain
        ? `${values.subDomain}.${values.domain}`
        : values.domain;

      const response = await fetch(`/api/domain/addToVercel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: fullDomain,
        }),
      });

      const json = await response.json();
      console.log({ response: json });

      await updateProject(projectId, values);
      stopLoading({ id: "domain", message: "Saved!" });
    } catch (error) {
      console.error(error);
      stopLoading({
        id: "domain",
        message: "Somethign went wrong",
        isError: true,
      });
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      const project = await getProject(projectId);
      form.setFieldValue("friendlyName", project.friendlyName);
      form.setFieldValue("domain", project.domain ?? "");
      form.setFieldValue("subDomain", project.subDomain ?? "");

      const fullDomain = project.subDomain
        ? `${project.subDomain}.${project.domain}`
        : project.domain;

      try {
        const verifyResponse = await fetch(
          `/api/domain/verify?domain=${fullDomain}`,
        );
        const json = await verifyResponse.json();
        console.log({ verifyResponse: json });
      } catch (error) {
        console.log({ error });
      }
    };

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <Container py="xl">
      <Stack spacing="xl">
        <Title order={2}>Domain Settings</Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Domain"
              placeholder="Your custom domain"
              {...form.getInputProps("domain")}
            />
            <TextInput
              label="Subdomain"
              placeholder="Your custom subdomain"
              {...form.getInputProps("subDomain")}
            />
            <Button type="submit">Save</Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
