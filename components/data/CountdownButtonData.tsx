import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/components/data/type";
import { useEditorStore } from "@/stores/editor";
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
  console.log("CountdownButtonData");
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

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
            isPreviewMode,
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
