import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Box,
  Pagination as MantinePagination,
  PaginationProps,
} from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & PaginationProps;

const PaginationComponent = forwardRef(
  (
    { component, shareableContent, grid: { ChildrenWrapper }, ...props }: Props,
    ref,
  ) => {
    const { triggers, ...componentProps } = component.props as any;

    const { onChange, ...allTriggers } = triggers || {};

    const customOnChange = (value: any) => {
      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;
      updateTreeComponentAttrs({
        componentIds: [component.id!],
        attrs: { props: { value } },
      });
      onChange && onChange(value);
    };

    return (
      <Box unstyled style={props.style as any} {...props} {...allTriggers}>
        <MantinePagination
          ref={ref}
          {...componentProps}
          onChange={customOnChange}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            gridColumn: "1/-1",
            gridRow: "1/-1",
            gridArea: "1 / 1 / -1 / -1",
            padding: 0,
          }}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
PaginationComponent.displayName = "Pagination";

export const Pagination = memo(
  withComponentWrapper<Props>(PaginationComponent),
);
