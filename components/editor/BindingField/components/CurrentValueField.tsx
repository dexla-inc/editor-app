import { Stack, TextInput } from "@mantine/core";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { useBindingPopover } from "@/hooks/data/useBindingPopover";
import { ValueProps } from "@/types/dataBinding";
import { isObjectOrArray } from "@/utils/common";
import { JSONViewer } from "@/components/JSONViewer";
import { BINDER_BACKGROUND } from "@/utils/branding";
import { BindingContextSelector } from "@/components/editor/BindingField/components/BindingContextSelector";

type CurrentValueFieldProps = {
  value: ValueProps;
  onChange: (val: string) => void;
  hideBindingContextSelector: boolean;
};

export const CurrentValueField = ({
  value,
  onChange,
  hideBindingContextSelector,
}: CurrentValueFieldProps) => {
  const selectedComponentId = useEditorTreeStore((state) =>
    state.selectedComponentIds?.at(-1),
  );
  const { computeValue } = useDataBinding(selectedComponentId);
  const { actions, item } = useBindingPopover();
  const currentValue = computeValue<string>({ value }, { actions, item });

  return (
    <Stack>
      <Stack>
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
        {hideBindingContextSelector && (
          <BindingContextSelector setSelectedItem={onChange} />
        )}
      </Stack>
    </Stack>
  );
};
