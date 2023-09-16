import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & RadioProps;

const RadioItemComplexComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const {
    value,
    triggers,
    checked,
    isInsideGroup = false,
    children,
    ...componentProps
  } = component.props as any;

  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );

  const [_checked, setChecked] = useState<boolean>(
    isPreviewMode ? checked : false,
  );

  useEffect(() => {
    setTreeComponentCurrentState(
      component.id!,
      checked ? "checked" : "default",
    );
  }, [setTreeComponentCurrentState, checked, component.id]);

  const defaultTriggers = isPreviewMode
    ? isInsideGroup
      ? {}
      : {
          onChange: (e: any) => {
            setChecked(e.currentTarget.checked);
          },
        }
    : {
        onChange: (e: any) => {
          e?.preventDefault();
          e?.stopPropagation();
          setChecked(false);
        },
      };

  return (
    <MantineRadio
      {...props}
      {...componentProps}
      {...defaultTriggers}
      value={value}
      styles={{
        inner: { display: "none" },
        label: {
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
      label={
        <>
          <Icon
            name="IconCircleCheck"
            width={20}
            height={20}
            style={{ position: "absolute", right: 5, top: 5 }}
            color="white"
          />

          {component.children && component.children.length > 0
            ? component.children?.map((child) =>
                renderTree({
                  ...child,
                  props: {
                    ...child.props,
                  },
                }),
              )
            : children}
        </>
      }
      checked={isPreviewMode ? _checked : false}
    />
  );
};

export const RadioItemComplex = memo(RadioItemComplexComponent, isSame);
