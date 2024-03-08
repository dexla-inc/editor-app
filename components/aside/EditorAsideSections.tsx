import SidebarSection from "@/components/SidebarSection";
import { StateSelector } from "@/components/aside/StateSelector";

import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper } from "@/utils/componentMapper";
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
import { useDeferredValue, useState } from "react";
import { ActionsTab, Data, modifierSectionMapper } from "./dynamicModifiers";

type Tab = "design" | "data" | "actions";

const EditorAsideSections = () => {
  const _selectedComponentId = useEditorStore(
    (state) => state.selectedComponentIds?.at(-1),
  );

  const setOpenAction = useEditorStore((state) => state.setOpenAction);
  const selectedComponentId = useDeferredValue(_selectedComponentId);
  const currentState = useEditorStore(
    (state) =>
      state.currentTreeComponentsStates?.[selectedComponentId!] ?? "default",
  );
  const initiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.initiallyOpenedModifiersByComponent,
  );
  const setInitiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.setInitiallyOpenedModifiersByComponent,
  );

  const [tab, setTab] = useState<Tab>("design");

  const component = useEditorStore(
    (state) => state.componentMutableAttrs[selectedComponentId!],
  );
  const componentName = component?.name ?? "content-wrapper";

  const components = useEditorStore(
    (state) =>
      (state.selectedComponentIds ?? [])?.map(
        (id) => state.componentMutableAttrs[id],
      ),
  );

  const isMappedComponent = components.some(
    (c) => componentMapper[c?.name as string],
  );

  // useEffect(() => {
  //   selectedComponentId !== openAction?.componentId &&
  //     setOpenAction({ actionIds: undefined, componentId: undefined });
  //   setTab("design");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedComponentId]);

  const isContentWrapperSelected = selectedComponentId === "content-wrapper";

  if (!isMappedComponent || isContentWrapperSelected) {
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

  const mappedModifiers = intersection(
    ...components.map((c) => componentMapper[c?.name as string]?.modifiers),
  );

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
      <Component key={currentState} initiallyOpened={item.initiallyOpened} />
    </SidebarSection>
  ));

  // @ts-ignore
  const DataSection = dataMapper[componentName];

  const tabs = [
    { label: "Design", value: "design" },
    {
      label: "Data",
      value: "data",
      //disabled: (selectedComponentIds ?? []).length > 1,
    },
    {
      label: "Actions",
      value: "actions",
      //disabled: (selectedComponentIds ?? []).length > 1,
    },
  ].filter(
    (item) => item.value !== "data" || (item.value === "data" && DataSection),
  );

  return (
    <Stack>
      <Flex px="md">
        <SegmentedControl
          key={JSON.stringify(tabs)}
          size="xs"
          style={{ width: "100%" }}
          data={tabs}
          onChange={(value) => {
            setTab(value as Tab);
            setOpenAction({ actionIds: undefined, componentId: undefined });
          }}
          value={tab}
        />
      </Flex>
      {tab === "design" && (
        <Stack spacing="xs">
          {selectedComponentId && (
            <StateSelector componentName={componentName} />
          )}
          {designSections}
        </Stack>
      )}
      {tab === "data" && <Data component={component!} />}
      {tab === "actions" && <ActionsTab component={component!} />}
    </Stack>
  );
};

export default EditorAsideSections;
