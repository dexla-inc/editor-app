import { JSONSelector } from "@/components/JSONSelector";
import { Endpoint } from "@/requests/datasources/types";
import { scrollbarStyles } from "@/utils/branding";
import { Anchor, Popover, ScrollArea } from "@mantine/core";

type Props = {
  endpoint: Endpoint;
};

export const EndpointExampleResponsePreview = ({ endpoint }: Props) => {
  return (
    endpoint && (
      <Popover width={300} position="bottom-end" withArrow withinPortal>
        <Popover.Target>
          {/* <ActionIcon variant="default">
          <Icon name="IconJson" />
        </ActionIcon> */}
        <Anchor size="xs">Preview Response</Anchor>
      </Popover.Target>
      <Popover.Dropdown
        w={300}
        sx={{ overflowX: "hidden", ...scrollbarStyles }}
      >
        <ScrollArea.Autosize mah={300}>
          <JSONSelector
            data={
              endpoint.exampleResponse
                ? JSON.parse(endpoint.exampleResponse)
                : endpoint.exampleResponse
            }
            name={endpoint.relativeUrl}
          />
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
};
