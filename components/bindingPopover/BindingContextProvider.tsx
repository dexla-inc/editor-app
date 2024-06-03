import { createContext, useContext } from "react";
import { useBindingPopover } from "@/hooks/data/useBindingPopover";
import { AuthState } from "@/stores/datasource";

export const BindingContext = createContext<{
  actions: Record<string, any>;
  variables: Record<string, any>;
  components: Record<string, any>;
  browserList: Record<string, any>;
  auth: (AuthState & { refreshToken?: string | undefined }) | null;
  event: Record<string, any>;
  getEntityEditorValue: any;
  item: Record<string, any>;
}>({
  actions: {},
  variables: {},
  components: {},
  browserList: {},
  auth: {},
  event: {},
  getEntityEditorValue: {},
  item: {},
});

export const BindingContextProvider = ({ children, isPageAction }: any) => {
  const {
    actions,
    variables,
    components,
    browserList,
    auth,
    event,
    getEntityEditorValue,
    item,
  } = useBindingPopover({ isPageAction });

  return (
    <BindingContext.Provider
      value={{
        actions,
        variables,
        components,
        browserList,
        auth,
        event,
        getEntityEditorValue,
        item,
      }}
    >
      {children}
    </BindingContext.Provider>
  );
};

export const useBindingContext = () => {
  return useContext(BindingContext);
};
