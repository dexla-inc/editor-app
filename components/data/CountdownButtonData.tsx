import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/components/data/type";
import { useEditorStore } from "@/stores/editor";
import { Stack } from "@mantine/core";
import { UnitInput } from "../UnitInput";

export const CountdownButtonData = ({ component, endpoints }: DataProps) => {
  const staticFields = [
    {
      name: "children",
      label: "Value",
    },
  ];

  const updateTreeComponentAttrs = useEditorStore(
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
          updateTreeComponentAttrs([component.id!], {
            props: { duration: e },
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
