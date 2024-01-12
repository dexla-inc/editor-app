import { InformationAlert, SuccessAlert } from "@/components/Alerts";
import { useProjectQuery } from "@/hooks/reactQuery/useProjectQuery";
import { patchProject } from "@/requests/projects/mutations";
import { useAppStore } from "@/stores/app";
import { convertToPatchParams } from "@/utils/dashboardTypes";
import {
  Button,
  Container,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
};

type FormProps = {
  domain: string;
  subDomain: string;
};

export default function DomainSettings({ projectId }: Props) {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const { data: project } = useProjectQuery(projectId);

  const [verificationStatus, setVerificationStatus] = useState("");
  const form = useForm<FormProps>({
    initialValues: {
      domain: "",
      subDomain: "",
    },
  });

  const handleSubmit = async (values: FormProps) => {
    try {
      startLoading({ id: "domain", message: "Saving..." });
      const fullDomain = values.subDomain
        ? `${values.subDomain}.${values.domain}`
        : values.domain;

      await fetch(`/api/domain/addToVercel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: fullDomain,
        }),
      });

      const patchParams = convertToPatchParams<FormProps>(values);

      await patchProject(projectId, patchParams);
      stopLoading({ id: "domain", message: "Saved!" });

      const verifyResponse = await fetch(
        `/api/domain/verify?domain=${fullDomain}`,
      );
      const verifyJson = await verifyResponse.json();
      setVerificationStatus(verifyJson.status);
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
      if (project) {
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
          setVerificationStatus(json.status);
        } catch (error) {
          console.error({ error });
        }
      }
    };

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <Container py="xl">
      <Stack spacing="xl">
        <Title order={2}>Domain Settings</Title>

        {form.values.domain && verificationStatus !== "Valid Configuration" && (
          <InformationAlert title="Domain Configuration" isHtml>
            <Text>Please, add the folowing to your DNS configuration:</Text>
            <Table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {form.values.subDomain ? (
                  <tr>
                    <td>CNAME</td>
                    <td>{form.values.subDomain}</td>
                    <td>cname.vercel-dns.com</td>
                  </tr>
                ) : (
                  <tr>
                    <td>A</td>
                    <td>@</td>
                    <td>76.76.21.21</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </InformationAlert>
        )}

        {form.values.domain && verificationStatus === "Valid Configuration" && (
          <SuccessAlert
            title="Domain Configuration"
            text="Your domain is already configured."
          />
        )}

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
