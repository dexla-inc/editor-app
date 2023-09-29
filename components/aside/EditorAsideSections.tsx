import { SidebarSection } from "@/components/SidebarSection";
import { ActionsForm } from "@/components/actions/ActionsForm";
import * as BackgroundModifier from "@/components/modifiers/Background";
import * as BorderModifier from "@/components/modifiers/Border";
import * as BoxShadowModifier from "@/components/modifiers/BoxShadow";
import * as ButtonModifier from "@/components/modifiers/Button";
import * as ButtonIconModifier from "@/components/modifiers/ButtonIcon";
import * as CheckboxModifier from "@/components/modifiers/Checkbox";
import * as DividerModifier from "@/components/modifiers/Divider";
import * as DrawerModifier from "@/components/modifiers/Drawer";
import * as EffectsModifier from "@/components/modifiers/Effects";
import * as FileButtonModifier from "@/components/modifiers/FileButton";
import * as GoogleMapModifier from "@/components/modifiers/GoogleMap";
import * as IconModifier from "@/components/modifiers/Icon";
import * as ImageModifier from "@/components/modifiers/Image";
import * as InputModifier from "@/components/modifiers/Input";
import * as LayoutModifier from "@/components/modifiers/Layout";
import * as LinkModifier from "@/components/modifiers/Link";
import * as ModalModifier from "@/components/modifiers/Modal";
import * as PopOverModifier from "@/components/modifiers/PopOver";
import * as PositionModifier from "@/components/modifiers/Position";
import * as RadioModifier from "@/components/modifiers/Radio";
import * as RadioItemModifier from "@/components/modifiers/RadioItem";
import * as SelectModifier from "@/components/modifiers/Select";
import * as SizeModifier from "@/components/modifiers/Size";
import * as SpacingModifier from "@/components/modifiers/Spacing";
import * as StepperModifier from "@/components/modifiers/Stepper";
import * as TableModifier from "@/components/modifiers/Table";
import * as TextModifier from "@/components/modifiers/Text";
import * as TitleModifier from "@/components/modifiers/Title";
import { useEditorStore } from "@/stores/editor";
import { Action, actionMapper } from "@/utils/actions";
import { Modifiers, componentMapper } from "@/utils/componentMapper";
import { getComponentById } from "@/utils/editor";
import {
  Box,
  Center,
  Flex,
  SegmentedControl,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { useState } from "react";

type SectionsMapper = {
  [key in Modifiers]: any;
};

const sectionMapper: SectionsMapper = {
  spacing: SpacingModifier,
  size: SizeModifier,
  text: TextModifier,
  border: BorderModifier,
  layout: LayoutModifier,
  background: BackgroundModifier,
  input: InputModifier,
  button: ButtonModifier,
  title: TitleModifier,
  image: ImageModifier,
  link: LinkModifier,
  icon: IconModifier,
  divider: DividerModifier,
  select: SelectModifier,
  position: PositionModifier,
  effects: EffectsModifier,
  modal: ModalModifier,
  boxShadow: BoxShadowModifier,
  checkbox: CheckboxModifier,
  table: TableModifier,
  radio: RadioModifier,
  radioItem: RadioItemModifier,
  drawer: DrawerModifier,
  buttonIcon: ButtonIconModifier,
  mapSettings: GoogleMapModifier,
  stepper: StepperModifier,
  fileButton: FileButtonModifier,
  popOver: PopOverModifier,
};

type Tab = "design" | "actions";

export const EditorAsideSections = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates,
  );
  const [tab, setTab] = useState<Tab>("design");

  const isContentWrapperSelected = selectedComponentId === "content-wrapper";

  if (!selectedComponentId || isContentWrapperSelected) {
    return (
      <Box p="xl">
        <Center>
          <Text size="xs" color="dimmed" align="center">
            You are unable to edit this Content Wrapper. Select another
            component to edit.
          </Text>
        </Center>
      </Box>
    );
  }

  const component = getComponentById(
    editorTree.root,
    selectedComponentId as string,
  );
  const mappedComponent = componentMapper[component?.name as string];

  const sections = mappedComponent?.modifiers?.map((id) => {
    const modifier = sectionMapper[id];

    return {
      id: id,
      label: modifier.label,
      icon: modifier.icon,
      initiallyOpened: id === "layout",
      Component: modifier.Modifier,
    };
  });

  const currentState =
    currentTreeComponentsStates?.[selectedComponentId!] ?? "default";

  const designSections = sections?.map(({ Component, ...item }) => (
    <SidebarSection {...item} key={item.label}>
      <Component key={currentState} />
    </SidebarSection>
  ));

  const actionsSections = (component?.actions ?? [])?.map((action: Action) => {
    const isSequential = !!action.sequentialTo;
    const sequentialToAction = isSequential
      ? (component?.actions ?? []).find(
          (a: Action) => a.id === action.sequentialTo,
        )
      : undefined;

    const item = {
      id: action.id,
      label: !!sequentialToAction
        ? `${startCase(sequentialToAction.trigger)} → ${startCase(
            action.trigger,
          )}`
        : startCase(action.trigger),
      icon: IconBolt, // Need to add an icon property to a trigger
      initiallyOpened: true,
    };

    const actionName = action.action.name;

    if (actionName) {
      const Component = actionMapper[actionName]?.form;

      return (
        <SidebarSection {...item} key={item.label}>
          <Component id={action.id} />
        </SidebarSection>
      );
    }
  });

  return (
    <Stack>
      <Flex px="md">
        <SegmentedControl
          size="xs"
          style={{ width: "100%" }}
          data={[
            { label: "Design", value: "design" },
            { label: "Actions", value: "actions" },
          ]}
          onChange={(value) => setTab(value as Tab)}
          value={tab}
        />
      </Flex>
      <Stack key={selectedComponentId} spacing="xs">
        {tab === "design" && (
          <Stack>
            <Select
              px="md"
              value={currentState}
              size="xs"
              label="State"
              data={[
                { label: "Default", value: "default" },
                { label: "Hover", value: "hover" },
                { label: "Disabled", value: "disabled" },
                { label: "Checked", value: "checked" },
                { label: "Hidden", value: "hidden" },
                { label: "Active", value: "Active" },
                { label: "Complete", value: "Complete" },
                ...Object.keys(component?.states ?? {}).reduce((acc, key) => {
                  if (
                    key === "hover" ||
                    key === "disabled" ||
                    key === "checked" ||
                    key === "hidden" ||
                    key === "Active" ||
                    key === "Complete"
                  )
                    return acc;

                  return acc.concat({
                    label: key,
                    value: key,
                  });
                }, [] as any[]),
              ]}
              placeholder="Select State"
              nothingFound="Nothing found"
              searchable
              creatable
              getCreateLabel={(query) => `+ Custom State "${query}"`}
              onCreate={(query) => {
                const item = { value: query, label: query };
                setTreeComponentCurrentState(selectedComponentId, query);
                updateTreeComponent(selectedComponentId, {}, true);
                return item;
              }}
              onChange={(value: string) => {
                setTreeComponentCurrentState(selectedComponentId, value);
              }}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
            />
            {designSections}
          </Stack>
        )}
        {tab === "actions" && (
          <Stack>
            <Box px="md">
              <ActionsForm />
            </Box>
            {actionsSections}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
