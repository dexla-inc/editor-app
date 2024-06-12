import { BindingField } from "@/components/editor/BindingField/BindingField";

type Props = {
  form: any;
};

export const VisibilityModifier = ({ form }: Props) => {
  return (
    <BindingField
      {...form.getInputProps("onLoad.isVisible")}
      label="Visibility"
      fieldType="YesNo"
    />
  );
};
