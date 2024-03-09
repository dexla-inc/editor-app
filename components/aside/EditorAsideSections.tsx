import SidebarSection from "@/components/SidebarSection";
import { StateSelector } from "@/components/aside/StateSelector";

import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper } from "@/utils/componentMapper";
import { dataMapper } from "@/utils/dataMapper";
import { Component } from "@/utils/editor";
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
import { useEditorTreeStore } from "../../stores/editorTree";
import { ActionsTab, Data, modifierSectionMapper } from "./dynamicModifiers";

type Tab = "design" | "data" | "actions";

const EditorAsideSections = () => {
  // const _selectedComponentId = useEditorTreeStore(
  //   (state) => state.selectedComponentIds?.at(-1),
  // );
  const selectedComponentId = "D_PsEe4oKZYbZ1uQ1gJeQ";
  const selectedComponentIds = ["main-content"];
  console.log("EditorAsideSections");

  const setOpenAction = useEditorStore((state) => state.setOpenAction);
  //const selectedComponentId = useDeferredValue(_selectedComponentId);
  // const initiallyOpenedModifiersByComponent = useUserConfigStore(
  //   (state) => state.initiallyOpenedModifiersByComponent,
  // );
  const setInitiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.setInitiallyOpenedModifiersByComponent,
  );

  const [tab, setTab] = useState<Tab>("design");

  const componentName = "main-content";
  // const componentName = useEditorTreeStore(
  //   (state) =>
  //     state.componentMutableAttrs[selectedComponentId!]?.name ??
  //     "content-wrapper",
  // );

  const componentMutableAttrs = useEditorTreeStore(
    (state) => state.componentMutableAttrs,
  );

  const mappedModifiers = intersection(
    ...selectedComponentIds.map((id) => {
      const componentName = componentMutableAttrs[id]?.name;
      return componentMapper[componentName]?.modifiers ?? [];
    }),
  );

  // useEffect(() => {
  //   selectedComponentId !== openAction?.componentId &&
  //     setOpenAction({ actionIds: undefined, componentId: undefined });
  //   setTab("design");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedComponentId]);

  const isContentWrapperSelected = false; //selectedComponentId === "content-wrapper";

  if (isContentWrapperSelected) {
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

  // const sections = mappedModifiers?.map((id) => {
  //   const modifier = modifierSectionMapper[id];

  //   return {
  //     id: id,
  //     label: id,
  //     icon: modifier.icon,
  //     // initiallyOpened:
  //     //   initiallyOpenedModifiersByComponent[componentName]?.includes(id),
  //     Component: modifier.Modifier,
  //     onClick: (id: string, isOpen: boolean) => {
  //       setInitiallyOpenedModifiersByComponent(componentName, id, isOpen);
  //     },
  //   };
  // });

  // const designSections = sections?.map(({ Component, ...item }) => (
  //   <SidebarSection {...item} key={item.label}>
  //     <Component initiallyOpened={item.initiallyOpened} />
  //   </SidebarSection>
  // ));

  // @ts-ignore
  //const DataSection = dataMapper[componentName];

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
  ];
  // .filter(
  //   (item) => item.value !== "data" || (item.value === "data" && DataSection),
  // );

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
          {/* {selectedComponentId && (
            <StateSelector componentName={componentName} />
          )} */}
          {/* {designSections} */}
        </Stack>
      )}
      {tab === "data" && <Data />}
      {tab === "actions" && <ActionsTab />}
    </Stack>
  );
};

export default EditorAsideSections;
