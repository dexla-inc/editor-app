import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  Component,
  debouncedTreeComponentAttrsUpdate,
  getComponentTreeById,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";

const Modifier = withModifier(({ selectedComponent }) => {
  const editorTree = useEditorTreeStore((state) => state.tree);
  const selectedComponentTree = useEditorTreeStore((state) => {
    const selectedComponentId = selectedComponentIdSelector(state);
    return getComponentTreeById(editorTree.root, selectedComponentId!);
  });
  const form = useForm({
    initialValues: {
      variant: "default",
      // TODO: get this back
      // value: selectedComponent.children?.[0]?.props?.value,
      numberOfItems: selectedComponentTree?.children?.length,
    },
  });

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.accordion, {
        variant: selectedComponent.props?.variant,
        value: selectedComponent.props?.value,
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

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.accordion, {
        variant: selectedComponent.props?.variant,
        value: selectedComponent.props?.value,
        numberOfItems: selectedComponentTree?.children?.length,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const addCarouselSlide = (accordion: Component, id: string) => {
    // TODO: get this back
    // const newItem = createItem(id)();
    // const updatedChildren = [
    //   ...Array.from(accordion?.children ?? []),
    //   newItem,
    // ];
    // debouncedTreeComponentChildrenUpdate(updatedChildren);
  };

  const removeItem = (accordion: Component, newSize: string) => {
    // TODO: get this back
    // const updatedChildren = accordion?.children?.slice(0, Number(newSize));
    // debouncedTreeComponentChildrenUpdate(updatedChildren!);
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
          onChange={(value) => {
            form.setFieldValue("variant", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { variant: value } },
            });
          }}
        />
        {/*TODO: get this back*/}
        {/*<Select*/}
        {/*  label="Default Value"*/}
        {/*  size="xs"*/}
        {/*  data={*/}
        {/*    selectedComponent.children?.map(*/}
        {/*      (key) => key.props?.value!,*/}
        {/*    ) as string[]*/}
        {/*  }*/}
        {/*  {...form.getInputProps("value")}*/}
        {/*  onChange={(value) => {*/}
        {/*    form.setFieldValue("value", value as string);*/}
        {/*    debouncedTreeUpdate(selectedComponentIds, { value });*/}
        {/*  }}*/}
        {/*/>*/}
        <UnitInput
          label="Number of Items"
          disabledUnits={["%", "vh", "vw", "rem", "px", "auto"]}
          {...form.getInputProps("numberOfItems")}
          onChange={(value) => {
            if (Number(value) > form.values.numberOfItems!) {
              addCarouselSlide(selectedComponent!, value);
            } else {
              removeItem(selectedComponent!, value);
            }
            form.setFieldValue("numberOfItems", Number(value));
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
