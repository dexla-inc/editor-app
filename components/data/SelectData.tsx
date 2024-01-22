import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { SidebarSection } from "@/components/SidebarSection";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { useEditorStore } from "@/stores/editor";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Divider, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDatabase } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { EndpointData } from "./EndpointData";
import { SelectOptions } from "./SelectOptions";

export const SelectData = ({ component, endpoints }: DataProps) => {
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const form = useForm({
    initialValues: {
      data: component.props?.data ?? [],
      display: component.props?.display,
      dataType: component.props?.dataType ?? "static",
      initiallyOpened: component.props?.initiallyOpened ?? true,
    },
  });

  const onLoadForm = useForm({
    initialValues: {
      endpointId: component.onLoad?.endpointId ?? undefined,
      dataLabelKey: component.onLoad?.dataLabelKey ?? "",
      dataValueKey: component.onLoad?.dataValueKey ?? "",
      resultsKey: component.onLoad?.resultsKey ?? "",
      actionCode: component.onLoad?.actionCode ?? {},
      staleTime: component.onLoad?.staleTime ?? DEFAULT_STALE_TIME,
      binds: {
        header: component.onLoad?.binds?.header ?? {},
        parameter: component.onLoad?.binds?.parameter ?? {},
        body: component.onLoad?.binds?.body ?? {},
      },
    },
  });

  const setFormFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id as string, { [key]: value });
  };

  useEffect(() => {
    if (onLoadForm.isTouched()) {
      updateTreeComponentAttrs([component.id!], {
        onLoad: { binds: onLoadForm.values.binds },
      });
    }
  }, [onLoadForm.values.binds]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(endpoints?.results?.find((e) => e.id === component.onLoad?.endpointId));

  const exampleResponse = JSON.parse(selectedEndpoint?.exampleResponse ?? "{}");

  return (
    <form>
      <Stack spacing="xs">
        <DataTabSelect
          {...form.getInputProps("dataType")}
          setFieldValue={setFormFieldValue}
        />
        {form.values.dataType === "static" && (
          <>
            <SelectOptionsForm
              getValue={() => form.getInputProps("data").value}
              setFieldValue={setFormFieldValue}
            />
            <VisibilityModifier
              component={component}
              form={form}
              onChange={(value: any) => {
                form.setFieldValue("display", value as string);
                debouncedTreeUpdate(component.id, {
                  style: {
                    display: value,
                  },
                });
              }}
              debouncedTreeUpdate={debouncedTreeUpdate}
            />
          </>
        )}
        {form.values.dataType === "dynamic" && (
          <SidebarSection
            noPadding={true}
            id="data"
            initiallyOpened={form.values.initiallyOpened}
            label="Load Data"
            icon={IconDatabase}
            onClick={(id: string, opened: boolean) =>
              id === "data" && form.setFieldValue("initiallyOpened", opened)
            }
          >
            <Stack>
              <EndpointData
                response={exampleResponse}
                form={onLoadForm}
                componentId={component.id as string}
                setSelectedEndpoint={setSelectedEndpoint}
                endpoints={endpoints?.results ?? []}
              />
              {onLoadForm.values.endpointId && (
                <>
                  <SelectOptions response={exampleResponse} form={onLoadForm} />
                  <Divider mt="md" />

                  <EndpointRequestInputs
                    selectedEndpoint={selectedEndpoint!}
                    form={onLoadForm}
                  />
                </>
              )}
            </Stack>
          </SidebarSection>
        )}
      </Stack>
    </form>
  );
};
