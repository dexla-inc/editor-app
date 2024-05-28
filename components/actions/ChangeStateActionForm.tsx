import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { useComponentStates } from "@/hooks/editor/useComponentStates";
import { ChangeStateAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<ChangeStateAction, "name">>;
  isPageAction?: boolean;
};

export const ChangeStateActionForm = ({ form, isPageAction }: Props) => {
  const { getComponentsStates } = useComponentStates();

  const componentStatesList = getComponentsStates();

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        label="Component to change"
        isPageAction={isPageAction}
        {...form.getInputProps("componentId")}
      />

      {!!componentStatesList.length && (
        <ComponentToBindFromSelect
          label="State"
          placeholder="Select State"
          nothingFound="Nothing found"
          searchable
          data={componentStatesList}
          {...form.getInputProps("state")}
        />
      )}
    </Stack>
  );
};
