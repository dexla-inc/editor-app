import { useEditorStore } from "@/stores/editor";
import { getAllComponentsByName, getComponentById } from "@/utils/editor";

export const useComponentStates = () => {
  const statesByComponent = {
    Default: [
      { label: "Default", value: "default" },
      { label: "Hover", value: "hover" },
      { label: "Disabled", value: "disabled" },
    ],
    Checkbox: [{ label: "Checked", value: "checked" }],
    Navbar: [{ label: "Collapse", value: "collapse" }],
  };

  const handleChildOf = (childOf: string) => {
    const editorTree = useEditorStore.getState().tree;
    const selectedComponentIds = useEditorStore.getState().selectedComponentIds;

    const allParents = getAllComponentsByName(editorTree.root, childOf);

    return allParents
      .flatMap((parent) => {
        return selectedComponentIds?.map((selectedComponentId) =>
          getComponentById(parent, selectedComponentId),
        );
      })
      .some((component) => component !== null);
  };

  const getComponentsStates = () => {
    const editorTree = useEditorStore.getState().tree;
    const selectedComponentIds = useEditorStore.getState().selectedComponentIds;

    const components = selectedComponentIds?.map((selectedComponentId) =>
      getComponentById(editorTree.root, selectedComponentId),
    );

    const isStepperHeaderChild = handleChildOf("StepperStepHeader");
    const isNavbarChild = handleChildOf("Navbar");

    const componentNames = [
      ...new Set(components?.map((component) => component?.name)),
    ];

    const statesList = componentNames?.reduce(
      (acc, name) => {
        const componentStates =
          statesByComponent[name as keyof typeof statesByComponent];
        if (componentStates) {
          return acc.concat(...componentStates);
        }

        return acc;
      },
      [...statesByComponent.Default],
    );

    if (isStepperHeaderChild) {
      statesList.push(
        ...[
          { label: "Active", value: "Active" },
          { label: "Complete", value: "Complete" },
        ],
      );
    }

    if (isNavbarChild) {
      statesList.push(...statesByComponent.Navbar);
    }

    const statesListValues = statesList.map((state) => state.value);

    const customStates = [
      ...new Set(
        components?.reduce((acc, component) => {
          const componentCustomStates = Object.keys(
            component?.states ?? {},
          )?.filter((state) => !statesListValues.includes(state));
          acc.push(...componentCustomStates);
          return acc;
        }, [] as string[]),
      ),
    ].map((state) => ({ label: state, value: state }));

    return statesList.concat(...(customStates ?? []));
  };

  return {
    getComponentsStates,
  };
};
