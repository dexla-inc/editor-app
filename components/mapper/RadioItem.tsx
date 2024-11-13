import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Box,
  Radio as MantineRadio,
  RadioProps as MantineRadioProps,
} from "@mantine/core";
import { ForwardedRef, forwardRef, memo } from "react";
import { useShallow } from "zustand/react/shallow";

// This is needed as RadioProps omits the ref prop
interface RadioProps extends MantineRadioProps {
  ref?: ForwardedRef<HTMLInputElement>;
}

type Props = EditableComponentMapper & RadioProps;

const RadioItemComponent = forwardRef<HTMLInputElement, Props>(
  (
    {
      renderTree,
      component,
      shareableContent,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const {
      value: defaultValue,
      children,
      triggers,
      ...componentProps
    } = component.props as any;

    const { value = defaultValue } = component.onLoad ?? {};
    const { value: parentValue } = shareableContent;
    const checked = parentValue === String(value);

    return (
      <Box unstyled {...props} {...triggers}>
        <MantineRadio
          ref={ref}
          {...componentProps}
          label={
            <div
              {...(isPreviewMode && { id: component.id })}
              {...triggers}
              style={{
                display: "grid",
                gridTemplateColumns: "subgrid",
                gridTemplateRows: "subgrid",
              }}
            >
              {component.children?.map((child) =>
                renderTree(child, {
                  ...shareableContent,
                  ...(checked && {
                    parentState: "checked",
                  }),
                }),
              )}
            </div>
          }
          value={value}
          styles={{
            root: {
              gridArea: "1/1/-1/-1",
            },
            inner: { display: "none" },
            label: {
              padding: 0,
            },
            labelWrapper: { width: "100%" },
          }}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);

RadioItemComponent.displayName = "RadioItem";

export const RadioItem = memo(withComponentWrapper<Props>(RadioItemComponent));
