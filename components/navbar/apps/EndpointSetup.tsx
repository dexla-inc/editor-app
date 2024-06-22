import { EndpointSelect } from "@/components/EndpointSelect";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { Endpoint } from "@/requests/datasources/types";
import { AUTOCOMPLETE_OFF_PROPS, safeJsonParse } from "@/utils/common";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import {
  Divider,
  Flex,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import { ProjectApp, ProjectAppForm } from "@/types/projectApps";
import { extractKeys } from "@/utils/data";
import { ApiType } from "@/types/dashboardTypes";
import { Stack, Title } from "@mantine/core";
import React from "react";

type Props = {
  projectApp: ProjectApp;
  endpoints: Endpoint[];
  form: UseFormReturnType<ProjectAppForm>;
  index: number;
};

export const EndpointSetup = ({
  projectApp,
  endpoints,
  form,
  index,
}: Props) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(endpoints?.find((e) => e.id === projectApp.configuration?.endpointId));

  const exampleResponse = safeJsonParse(
    selectedEndpoint?.exampleResponse ?? "{}",
  );

  const resultsKeysList = extractKeys(exampleResponse);

  useEffect(() => {
    if (form.isTouched()) {
      form.validate();
    }
  }, [form.values]);

  return (
    <>
      <EndpointSelect
        {...form.getInputProps(`apps.${index}.configuration.endpointId`)}
        isOnLoad
        onChange={async (selected) => {
          form.setFieldValue(
            `apps.${index}.configuration.endpointId`,
            selected,
          );
          setSelectedEndpoint(
            endpoints?.find((e) => e.id === selected) as Endpoint,
          );
        }}
      />
      {form.values.apps && form.values.apps[index].configuration.endpointId && (
        <>
          <Flex align="end" gap="xs" justify="space-between">
            <SegmentedControlYesNo
              label="Cache Request"
              value={form.values.apps[index].configuration.staleTime !== 0}
              onChange={(value) => {
                form.setFieldValue(
                  `apps.${index}.configuration.staleTime`,
                  value === false ? 0 : DEFAULT_STALE_TIME,
                );
              }}
            />
            <TextInput
              disabled={form.values.apps[index].configuration.staleTime === 0}
              mt={8}
              w={80}
              {...form.getInputProps(`apps.${index}.configuration.staleTime`)}
              onChange={(e) => {
                form.setFieldValue(
                  `apps.${index}.configuration.staleTime`,
                  e.target.value !== ""
                    ? Number(e.target.value)
                    : e.target.value,
                );
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  form.setFieldValue(
                    `apps.${index}.configuration.staleTime`,
                    0,
                  );
                }
              }}
              styles={{ rightSection: { right: "0.25rem" } }}
              rightSection={
                <Text size="xs" color="dimmed">
                  mins
                </Text>
              }
              {...AUTOCOMPLETE_OFF_PROPS}
            />
          </Flex>
          {!Array.isArray(exampleResponse) && (
            <Select
              clearable
              label="Results key"
              searchable
              placeholder="results"
              data={resultsKeysList}
              {...form.getInputProps(`apps.${index}.configuration.resultsKey`)}
            />
          )}

          <Divider mt="md" />

          <Stack spacing={2}>
            {[
              {
                title: "Headers",
                type: "header" as ApiType,
                items: selectedEndpoint?.headers,
              },
              {
                title: "Request Body",
                type: "body" as ApiType,
                items: selectedEndpoint?.requestBody,
              },
              {
                title: "Query Strings",
                type: "parameter" as ApiType,
                items: selectedEndpoint?.parameters,
              },
            ].map(({ title, type, items }) => (
              <React.Fragment key={title}>
                {items && items.length > 0 && (
                  <Title order={5} mt="md">
                    {title}
                  </Title>
                )}
                {items &&
                  items.map((param, i) => {
                    const field = `apps.${index}.configuration.binds.${type}.${param.name}`;

                    return (
                      <Stack key={param.name}>
                        {{
                          ...(["authorization", "apikey"].includes(
                            param.name.toLowerCase(),
                          ) ? (
                            <PasswordInput
                              size="xs"
                              label={param.name}
                              description={`${
                                // @ts-ignore
                                param.location ? `${param.location} - ` : ""
                              }${param.type}`}
                              {...AUTOCOMPLETE_OFF_PROPS}
                              {...form.getInputProps(field)}
                            />
                          ) : (
                            <TextInput
                              label={param.name}
                              description={`${
                                // @ts-ignore
                                param.location ? `${param.location} - ` : ""
                              }${param.type}`}
                              {...form.getInputProps(field)}
                            />
                          )),
                        }}
                      </Stack>
                    );
                  })}
              </React.Fragment>
            ))}
          </Stack>
        </>
      )}
    </>
  );
};
