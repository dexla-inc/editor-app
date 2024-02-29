import { useDataContext } from "@/contexts/DataProvider";

type BindType = {
  selectedEntityId: string;
  entity: "auth" | "components" | "browser" | "variables" | "actions";
};

const setEntityString = ({ selectedEntityId, entity }: BindType) => {
  const [entityKey, entityId] = selectedEntityId.split(".");
  const path = !entityId ? "" : `.${entityId}`;
  return `${entity}['${entityKey}']${path}`;
};

export const useBindingPopover = () => {
  const { variables, components, actions } = useDataContext()!;

  const getEntityEditorValue = ({ selectedEntityId, entity }: BindType) => {
    const entityHandlers = {
      auth: () => setEntityString({ selectedEntityId, entity }),
      components: () =>
        `${entity}[/* ${components?.list[selectedEntityId].description} */'${selectedEntityId}']`,
      actions: () => {
        const parsed = JSON.parse(selectedEntityId);
        return `${entity}[/* ${actions?.list[parsed.id].name} */ '${
          parsed.id
        }'].${parsed.path}`;
      },
      browser: () => setEntityString({ selectedEntityId, entity }),
      variables: () => {
        try {
          const parsed = JSON.parse(selectedEntityId);
          return `${entity}[/* ${variables?.list[parsed.id].name} */ '${
            parsed.id
          }']${parsed.path.replace("value", "")}`;
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
