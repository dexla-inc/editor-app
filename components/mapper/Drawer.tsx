import { EditableComponentMapper } from "@/utils/editor";
import { DrawerProps, Drawer as MantineDrawer } from "@mantine/core";
import { forwardRef, memo } from "react";
import { ModalAndDrawerWrapper } from "@/components/mapper/ModalAndDrawerWrapper";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & Omit<DrawerProps, "opened">;

export const DrawerComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    return (
      <ModalAndDrawerWrapper component={component}>
        {({
          isPreviewMode,
          target,
          sizeProps,
          componentProps,
          showInEditor,
          handleClose,
          titleStyle,
          isSizeFullScreen,
          title,
        }) => {
          const { triggers, ...restComponentProps } = componentProps;
          return (
            <MantineDrawer
              ref={ref}
              withinPortal
              portalProps={{ ["data-id"]: props.id }}
              trapFocus={false}
              lockScroll={false}
              target={target}
              {...sizeProps}
              {...props}
              {...triggers}
              {...restComponentProps}
              title={title}
              opened={isPreviewMode ? true : showInEditor}
              onClose={handleClose}
              styles={{
                title: { ...titleStyle },
                body: { height: "fit-content", padding: 0 },
                ...(isSizeFullScreen && { inner: { left: 0 } }),
                inner: {},
              }}
            >
              {component.children?.map((child) =>
                renderTree(child, shareableContent),
              )}
            </MantineDrawer>
          );
        }}
      </ModalAndDrawerWrapper>
    );
  },
);

DrawerComponent.displayName = "Drawer";

export const Drawer = memo(withComponentWrapper<Props>(DrawerComponent));
