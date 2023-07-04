import { Endpoint } from "@/requests/datasources/types";
import { ICON_SIZE } from "@/utils/config";
import { Box, Flex, Group, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import { DataSourceEndpointDetail } from "./DataSourceEndpointDetail";

const colors = {
  GET: {
    background: "#EBF3FB",
    color: "#61AFFE",
  },
  POST: {
    background: "#E8F6F0",
    color: "#49CC90",
  },
  PUT: {
    background: "#FBF1E6",
    color: "#FCA130",
  },
  DELETE: {
    background: "#FAE7E7",
    color: "#F93E3E",
  },
  PATCH: {
    background: "#E9F8F5",
    color: "#50E3C2",
  },
};

type DataSourceEndpointProps = {
  projectId: string;
  endpoint: Endpoint;
  location: "editor" | "datasource";
};

export const DataSourceEndpoint = ({
  endpoint,
  location,
}: DataSourceEndpointProps) => {
  const [opened, toggleOpened] = useState<boolean>(false);

  const open = () => {
    toggleOpened(opened ? false : true);
  };

  return (
    <Box>
      <UnstyledButton onClick={open} sx={{ width: "100%" }}>
        <Group
          position="apart"
          sx={{
            border: colors[endpoint.methodType].color + " 1px solid",
            background: colors[endpoint.methodType].background,
            borderRadius: "4px",
          }}
          mx={0}
          p="6px"
        >
          <Flex gap="xs" align="center">
            <Text
              size="xs"
              color="white"
              sx={{
                background: colors[endpoint.methodType].color,
                borderRadius: "4px",
                textAlign: "center",
                minWidth: "65px",
              }}
              p="2px 8px"
            >
              {endpoint.methodType}
            </Text>
            <Text
              size="xs"
              truncate
              sx={{ maxWidth: location === "editor" ? "145px" : "auto" }}
            >
              {endpoint.relativeUrl}
            </Text>
            {location === "datasource" && <Flex>{endpoint.description}</Flex>}
          </Flex>
          {opened ? (
            <IconChevronDown size={ICON_SIZE} />
          ) : (
            <IconChevronRight size={ICON_SIZE} />
          )}
        </Group>
      </UnstyledButton>
      {opened && <DataSourceEndpointDetail endpoint={endpoint} />}
    </Box>
  );
};
