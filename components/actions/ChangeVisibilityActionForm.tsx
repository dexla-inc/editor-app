import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, TogglePropsAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { useEditorTreeStore } from "../../stores/editorTree";
import { VisibilityModifier } from "../data/VisibilityModifier";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";

type Props = ActionFormProps<Omit<TogglePropsAction, "name">>;

export const ChangeVisibilityActionForm = ({ form, isPageAction }: Props) => {
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );

  const component = useEditorTreeStore(
    useShallow((state) =>
      pick(
        state.componentMutableAttrs[state.selectedComponentIds?.at(-1)!] ?? {},
        ["id", "name"],
      ),
    ),
  );

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        label="Component to change"
        onPickComponent={() => {
          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        isPageAction={isPageAction}
        {...form.getInputProps("componentId")}
      />
      <VisibilityModifier
        componentId={component?.id!}
        componentName={component?.name as string}
        form={form}
        isVisibilityActionForm={true}
      />
    </Stack>
  );
};
