import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";
import { useCallback } from "react";

type ComponentAppearance = {
  label: string;
  value: string;
};

type ComponentAppearances = {
  [componentName: string]: ComponentAppearance[];
};

const appearencesForAllComponents = [{ label: "Default", value: "default" }];

const appearencesByComponent: ComponentAppearances = {
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
  Badge: [{ label: "Hover", value: "hover" }],
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

export const useComponentStates = () => {
  const components = useEditorTreeStore(
    useShallow((state) => [
      ...new Set(
        state.selectedComponentIds?.map((id) =>
          pick(state.componentMutableAttrs[id], ["name", "states"]),
        ),
      ),
    ]),
  );

  const getComponentsStates = useCallback(() => {
    const appearencesList = components?.reduce((acc, component) => {
      const initialAcc = ["Toast", "Drawer", "Popover", "Modal"].includes(
        component.name,
      )
        ? [...acc]
        : [...acc, ...appearencesForAllComponents];

      const componentSpecificAppearences =
        appearencesByComponent[
          component.name as keyof typeof appearencesByComponent
        ];
      const combinedComponentAppearences = componentSpecificAppearences
        ? componentSpecificAppearences
        : appearencesByComponent.Common;

      // Combine the states ensuring no duplicates
      return [...new Set([...initialAcc, ...combinedComponentAppearences])];
    }, [] as ComponentAppearance[]);

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
  }, [components]);

  return {
    getComponentsStates,
  };
};
