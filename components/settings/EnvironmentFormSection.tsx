import { InformationAlert, SuccessAlert } from "@/components/Alerts";
import { TextInput, Title, Stack, Table, Text, Divider } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { EnvironmentTypes } from "@/requests/datasources/types";

type EnvironmentFormSectionProps = {
  env: EnvironmentTypes;
  form: UseFormReturnType<any>;
  verificationStatus: Partial<Record<EnvironmentTypes, string>>;
};

export const EnvironmentFormSection = ({
  env,
  form,
  verificationStatus,
}: EnvironmentFormSectionProps) => {
  return (
    <Stack>
      <Title order={4}>{env} Environment</Title>

      {form.values.liveUrls?.[env]?.domain &&
        verificationStatus[env] !== "Valid Configuration" && (
          <InformationAlert title={`${env} Domain Configuration`} isHtml>
            <Text>Please, add the following to your DNS configuration:</Text>
            <Table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {form.values.liveUrls[env]?.subDomain ? (
                  <tr>
                    <td>CNAME</td>
                    <td>{form.values.liveUrls[env]?.subDomain}</td>
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

      {form.values.liveUrls?.[env]?.domain &&
        verificationStatus[env] === "Valid Configuration" && (
          <SuccessAlert
            title={`${env} Domain Configuration`}
            text="Your domain is already configured."
          />
        )}

      <TextInput
        label="Domain"
        placeholder={`${env} domain`}
        {...form.getInputProps(`liveUrls.${env}.domain`)}
      />
      <TextInput
        label="Subdomain"
        placeholder={`${env} subdomain`}
        {...form.getInputProps(`liveUrls.${env}.subDomain`)}
      />

      <Divider my={10} />
    </Stack>
  );
};
