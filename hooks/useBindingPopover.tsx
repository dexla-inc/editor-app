import { useVariableStore } from "@/stores/variables";
import { useDataContext } from "@/contexts/DataProvider";

type BindType = {
  selectedEntityId: string;
  entity: "auth" | "components" | "browser" | "variables";
};

export const useBindingPopover = () => {
  const { variables, components } = useDataContext()!;

  const getEntityEditorValue = ({ selectedEntityId, entity }: BindType) => {
    const entityHandlers = {
      auth: () => `${entity}['${selectedEntityId}']`,
      components: () =>
        `${entity}[/* ${components?.list[selectedEntityId].description} */'${selectedEntityId}']`,
      browser: () => `${entity}['${selectedEntityId}']`,
      variables: () => {
        try {
          const parsed = JSON.parse(selectedEntityId);
          return `${entity}[/* ${variables?.list[parsed.id].name} */ '${
            parsed.id
          }'].${parsed.path}`;
        } catch {
          return `${entity}[/* ${variables?.list[selectedEntityId].name} */ '${selectedEntityId}']`;
        }
      },
    };

    return entityHandlers[entity]();
  };

  return {
    getEntityEditorValue,
  };
};
