import { SpacingControl } from "@/components/modifiers/SpacingControl";
import { withModifier } from "@/hoc/withModifier";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel2 } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconBoxModel2;
export const label = "Spacing";

export const Modifier = withModifier(({ selectedComponent }) => {
  const initialValues = requiredModifiers.spacing;
  const style = selectedComponent?.props?.style;

  const isPaddingAllSame =
    style?.paddingTop === style?.paddingBottom &&
    style?.paddingTop === style?.paddingLeft &&
    style?.paddingTop === style?.paddingRight;

  const form = useForm({
    initialValues: {
      showPadding: isPaddingAllSame ? "padding-all" : "padding-sides",
      ...initialValues,
    },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["style"]);

      if (data.style) {
        form.setValues({
          // @ts-ignore
          padding: data.style.padding ?? initialValues.padding,
          paddingTop:
            data.style.paddingTop ??
            data.style.padding ??
            initialValues.paddingTop,
          paddingBottom:
            data.style.paddingBottom ??
            data.style.padding ??
            initialValues.paddingBottom,
          paddingLeft:
            data.style.paddingLeft ??
            data.style.padding ??
            initialValues.paddingLeft,
          paddingRight:
            data.style.paddingRight ??
            data.style.padding ??
            initialValues.paddingRight,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form key={selectedComponent?.id}>
      <Stack spacing="xs">
        <SpacingControl
          type="Padding"
          form={form}
          selectedComponentId={selectedComponent?.id as string}
        />
      </Stack>
    </form>
  );
});
