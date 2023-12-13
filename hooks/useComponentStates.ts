import { useEditorStore } from "@/stores/editor";
import { getAllComponentsByIds, getAllComponentsByName } from "@/utils/editor";

export const useComponentStates = () => {
  const selectedComponentIds = useEditorStore(
    (state) => state.selectedComponentIds ?? [],
  );
  const editorTreeRoot = useEditorStore((state) => state.tree.root);

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
    const allParents = getAllComponentsByName(editorTreeRoot, childOf);

    return allParents
      .flatMap((parent) => {
        return getAllComponentsByIds(parent, selectedComponentIds);
      })
      .some((component) => component !== null);
  };

  const getComponentsStates = () => {
    const components = getAllComponentsByIds(
      editorTreeRoot,
      selectedComponentIds,
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
