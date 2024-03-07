import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { EndpointSelect } from "@/components/EndpointSelect";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import SidebarSection from "@/components/SidebarSection";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { useData } from "@/hooks/useData";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useInputsStore } from "@/stores/inputs";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { extractKeys } from "@/utils/data";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Divider, Flex, Select, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import get from "lodash.get";
import { useEffect, useState } from "react";

type Props = {
  component: Component;
  endpoints: PagingResponse<Endpoint>;
  customProps?: Record<string, any>;
  children?: (props: any) => JSX.Element;
  onSave?: (component: Component, form: any) => Promise<any>;
};

const onSaveDefault = () => Promise.resolve();

export const DynamicSettings = ({
  component,
  endpoints,
  children,
  customProps = {},
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

  const mergedInitialValues = Object.keys({
    ...customProps,
    ...component.onLoad,
  }).reduce((acc, key) => {
    const onLoadValue = component.onLoad?.[key];
    const isOnLoadValueEmpty =
      onLoadValue === "" || onLoadValue === undefined || onLoadValue === null;
    // @ts-ignore
    acc[key] = isOnLoadValueEmpty ? customProps[key] : onLoadValue;
    return acc;
  }, {});

  const form = useForm({
    initialValues: {
      onLoad: {
        ...mergedInitialValues,
        endpointId: component.onLoad?.endpointId ?? undefined,
        resultsKey: component.onLoad?.resultsKey ?? "",
        staleTime: component.onLoad?.staleTime ?? DEFAULT_STALE_TIME,
        binds: {
          header: component.onLoad?.binds?.header ?? {},
          parameter: component.onLoad?.binds?.parameter ?? {},
          body: component.onLoad?.binds?.body ?? {},
        },
      },
      props: {
        style: {
          display: component.props?.style?.display,
        },
      },
    },
  });

  const onLoadValues = form.values.onLoad;

  const selectableObject = onLoadValues.resultsKey
    ? get(exampleResponse, onLoadValues.resultsKey)
    : exampleResponse;

  const selectableObjectKeys = extractKeys(selectableObject);

  useEffect(() => {
    if (form.isTouched()) {
      onSave?.(component, form).then(() => {
        debouncedTreeComponentAttrsUpdate({ attrs: form.values });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <>
      <SidebarSection
        id="data"
        noPadding={true}
        initiallyOpened={initiallyOpened}
        label="Load Data"
        icon="IconDatabase"
        onClick={(id: string, opened: boolean) =>
          id === "data" && setInitiallyOpened(opened)
        }
      >
        <EndpointSelect
          {...form.getInputProps("onLoad.endpointId")}
          onChange={(selected) => {
            form.setValues({
              onLoad: {
                ...onLoadValues,
                endpointId: selected,
                resultsKey: "",
              },
            });
            setInputValue(component.id!, "");
            setSelectedEndpoint(
              endpoints?.results?.find((e) => e.id === selected) as Endpoint,
            );
          }}
        />
        {onLoadValues.endpointId && (
          <>
            <Flex align="end" gap="xs" justify="space-between">
              <SegmentedControlYesNo
                label="Cache Request"
                value={onLoadValues.staleTime === 0 ? false : true}
                onChange={(value) => {
                  form.setFieldValue(
                    "onLoad.staleTime",
                    value === false ? 0 : DEFAULT_STALE_TIME,
                  );
                }}
              />
              <TextInput
                disabled={onLoadValues.staleTime === 0}
                mt={8}
                w={80}
                {...form.getInputProps("onLoad.staleTime")}
                onChange={(e) => {
                  form.setFieldValue(
                    "onLoad.staleTime",
                    e.target.value !== ""
                      ? Number(e.target.value)
                      : e.target.value,
                  );
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    form.setFieldValue("onLoad.staleTime", 0);
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
                placeholder="user.list"
                data={resultsKeysList}
                {...form.getInputProps("onLoad.resultsKey")}
                onChange={(selected) => {
                  const newValues = {
                    ...onLoadValues,
                    resultsKey: selected,
                  };
                  setInputValue(component.id!, "");
                  form.setValues({ onLoad: newValues });
                }}
              />
            )}
            {children && children({ form, selectableObjectKeys })}

            <Divider mt="md" />

            <EndpointRequestInputs
              selectedEndpoint={selectedEndpoint!}
              form={form}
              formType="data"
            />
          </>
        )}
      </SidebarSection>
      <VisibilityModifier
        componentId={component.id!}
        componentName={component.name}
        form={form}
      />
    </>
  );
};
