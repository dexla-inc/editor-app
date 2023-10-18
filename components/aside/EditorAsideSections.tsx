import { SidebarSection } from "@/components/SidebarSection";
import { ActionsFlow } from "@/components/actions/ActionsFlow";
import * as AccordionItemModifier from "@/components/modifiers/AccordionItem";
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
import * as NavLinkModifier from "@/components/modifiers/NavLink";
import * as PopOverModifier from "@/components/modifiers/PopOver";
import * as PositionModifier from "@/components/modifiers/Position";
import * as RadioModifier from "@/components/modifiers/Radio";
import * as RadioItemModifier from "@/components/modifiers/RadioItem";
import * as SelectModifier from "@/components/modifiers/Select";
import * as SizeModifier from "@/components/modifiers/Size";
import * as SpacingModifier from "@/components/modifiers/Spacing";
import * as StepperModifier from "@/components/modifiers/Stepper";
import * as SwitchModifier from "@/components/modifiers/Switch";
import * as TableModifier from "@/components/modifiers/Table";
import * as TextModifier from "@/components/modifiers/Text";
import * as TitleModifier from "@/components/modifiers/Title";
import { useEditorStore } from "@/stores/editor";
import { Action, actionMapper } from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { getComponentById } from "@/utils/editor";
import { Modifiers } from "@/utils/modifiers";
import {
  Box,
  Center,
  Flex,
  SegmentedControl,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowBadgeRight, IconBolt } from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { useEffect, useState } from "react";

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
  navLink: NavLinkModifier,
  accordionItem: AccordionItemModifier,
  switch: SwitchModifier,
};

type Tab = "design" | "actions";

export const EditorAsideSections = () => {
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);
  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const editorTree = useEditorStore((state) => state.tree);
  const openAction = useEditorStore((state) => state.openAction);
  const setOpenAction = useEditorStore((state) => state.setOpenAction);
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates,
  );
  const [tab, setTab] = useState<Tab>("design");

  useEffect(() => {
    selectedComponentId !== openAction?.componentId &&
      setOpenAction({ actionId: undefined, componentId: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

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

  const componentActions = component?.actions ?? [];
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

  const getActionsBySequentialToOrId = (id: string) => {
    return componentActions.filter(
      (a: Action) => a.id === id || a.sequentialTo === id,
    );
  };

  const copyAction = (id: string) => {
    setCopiedAction(getActionsBySequentialToOrId(id));
  };

  const removeAction = (id: string) => {
    const updatedActions = componentActions.filter(
      (a: Action) => a.id !== id && a.sequentialTo !== id,
    );
    updateTreeComponentActions(selectedComponentId!, updatedActions);
  };

  const baseItem = {
    isAction: true,
    removeAction,
    copyAction,
  };

  const renderSequentialActions = (action: Action) => {
    return getActionsBySequentialToOrId(action.id).map(
      (sequentialAction: Action) => {
        const sequentialActionName = sequentialAction.action.name;
        const ActionForm = actionMapper[sequentialActionName]?.form;

        const item = {
          ...baseItem,
          id: sequentialAction.id,
          label: `${startCase(sequentialAction.trigger)}: ${startCase(
            sequentialAction.action.name,
          )}`,
          initiallyOpened: openAction?.actionId === sequentialAction.id,
          my: 20,
        };

        return (
          sequentialAction.sequentialTo === action.id && (
            <SidebarSection
              icon={IconArrowBadgeRight}
              {...item}
              key={item.label}
            >
              <ActionForm id={sequentialAction.id} />
            </SidebarSection>
          )
        );
      },
    );
  };

  const actionsSections = componentActions.map((action: Action) => {
    const isSequential = !!action.sequentialTo;
    const actionName = action.action.name;

    const item = !isSequential
      ? {
          ...baseItem,
          id: action.id,
          label: `${startCase(action.trigger)}: ${startCase(actionName)}`,
          initiallyOpened: openAction?.actionId === action.id,
        }
      : undefined;

    if (!actionName) return undefined;

    const ActionForm = actionMapper[actionName]?.form;

    return (
      item && (
        <SidebarSection icon={IconBolt} {...item} key={item.label}>
          <ActionForm id={action.id} />
          {renderSequentialActions(action)}
        </SidebarSection>
      )
    );
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
          onChange={(value) => {
            setTab(value as Tab);
            setOpenAction({ actionId: undefined, componentId: undefined });
          }}
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
        {tab === "actions" && <ActionsFlow actionsSections={actionsSections} />}
      </Stack>
    </Stack>
  );
};
