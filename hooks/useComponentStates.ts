import { useEditorTreeStore } from "@/stores/editorTree";

export const useComponentStates = (
  componentName: string = "",
  currentState: string = "",
) => {
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
    Popover: [
      { label: "Closed", value: "default" },
      { label: "Opened", value: "opened" },
    ],
    Toast: [
      { label: "Closed", value: "default" },
      { label: "Opened", value: "opened" },
    ],
    Drawer: [],
    Modal: [],
    BarChart: [],
    LineChart: [],
    PieChart: [],
    AreaChart: [],
    RadarChart: [],
    RadialChart: [],
    AppBar: [],
    Grid: [],
    GridColumn: [],
    Alert: [{ label: "Hover", value: "hover" }],
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
    const components = useEditorTreeStore
      .getState()
      .selectedComponentIds?.map(
        (id) => useEditorTreeStore.getState().componentMutableAttrs[id],
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

    const appearencesListValues = appearencesList.map(
      (state: any) => state.value,
    );

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

  const isDisabledState =
    ["Pagination"].includes(componentName) && currentState === "disabled";

  const handleComponentIfDisabledState = (e: any) => {
    if (isDisabledState) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return {
    getComponentsStates,
    handleComponentIfDisabledState,
    isDisabledState,
  };
};
