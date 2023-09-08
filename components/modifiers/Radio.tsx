import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import {
    debouncedTreeComponentChildrenUpdate,
} from "@/utils/editor";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconRadio, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconRadio;
export const label = "Radio";

const editorStore = useEditorStore.getState();

const createRadioItem = (label: string, value: string) => {
  const radioItem = structureMapper["RadioItem"].structure({
    theme: editorStore.theme,
    props: {
      label: label,
      value: value,
    },
  });
  return radioItem;
};

const radioItem1 = createRadioItem("Radio 1", "value1");
const radioItem2 = createRadioItem("Radio 2", "value2");

export const defaultRadioValues = {
  children: [radioItem1, radioItem2],
  size: "sm",
  label: "",
  withAsterisk: false,
  labelSpacing: "0",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: defaultRadioValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "style",
        "children",
        "label",
        "size",
        "withAsterisk",
        "labelProps",
      ]);

      form.setValues({
        children: data.children?.length
          ? data.children
          : defaultRadioValues.children,
        size: data.size ?? defaultRadioValues.size,
        label: data.label ?? defaultRadioValues.label,
        withAsterisk: data.withAsterisk ?? defaultRadioValues.withAsterisk,
        labelProps:
          data.labelProps?.style?.marginBottom ??
          defaultRadioValues.labelSpacing,
        ...data.style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const addRadioItem = () => {
    const count = form.values.children.length + 1;
    const newRadioItem = createRadioItem("Label " + count, "value" + count);
    const updatedChildren = [...form.values.children, newRadioItem];
    form.setValues({ ...form.values, children: updatedChildren });
    debouncedTreeComponentChildrenUpdate(updatedChildren);
  };

  const updateRadioItem = (index: number, field: string, value: string) => {
    const updatedRadioItems = [...form.values.children];
    updatedRadioItems[index].props![field] = value;
    form.setValues({ ...form.values, children: updatedRadioItems });
    debouncedTreeComponentChildrenUpdate(updatedRadioItems);
  };

  const deleteRadioItem = (index: number) => {
    const updatedRadioItems = [...form.values.children];
    updatedRadioItems.splice(index, 1);
    form.setValues({ ...form.values, children: updatedRadioItems });
    debouncedTreeComponentChildrenUpdate(updatedRadioItems);
  };

  return (
    <form>
      <Stack spacing="xs">
        <Stack>
          <Flex justify="space-between" align="center">
            <Text size="sm">Choices</Text>
            <Button
              size="xs"
              onClick={addRadioItem}
              leftIcon={<IconPlus size={ICON_SIZE} />}
            >
              Add
            </Button>
          </Flex>

          {form.values.children.map((child, index) => (
            <Box
              key={index}
              py="md"
              sx={{
                borderBottom: "1px solid " + theme.colors.gray[3],
                borderTop: "1px solid " + theme.colors.gray[3],
              }}
            >
              <Flex justify="space-between">
                <Text size="sm">Item {index + 1}</Text>
                <ActionIcon onClick={() => deleteRadioItem(index)}>
                  <IconTrash size={ICON_SIZE} color="red" />
                </ActionIcon>
              </Flex>
              <TextInput
                label="Label"
                size="xs"
                value={child.props?.label}
                onChange={(e) =>
                  updateRadioItem(index, "label", e.target.value)
                }
              />
              <TextInput
                label="Value"
                size="xs"
                value={child.props?.value}
                onChange={(e) =>
                  updateRadioItem(index, "value", e.target.value)
                }
              />
            </Box>
          ))}
        </Stack>
        <TextInput
          label="Title"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedTreeComponentPropsUpdate("label", e.target.value);
          }}
        />
        <Select
          label="Type"
          size="xs"
          data={[
            { label: "Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Password", value: "password" },
          ]}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as string);
            debouncedTreeComponentPropsUpdate("type", value as string);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value as string);
          }}
        />
        <SwitchSelector
          topLabel="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(event) => {
            form.setFieldValue("withAsterisk", event.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "withAsterisk",
              event.currentTarget.checked
            );
          }}
        />
        <SizeSelector
          label="Label Spacing"
          {...form.getInputProps("labelProps")}
          onChange={(value) => {
            form.setFieldValue("labelProps", value as string);
            debouncedTreeComponentPropsUpdate("labelProps", {
              mb: value as string,
            });
          }}
        />
      </Stack>
    </form>
  );
});
