import { Divider, Flex, Select, Text, TextInput } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import { SidebarSection } from "@/components/SidebarSection";
import { EndpointSelect } from "@/components/EndpointSelect";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Endpoint } from "@/requests/datasources/types";
import { useForm } from "@mantine/form";
import { useInputsStore } from "@/stores/inputs";
import { useEffect, useState } from "react";
import { PagingResponse } from "@/requests/types";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { pick } from "next/dist/lib/pick";
import get from "lodash.get";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { useData } from "@/hooks/useData";

type Props = {
  component: Component;
  endpoints: PagingResponse<Endpoint>;
  customKeys?: string[];
  children?: (props: any) => JSX.Element;
  onSave?: (component: Component, form: any) => Promise<any>;
};

const onSaveDefault = () => Promise.resolve();

export const DynamicSettings = ({
  component,
  endpoints,
  children,
  customKeys = [],
  onSave = onSaveDefault,
}: Props) => {
  const [initiallyOpened, setInitiallyOpened] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(endpoints?.results?.find((e) => e.id === component.onLoad?.endpointId));
  const { getObjectAndArrayKeys } = useData();

  const exampleResponse = JSON.parse(selectedEndpoint?.exampleResponse ?? "{}");

  const setInputValue = useInputsStore((state) => state.setInputValue);
  const resultsKeysList = getObjectAndArrayKeys(exampleResponse);
  const resetCustomKeys = customKeys.reduce(
    (acc, key) => {
      acc[key] = "";
      return acc;
    },
    {} as Record<string, string>,
  );

  const form = useForm({
    initialValues: {
      ...pick(component.onLoad ?? {}, customKeys),
      endpointId: component.onLoad?.endpointId ?? undefined,
      resultsKey: component.onLoad?.resultsKey ?? "",
      staleTime: component.onLoad?.staleTime ?? DEFAULT_STALE_TIME,
      binds: {
        header: component.onLoad?.binds?.header ?? {},
        parameter: component.onLoad?.binds?.parameter ?? {},
        body: component.onLoad?.binds?.body ?? {},
      },
    },
  });

  const selectableObject = form.values.resultsKey
    ? get(exampleResponse, form.values.resultsKey)
    : exampleResponse;

  const selectableObjectKeys = Object.keys(
    Array.isArray(selectableObject) ? selectableObject[0] : selectableObject,
  );

  useEffect(() => {
    if (form.isTouched()) {
      onSave?.(component, form).then(() => {
        debouncedTreeComponentAttrsUpdate({
          onLoad: form.values,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <SidebarSection
      id="data"
      noPadding={true}
      initiallyOpened={initiallyOpened}
      label="Load Data"
      icon={IconDatabase}
      onClick={(id: string, opened: boolean) =>
        id === "data" && setInitiallyOpened(opened)
      }
    >
      <EndpointSelect
        {...form.getInputProps("endpointId")}
        onChange={(selected) => {
          form.setValues({
            endpointId: selected,
            resultsKey: "",
            ...resetCustomKeys,
          });
          setInputValue(component.id!, "");
          setSelectedEndpoint(
            endpoints?.results?.find((e) => e.id === selected) as Endpoint,
          );
        }}
      />
      {form.values.endpointId && (
        <>
          <Flex align="end" gap="xs" justify="space-between">
            <SegmentedControlYesNo
              label="Cache Request"
              value={form.values.staleTime === 0 ? false : true}
              onChange={(value) => {
                form.setValues({
                  staleTime: value === false ? 0 : DEFAULT_STALE_TIME,
                });
              }}
            />
            <TextInput
              disabled={form.values.staleTime === 0}
              mt={8}
              w={80}
              {...form.getInputProps("staleTime")}
              onChange={(e) => {
                form.setValues({
                  staleTime:
                    e.target.value !== ""
                      ? Number(e.target.value)
                      : e.target.value,
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  form.setValues({
                    staleTime: 0,
                  });
                }
              }}
              styles={{ rightSection: { right: "0.25rem" } }}
              rightSection={
                <Text size="xs" color="dimmed">
                  mins
                </Text>
              }
            />
          </Flex>
          {!Array.isArray(exampleResponse) && (
            <Select
              clearable
              label="Results key"
              placeholder="user.list"
              data={resultsKeysList}
              {...form.getInputProps("resultsKey")}
              onChange={(selected) => {
                const newValues = {
                  resultsKey: selected,
                  ...resetCustomKeys,
                };
                setInputValue(component.id!, "");
                form.setValues(newValues);
              }}
            />
          )}
          {children && children({ form, selectableObjectKeys })}

          <Divider mt="md" />

          <EndpointRequestInputs
            selectedEndpoint={selectedEndpoint!}
            form={form}
          />
        </>
      )}
    </SidebarSection>
  );
};
