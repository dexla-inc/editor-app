import { EditableComponentMapper } from "@/utils/editor";
import { DrawerProps, Drawer as MantineDrawer } from "@mantine/core";
import { forwardRef, memo } from "react";
import { ModalAndDrawerWrapper } from "@/components/mapper/ModalAndDrawerWrapper";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & Omit<DrawerProps, "opened">;

export const DrawerComponent = forwardRef(
  (
    {
      renderTree,
      component,
      shareableContent,
      style,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
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
          return (
            <MantineDrawer
              ref={ref}
              withinPortal
              trapFocus={false}
              lockScroll={false}
              target={target}
              {...sizeProps}
              {...props}
              {...componentProps}
              title={title}
              opened={isPreviewMode ? true : showInEditor}
              onClose={handleClose}
              styles={{
                content: {
                  ...(style ?? {}),
                  minHeight: "90%",
                  display: "flex",
                  flexDirection: "column",
                },
                body: {
                  display: "grid",
                  gridTemplateColumns: "repeat(120, 1fr)",
                  gridAutoRows: "10px",
                  height: "90%",
                  flex: 1,
                  padding: 0,
                  position: "relative",
                },
                title: { ...titleStyle },
                // ...(isSizeFullScreen && { inner: { left: 0 } }),
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
