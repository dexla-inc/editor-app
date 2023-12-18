import { useEditorStore } from "@/stores/editor";
import { getAllComponentsByIds, getAllComponentsByName } from "@/utils/editor";

export const useComponentStates = () => {
  const selectedComponentIds = useEditorStore(
    (state) => state.selectedComponentIds ?? [],
  );
  const editorTreeRoot = useEditorStore((state) => state.tree.root);

  const statesByComponent = {
    _: [{ label: "Default", value: "default" }],
    Common: [
      { label: "Hover", value: "hover" },
      { label: "Disabled", value: "disabled" },
      { label: "Focused", value: "focused" },
    ],
    Button: [{ label: "Selected", value: "selected" }],
    Select: [{ label: "Selected", value: "selected" }],
    Checkbox: [{ label: "Checked", value: "checked" }],
    Navbar: [{ label: "Collapsed", value: "collapsed" }],
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
        // Append component-specific states if available, otherwise use Common states
        if (componentStates && componentStates.length > 0) {
          return acc.concat(componentStates);
        } else {
          return acc.concat(statesByComponent.Common);
        }
      },
      [...statesByComponent._], // Starting with the states under '_'
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
