import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";

type Props = {
  form: any;
};

export const VisibilityModifier = ({ form }: Props) => {
  return (
    <ComponentToBindFromInput
      {...form.getInputProps("onLoad.isVisible")}
      label="Visibility"
      fieldType="yesno"
    />
  );
};
