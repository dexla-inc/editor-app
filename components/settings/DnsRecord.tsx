import { Icon } from "@/components/Icon";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Flex, Stack, Text, Tooltip } from "@mantine/core";
import { useState } from "react";

export type DnsRecord = {
  name: string;
  type: string;
  ttl: string;
  value: string;
};

type Props = {
  dnsRecord: DnsRecord;
};

export const DnsRecord = ({ dnsRecord }: Props) => {
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setTooltipText("Copied to clipboard");
  };

  return (
    <Stack>
      {Object.keys(dnsRecord).map((key, index) => (
        <Flex key={index} gap="md" align="center">
          <Text fw={500} size="sm">
            {key.toUpperCase()}:
          </Text>
          <Text bg="gray.1" p={4} sx={{ borderRadius: "4px" }}>
            {dnsRecord[key as keyof typeof dnsRecord]}
          </Text>

          <Tooltip label={tooltipText}>
            <ActionIcon
              onClick={() =>
                copyToClipboard(dnsRecord[key as keyof typeof dnsRecord])
              }
              variant="light"
              radius="xl"
              color="yellow"
            >
              <Icon name="IconCopy" size={ICON_SIZE}></Icon>
            </ActionIcon>
          </Tooltip>
        </Flex>
      ))}
    </Stack>
  );
};
