import { useEditorStore } from "@/stores/editor";
import { getAllComponentsByIds } from "@/utils/editor";

export const useComponentStates = () => {
  const selectedComponentIds = useEditorStore(
    (state) => state.selectedComponentIds ?? [],
  );
  const editorTreeRoot = useEditorStore((state) => state.tree.root);

  type ComponentAppearence = {
    label: string;
    value: string;
  };

  type ComponentAppearences = {
    [componentName: string]: ComponentAppearence[];
  };

  const appearencesForAllComponents = [{ label: "Default", value: "default" }];

  const appearencesByComponent: ComponentAppearences = {
    Common: [
      { label: "Hover", value: "hover" },
      { label: "Disabled", value: "disabled" },
      { label: "Selected", value: "selected" },
    ],
    Checkbox: [
      { label: "Hover", value: "hover" },
      { label: "Disabled", value: "disabled" },
      { label: "Checked", value: "checked" },
    ],
    Switch: [
      { label: "Hover", value: "hover" },
      { label: "Disabled", value: "disabled" },
      { label: "Checked", value: "checked" },
    ],
    Text: [{ label: "Hover", value: "hover" }],
    Title: [{ label: "Hover", value: "hover" }],
    Navbar: [{ label: "Collapsed", value: "collapsed" }],
    NavLink: [
      { label: "Hover", value: "hover" },
      { label: "Disabled", value: "disabled" },
      { label: "Active", value: "active" },
    ],
    StepperStepHeader: [
      { label: "Active", value: "Active" },
      { label: "Complete", value: "Complete" },
    ],
    Modal: [
      { label: "Closed", value: "default" },
      { label: "Opened", value: "opened" },
    ],
    Popover: [
      { label: "Closed", value: "default" },
      { label: "Opened", value: "opened" },
    ],
    Toast: [
      { label: "Closed", value: "default" },
      { label: "Opened", value: "opened" },
    ],
    Drawer: [
      { label: "Closed", value: "default" },
      { label: "Opened", value: "opened" },
    ],
    BarChart: [],
    LineChart: [],
    PieChart: [],
    AreaChart: [],
    RadarChart: [],
    RadialChart: [],
    AppBar: [],
    Progress: [
      { label: "Loading", value: "loading" },
      { label: "Complete", value: "complete" },
    ],
    FileUpload: [
      { label: "Uploading", value: "uploading" },
      { label: "Uploaded", value: "uploaded" },
    ],
    FileButton: [
      { label: "Uploading", value: "uploading" },
      { label: "Uploaded", value: "uploaded" },
    ],
  };

  const getComponentsStates = () => {
    const components = getAllComponentsByIds(
      editorTreeRoot,
      selectedComponentIds,
    );

    const componentNames = [
      ...new Set(components?.map((component) => component?.name)),
    ];

    const appearencesList = componentNames?.reduce((acc, name) => {
      const initialAcc = ["Toast", "Drawer", "Popover", "Modal"].includes(name)
        ? [...acc]
        : [...acc, ...appearencesForAllComponents];

      const componentSpecificAppearences =
        appearencesByComponent[name as keyof typeof appearencesByComponent];
      const combinedComponentAppearences = componentSpecificAppearences
        ? componentSpecificAppearences
        : appearencesByComponent.Common;

      // Combine the states ensuring no duplicates
      return [...new Set([...initialAcc, ...combinedComponentAppearences])];
    }, [] as ComponentAppearence[]);

    const appearencesListValues = appearencesList.map((state) => state.value);

    const customAppearences = [
      ...new Set(
        components?.reduce((acc, component) => {
          const componentCustomAppearences = Object.keys(
            component?.states ?? {},
          )?.filter((state) => !appearencesListValues.includes(state));
          acc.push(...componentCustomAppearences);
          return acc;
        }, [] as string[]),
      ),
    ].map((state) => ({ label: state, value: state }));

    return appearencesList.concat(...(customAppearences ?? []));
  };

  return {
    getComponentsStates,
  };
};
