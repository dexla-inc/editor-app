import { ContextMenuPortal } from "mantine-contextmenu";
import { ContextMenuInstanceOptions } from "mantine-contextmenu/dist/ContextMenu";
import {
  ContextMenuOptions,
  ContextMenuProviderProps,
  ShowContextMenuFunction,
} from "mantine-contextmenu/dist/types";
import { createContext, useContext, useState } from "react";

export const MenuContext = createContext<{
  showContextMenu: ShowContextMenuFunction;
  destroy: () => void;
}>({ showContextMenu: () => () => undefined, destroy: () => {} });

/**
 * Provider that allows to show a context menu anywhere in your application.
 * If you wrap your application with this provider, you can use the `useContextMenu` hook
 * anywhere in the component tree to access a function that shows the context menu.
 */
export function ContextMenuProvider({
  zIndex = 9999,
  shadow = "sm",
  borderRadius = "xs",
  children,
}: ContextMenuProviderProps) {
  const [data, setData] = useState<
    (ContextMenuInstanceOptions & ContextMenuOptions) | null
  >(null);

  const destroy = () => {
    setData(null);
  };

  const showContextMenu: ShowContextMenuFunction =
    (content, options) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      setData({
        x: e.clientX,
        y: e.clientY,
        content,
        zIndex: options?.zIndex || zIndex,
        shadow: options?.shadow || shadow,
        borderRadius: options?.borderRadius || borderRadius,
        className: options?.className,
        style: options?.style,
        sx: options?.sx,
        classNames: options?.classNames,
        styles: options?.styles,
      });
    };

  return (
    <MenuContext.Provider value={{ showContextMenu, destroy }}>
      {children}
      {data && <ContextMenuPortal onHide={destroy} {...data} />}
    </MenuContext.Provider>
  );
}

/**
 * Hook returning a function that shows a context menu.
 */
export function useContextMenu() {
  return useContext(MenuContext);
}
