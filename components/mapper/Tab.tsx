import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { getColorValue } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Tabs as MantineTabs, TabProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & TabProps;

const TabComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, icon, iconColor, ...componentProps } =
      component.props as any;
    const theme = useEditorStore((state) => state.theme);

    return (
      <MantineTabs.Tab
        ref={ref}
        icon={
          icon ? (
            <Icon
              name={icon}
              {...(iconColor
                ? { color: getColorValue(theme, iconColor) }
                : null)}
            />
          ) : null
        }
        {...props}
        {...componentProps}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineTabs.Tab>
    );
  },
);
TabComponent.displayName = "Tab";

export const Tab = memo(withComponentWrapper<Props>(TabComponent), isSame);
