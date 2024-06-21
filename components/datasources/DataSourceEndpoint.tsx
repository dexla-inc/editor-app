import { DataSourceEndpointDetail } from "@/components/datasources/DataSourceEndpointDetail";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { Endpoint } from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { ICON_SIZE } from "@/utils/config";
import { Box, Flex, Group, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";

export type ColorScheme = {
  [key in MethodTypes]: {
    background: string;
    color: string;
  };
};

export const colors: ColorScheme = {
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
  baseUrl: string;
  endpoint: Endpoint;
  location?: "editor" | "datasource";
  dataSourceId?: string | undefined;
  opened?: boolean;
  setOpened?: (opened: boolean) => void;
};

export const DataSourceEndpoint = ({
  baseUrl,
  projectId,
  endpoint,
  location = "datasource",
  dataSourceId,
  opened: externalOpened,
  setOpened: externalSetOpened,
}: DataSourceEndpointProps) => {
  const routeParams = useEditorParams();
  const [internalOpened, setInternalOpened] = useState<boolean>(false);
  const isOpened = externalOpened ?? internalOpened;
  const setOpened = externalSetOpened ?? setInternalOpened;

  const toggle = () => {
    setOpened(isOpened ? false : true);
  };

  const actualDataSourceId =
    dataSourceId ?? (routeParams.dataSourceId as string);

  return (
    <Box>
      <UnstyledButton onClick={toggle} sx={{ width: "100%" }}>
        <Group
          position="apart"
          sx={(theme) => ({
            border: colors[endpoint.methodType].color + " 1px solid",
            ...(theme.colorScheme === "dark"
              ? {}
              : { background: colors[endpoint.methodType].background }),
            borderRadius: "4px",
          })}
          mx={0}
          p="6px"
        >
          <Flex gap="xs" align="center" sx={{ maxWidth: 880 }}>
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
            {location === "datasource" && (
              <Text truncate>{endpoint.description}</Text>
            )}
          </Flex>
          {isOpened ? (
            <IconChevronDown size={ICON_SIZE} />
          ) : (
            <IconChevronRight size={ICON_SIZE} />
          )}
        </Group>
      </UnstyledButton>
      {isOpened && (
        <DataSourceEndpointDetail
          baseUrl={baseUrl}
          endpoint={endpoint}
          projectId={projectId}
          dataSourceId={actualDataSourceId}
        />
      )}
    </Box>
  );
};
