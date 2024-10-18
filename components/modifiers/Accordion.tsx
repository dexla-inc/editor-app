import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  Component,
  debouncedTreeComponentAttrsUpdate,
  debouncedTreeComponentChildrenUpdate,
  getComponentTreeById,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { structureMapper } from "@/utils/componentMapper";

const createItem = (itemPosition: number) => {
  return structureMapper()["AccordionItem"].structure({
    props: { value: `item-${itemPosition}` },
  });
};

const Modifier = withModifier(({ selectedComponent }) => {
  const editorTree = useEditorTreeStore((state) => state.tree);
  const selectedComponentTree = useEditorTreeStore((state) => {
    const selectedComponentId = selectedComponentIdSelector(state);
    return getComponentTreeById(editorTree.root, selectedComponentId!);
  });
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.accordion, {
        variant: selectedComponent.props?.variant,
        defaultValue: selectedComponent.props?.defaultValue,
        numberOfItems: selectedComponentTree?.children?.length,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const data: Record<string, string> = {
    Default: "default",
    Contained: "contained",
    Filled: "filled",
    Separated: "separated",
  };

  const addCarouselSlide = (value: number) => {
    const newItem = createItem(value);
    const updatedChildren = [
      ...Array.from(selectedComponentTree?.children ?? []),
      newItem,
    ];
    debouncedTreeComponentChildrenUpdate(updatedChildren);
  };

  const removeItem = (value: number) => {
    const updatedChildren = (selectedComponentTree?.children ?? []).slice(
      0,
      value,
    );
    debouncedTreeComponentChildrenUpdate(updatedChildren);
  };

  const onChange = (key: string, value: string) => {
    form.setFieldValue("variant", value);
    debouncedTreeComponentAttrsUpdate({
      attrs: { props: { [key]: value } },
    });
  };

  return (
    <form>
      <Stack spacing="xs">
        <Select
          label="Variant"
          size="xs"
          data={Object.keys(data).map((key) => ({
            label: key,
            value: data[key],
          }))}
          {...form.getInputProps("variant")}
          onChange={(value) => onChange("variant", value as string)}
        />
        <TextInput
          label="Default Value"
          size="xs"
          {...form.getInputProps("defaultValue")}
          onChange={(e) => onChange("defaultValue", e.currentTarget.value)}
        />

        <NumberInput
          label="Number of Items"
          {...form.getInputProps("numberOfItems")}
          onChange={(value) => {
            const sanitizedValue = Number(value);
            const numberOfItems = form.getInputProps("numberOfItems").value;
            if (sanitizedValue > numberOfItems) {
              addCarouselSlide(sanitizedValue);
            } else {
              removeItem(sanitizedValue);
            }
            form.setFieldValue("numberOfItems", sanitizedValue);
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
