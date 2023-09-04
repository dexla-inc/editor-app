import {
  Button,
  Container,
  Flex,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { InformationAlert } from "../Alerts";
import { DnsRecord } from "./DnsRecord";

type Props = {
  projectId: string;
};

export default function DomainSettings({ projectId }: Props) {
  const [defaultDomain, setDefaultDomain] = useState<string>("");
  const [stagingUrl, setStagingUrl] = useState<string>("");
  const [productionUrl, setProductionUrl] = useState<string>("");
  const [dnsRecords, setDnsRecords] = useState<string>("");

  const handleSave = async () => {
    try {
      // Placeholder for API calls or logic to save domain settings
      console.log({
        defaultDomain,
        stagingUrl,
        productionUrl,
      });

      // Placeholder for API calls or logic to generate DNS records
      const generatedDnsRecords = "Generated DNS records will appear here";
      setDnsRecords(generatedDnsRecords);
    } catch (error) {
      console.error(error);
    }
  };

  // test data
  const sslData: DnsRecord = {
    name: "_436450253fd7dae1646b4db4a9853cb6.igc",
    type: "CNAME",
    ttl: "1800",
    value: "_b15f118f06ad6520eb098c23d1808cd4.bkngfjypgb.acm-validations.aws.",
  };

  const redirectData: DnsRecord = {
    name: "igc",
    type: "CNAME",
    ttl: "1800",
    value: "d1sjrl9u68o6wo.cloudfront.net.",
  };

  return (
    <Container py="xl">
      <Stack spacing="xl">
        <Title order={2}>Domain Settings</Title>

        <Stack>
          <Flex align="end" gap="xs">
            <TextInput
              label="Default Site Domain"
              value={defaultDomain}
              onChange={(e) => setDefaultDomain(e.currentTarget.value)}
            />
            <Text c="dimmed">.dexla.ai</Text>
          </Flex>

          <Title order={3}>Staging</Title>
          <TextInput
            label="Custom Staging URL"
            value={stagingUrl}
            onChange={(e) => setStagingUrl(e.currentTarget.value)}
            placeholder="e.g. staging-app.dexla.com"
          />

          <Title order={3}>Production</Title>
          <TextInput
            label="Custom Production URL"
            value={productionUrl}
            onChange={(e) => setProductionUrl(e.currentTarget.value)}
            placeholder="e.g. app.dexla.com"
          />

          <Button onClick={handleSave}>Save Changes</Button>
        </Stack>

        {dnsRecords && (
          <Stack>
            <Title order={3}>SSL Certificate Validation</Title>
            <InformationAlert
              text="This record is used to secure your domain name by creating an SSL
            certificate."
            ></InformationAlert>

            <DnsRecord dnsRecord={sslData}></DnsRecord>

            <Title order={3}>Redirection</Title>
            <InformationAlert
              text=" This record is used to redirect your domain name to your dexla.ai
            app."
            ></InformationAlert>

            <DnsRecord dnsRecord={redirectData}></DnsRecord>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
