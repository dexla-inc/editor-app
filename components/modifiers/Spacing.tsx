import { SpacingControl } from "@/components/modifiers/SpacingControl";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel2 } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconBoxModel2;
export const label = "Spacing";

export const Modifier = withModifier(({ selectedComponent }) => {
  const initialValues = requiredModifiers.spacing;

  const form = useForm({
    initialValues: {
      showPadding: "padding-all",
      showMargin: "margin-all",
      ...initialValues,
    },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["style"]);

      form.setValues({
        // @ts-ignore
        padding: data.style.padding ?? initialValues.padding,
        paddingTop: data.style.paddingTop ?? initialValues.paddingTop,
        paddingBottom: data.style.paddingBottom ?? initialValues.paddingBottom,
        paddingLeft: data.style.paddingLeft ?? initialValues.paddingLeft,
        paddingRight: data.style.paddingRight ?? initialValues.paddingRight,
        margin: data.style.margin ?? initialValues.margin,
        marginTop: data.style.marginTop ?? initialValues.marginTop,
        marginBottom: data.style.marginBottom ?? initialValues.marginBottom,
        marginLeft: data.style.marginLeft ?? initialValues.marginLeft,
        marginRight: data.style.marginRight ?? initialValues.marginRight,
      });

      // Logic to set showPadding and showMargin values
      if (
        initialValues.paddingTop !== undefined ||
        initialValues.paddingBottom !== undefined ||
        initialValues.paddingLeft !== undefined ||
        initialValues.paddingRight !== undefined
      ) {
        form.setFieldValue("showPadding", "padding-sides");
      } else {
        form.setFieldValue("showPadding", "padding-all");
      }

      if (
        initialValues.marginTop !== undefined ||
        initialValues.marginBottom !== undefined ||
        initialValues.marginLeft !== undefined ||
        initialValues.marginRight !== undefined
      ) {
        form.setFieldValue("showMargin", "margin-sides");
      } else {
        form.setFieldValue("showMargin", "margin-all");
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
        <SpacingControl
          type="Margin"
          form={form}
          selectedComponentId={selectedComponent?.id as string}
        />
      </Stack>
    </form>
  );
});
