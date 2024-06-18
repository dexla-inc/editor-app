import { Stack, Text, TextInput } from "@mantine/core";
import { CustomJavaScriptTextArea } from "@/components/CustomJavaScriptTextArea";
import { isObjectOrArray } from "@/utils/common";
import { JSONViewer } from "@/components/JSONViewer";
import { BINDER_BACKGROUND } from "@/utils/branding";
import { BindingContextSelector } from "@/components/editor/BindingField/components/BindingContextSelector";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { useState } from "react";
import { useBindingPopover } from "@/hooks/data/useBindingPopover";
import { useBindingField } from "@/components/editor/BindingField/components/ComponentToBindFromInput";

export const BoundCodeForm = () => {
  const { value, onChange } = useBindingField();
  const [selectedItem, setSelectedItem] = useState<string>();
  const selectedComponentId = useEditorTreeStore((state) =>
    state.selectedComponentIds?.at(-1),
  );
  const { computeValue } = useDataBinding(selectedComponentId);
  const { actions, item } = useBindingPopover();
  const currentValue = computeValue<string>({ value }, { actions, item });

  return (
    <Stack spacing={10}>
      <Text size="sm" fw={500} pb={2}>
        {"JavaScript"}
      </Text>
      <CustomJavaScriptTextArea
        language="typescript"
        value={value?.boundCode}
        onChange={(code: string) => {
          onChange({ ...value, boundCode: code });
          if (selectedItem) {
            setSelectedItem(undefined);
          }
        }}
        selectedItem={selectedItem}
      />
      {isObjectOrArray(currentValue) ? (
        <JSONViewer data={currentValue} />
      ) : (
        <TextInput
          label="Current Value"
          styles={{ input: { background: BINDER_BACKGROUND } }}
          value={currentValue ?? "undefined"}
          readOnly
          sx={{
            color: currentValue === undefined ? "grey" : "inherit",
          }}
        />
      )}
      <BindingContextSelector setSelectedItem={setSelectedItem} />
    </Stack>
  );
};
