import SidebarSection from "@/components/SidebarSection";
import { StateSelector } from "@/components/aside/StateSelector";
import { Tab, useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { isRestrictedComponent } from "@/utils/common";
import { componentMapper } from "@/utils/componentMapper";
import {
  selectedComponentIdSelector,
  selectedComponentIdsSelector,
} from "@/utils/componentSelectors";
import { dataMapper } from "@/utils/dataMapper";
import {
  Box,
  Center,
  Flex,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import intersection from "lodash.intersection";
import { memo, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useEditorTreeStore } from "../../stores/editorTree";
import { WarningAlert } from "../Alerts";
import { ActionsTab, Data, modifierSectionMapper } from "./dynamicModifiers";

const EditorAsideSections = () => {
  const setOpenAction = useEditorStore((state) => state.setOpenAction);
  const initiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.initiallyOpenedModifiersByComponent,
  );
  const setInitiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.setInitiallyOpenedModifiersByComponent,
  );
  const selectedComponentId = useEditorTreeStore(selectedComponentIdSelector);
  const openAction = useEditorStore((state) => state.openAction);
  const asideSelectedTab = useEditorStore((state) => state.asideSelectedTab);
  const setAsideSelectedTab = useEditorStore(
    (state) => state.setAsideSelectedTab,
  );

  const componentName = useEditorTreeStore(
    useShallow((state) => {
      const selectedComponentId = selectedComponentIdSelector(state);
      return state.componentMutableAttrs[selectedComponentId!]?.name;
    }),
  );

  const hasActionsTriggers = useEditorTreeStore(
    useShallow((state) => {
      const selectedComponentId = selectedComponentIdSelector(state);
      if (isRestrictedComponent(selectedComponentId)) {
        return false;
      }
      return (
        (
          componentMapper[
            state.componentMutableAttrs[selectedComponentId!]?.name
          ]?.actionTriggers ?? []
        ).length > 0
      );
    }),
  );

  const mappedModifiers = useEditorTreeStore(
    useShallow((state) =>
      intersection(
        ...selectedComponentIdsSelector(state)?.map(
          (id) =>
            componentMapper[state.componentMutableAttrs[id]?.name]?.modifiers ??
            [],
        ),
      ),
    ),
  );

  useEffect(() => {
    selectedComponentId !== openAction?.componentId &&
      setOpenAction({ actionIds: undefined, componentId: undefined });
    setAsideSelectedTab("design");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  if (!componentName) {
    return (
      <Box p="xl">
        <Center>
          <Text size="xs" color="dimmed" align="center">
            You are unable to edit the Body. Select another component to edit.
          </Text>
        </Center>
      </Box>
    );
  }

  const sections = mappedModifiers?.map((id) => {
    const modifier = modifierSectionMapper[id];

    return {
      id: id,
      label: id,
      icon: modifier.icon,
      initiallyOpened:
        initiallyOpenedModifiersByComponent[componentName]?.includes(id),
      Component: modifier.Modifier,
      onClick: (id: string, isOpen: boolean) => {
        setInitiallyOpenedModifiersByComponent(componentName, id, isOpen);
      },
    };
  });

  const designSections = sections?.map(({ Component, ...item }) => (
    <SidebarSection {...item} key={item.label}>
      <Component initiallyOpened={item.initiallyOpened} />
    </SidebarSection>
  ));

  // @ts-ignore
  const DataSection = dataMapper[componentName];

  const tabs = [
    { label: "Design", value: "design" },
    {
      label: "Data",
      value: "data",
    },
    {
      label: "Actions",
      value: "actions",
    },
  ].filter((_, i) => [true, !!DataSection, hasActionsTriggers][i]);

  return (
    <Stack>
      <Flex px="md">
        <SegmentedControl
          key={JSON.stringify(tabs)}
          size="xs"
          style={{ width: "100%" }}
          data={tabs}
          onChange={(value: Tab) => {
            setAsideSelectedTab(value);
            setOpenAction({ actionIds: undefined, componentId: undefined });
          }}
          value={asideSelectedTab}
        />
      </Flex>
      {asideSelectedTab === "design" && (
        <Stack spacing="xs">
          {componentName && <StateSelector componentName={componentName} />}
          {["Select", "AutoComplete"].includes(componentName) && (
            <WarningAlert
              title="Warning"
              size="xs"
              text="Custom dropdown may interfere with the scroll behaviour of the
              page."
            />
          )}
          {designSections}
        </Stack>
      )}
      {asideSelectedTab === "data" && <Data />}
      {asideSelectedTab === "actions" && <ActionsTab />}
    </Stack>
  );
};

export default memo(EditorAsideSections);
