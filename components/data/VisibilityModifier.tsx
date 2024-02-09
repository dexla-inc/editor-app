import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { useDataContext } from "@/contexts/DataProvider";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { Stack } from "@mantine/core";
import { Fragment } from "react";
import { ComponentToBindWrapper } from "../ComponentToBindWrapper";

type Props = {
  form: any;
  componentId: string;
  componentName: string;
  isVisibilityActionForm?: boolean;
};

export const VisibilityModifier = ({
  componentName,
  form,
  isVisibilityActionForm,
}: Props) => {
  const { computeValue } = useDataContext()!;
  const inputKey = isVisibilityActionForm
    ? "visibilityType"
    : "props.style.display";

  const inputProps = form.getInputProps(inputKey);
  const defaultValue = getComponentInitialDisplayValue(componentName);
  const visibleValue =
    typeof inputProps.value === "string"
      ? inputProps.value
      : computeValue({
          value: inputProps.value,
          staticFallback: defaultValue,
        });

  const Wrapper = isVisibilityActionForm ? Fragment : ComponentToBindWrapper;
  const InnerWrapper = isVisibilityActionForm ? Fragment : Stack;

  const baseVisibilityOptions = [
    {
      label: "Visible",
      value: getComponentInitialDisplayValue(componentName),
    },
    {
      label: "Hidden",
      value: "none",
    },
  ];

  const visibilityOptions = isVisibilityActionForm
    ? [{ label: "Toggle", value: "toggle" }, ...baseVisibilityOptions]
    : baseVisibilityOptions;

  const otherInputProps = {
    value: visibleValue,
    onChange: (_value: string) => {
      form.setFieldValue(inputKey, {
        ...inputProps.value,
        dataType: "static",
        static: _value,
      });
    },
  };

  return (
    <Wrapper {...inputProps}>
      <InnerWrapper w="100%">
        <SegmentedControlInput
          label="Visibility"
          data={visibilityOptions}
          {...inputProps}
          {...(!isVisibilityActionForm && otherInputProps)}
        />
      </InnerWrapper>
    </Wrapper>
  );
};
