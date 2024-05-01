import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/types/dataBinding";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Stack } from "@mantine/core";
import { UnitInput } from "../UnitInput";

export const CountdownButtonData = ({ component, endpoints }: DataProps) => {
  const staticFields = [
    {
      name: "children",
      label: "Value",
    },
  ];
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  return (
    <Stack spacing="xs">
      <UnitInput
        label="Duration"
        value={component.props?.duration}
        options={[
          { label: "secs", value: "seconds" },
          { label: "mins", value: "minutes" },
        ]}
        disabledUnits={["%", "auto", "fit-content", "px", "rem", "vh", "vw"]}
        onChange={(e) =>
          updateTreeComponentAttrs({
            componentIds: [component.id!],
            attrs: {
              props: { duration: e },
            },
          })
        }
      />
      <FormFieldsBuilder
        fields={staticFields}
        component={component}
        endpoints={endpoints!}
      />
    </Stack>
  );
};
