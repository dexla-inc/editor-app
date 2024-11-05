import { EditableComponentMapper } from "@/utils/editor";
import { DrawerProps, Drawer as MantineDrawer } from "@mantine/core";
import { forwardRef, memo } from "react";
import { ModalAndDrawerWrapper } from "@/components/mapper/ModalAndDrawerWrapper";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import get from "lodash.get";

type Props = EditableComponentMapper & Omit<DrawerProps, "opened">;

export const DrawerComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    //console.log("DrawerComponent", component);
    const { bgColor, ...componentProps } = component.props as any;
    const theme = useThemeStore((state) => state.theme);
    const bgColorHex = get(theme.colors, bgColor);

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
                header: {
                  backgroundColor: bgColorHex,
                },
                content: {
                  backgroundColor: bgColorHex,
                },
                title: { ...titleStyle },
                body: { height: "fit-content", padding: 0 },
                ...(isSizeFullScreen && { inner: { left: 0 } }),
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
