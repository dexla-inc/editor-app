import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { SelectOptionsForm } from "@/components/data/forms/static/SelectOptionsForm";
import { SidebarSection } from "@/components/SidebarSection";
import { Endpoint } from "@/requests/datasources/types";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Divider, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDatabase } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { EndpointData } from "./EndpointData";
import { SelectOptions } from "./SelectOptions";
import { PagingResponse } from "@/requests/types";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};

export const SelectData = ({ component, endpoints, dataType }: DataProps) => {
  const [initiallyOpened, setInitiallyOpened] = useState(true);

  const onLoadForm = useForm({
    initialValues: {
      endpointId: component.onLoad?.endpointId ?? undefined,
      dataLabelKey: component.onLoad?.dataLabelKey ?? "",
      dataValueKey: component.onLoad?.dataValueKey ?? "",
      resultsKey: component.onLoad?.resultsKey ?? "",
      actionCode: component.onLoad?.actionCode ?? {},
      staleTime: component.onLoad?.staleTime ?? "30",
      binds: {
        header: component.onLoad?.binds?.header ?? {},
        parameter: component.onLoad?.binds?.parameter ?? {},
        body: component.onLoad?.binds?.body ?? {},
      },
    },
  });

  useEffect(() => {
    if (onLoadForm.isTouched()) {
      debouncedTreeComponentAttrsUpdate({
        onLoad: { binds: onLoadForm.values.binds },
      });
    }
  }, [onLoadForm.values.binds]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(endpoints?.results?.find((e) => e.id === component.onLoad?.endpointId));

  const exampleResponse = JSON.parse(selectedEndpoint?.exampleResponse ?? "{}");

  return (
    <Stack spacing="xs">
      {dataType === "static" && <SelectOptionsForm component={component} />}
      {dataType === "dynamic" && (
        <SidebarSection
          noPadding
          id="data"
          initiallyOpened={initiallyOpened}
          label="Load Data"
          icon={IconDatabase}
          onClick={(id: string, opened: boolean) =>
            id === "data" && setInitiallyOpened(opened)
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
  );
};
