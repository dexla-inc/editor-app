// import debounce from "lodash.debounce";
import { SortableTreeItem } from "@/components/SortableTreeItem";
import { useDraggable } from "@/hooks/useDraggable";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import { Component, checkIfIsDirectAncestor } from "@/utils/editor";
import {
  ActionIcon,
  Card,
  CardProps,
  Collapse,
  Group,
  List,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../Icon";

type ListItemProps = {
  component: Component;
  level?: number;
  openCustom: any;
  test: any;
  counter: any;
} & CardProps;

const debounce = (callback: any, wait: number) => {
  let timeoutId: any = null;
  return (...args: any[]) => {
    //console.log({ timeoutId });
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

const ListItem = ({
  component,
  children,
  level = 0,
  openCustom,
  test,
  counter,
}: ListItemProps) => {
  const theme = useMantineTheme();
  const { ref, hovered } = useHover();
  const editorTree = useEditorStore((state) => state.tree);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const [opened, { toggle, open }] = useDisclosure(false);
  // console.log({ currentTargetId });

  const onDragStart = useOnDragStart();

  const draggable = useDraggable({
    id: `layer-${component.id}`,
    onDragStart,
  });

  const handleSelection = (id: string) => {
    if (id !== "root") {
      setSelectedComponentId(id as string);
    }
  };

  const canExpand = (component.children ?? [])?.length > 0;
  // const isCurrentTarget = currentTargetId === `layer-${component.id}`;

  // const openCustom: any = useMemo(
  //   () =>
  //     debounce(() => {
  //       const isAncestorOfSelectedComponent =
  //         component.id && selectedComponentId
  //           ? checkIfIsDirectAncestor(
  //               editorTree.root,
  //               selectedComponentId,
  //               component.id
  //             )
  //           : false;
  //
  //       if (
  //         component.id === selectedComponentId ||
  //         isAncestorOfSelectedComponent ||
  //         isCurrentTarget
  //       ) {
  //         open();
  //       }
  //     }, 3000),
  //   [selectedComponentId, open, component.id, isCurrentTarget, editorTree.root]
  // );

  // useEffect(() => {
  //   openCustom(selectedComponentId, open, component);
  // }, [openCustom, selectedComponentId, open, component]);

  useEffect(
    () => test(selectedComponentId, open, component, opened),
    [openCustom, selectedComponentId, open, component, test]
  );

  const icon = structureMapper[component.name as string]?.icon;
  const componentActions = component.props?.actions;

  return (
    <>
      <Card
        ref={ref}
        p={`0 ${15 * level}px`}
        w="100%"
        bg={hovered ? "gray.1" : undefined}
        sx={{
          cursor: "move",
          border:
            selectedComponentId === component.id
              ? `1px solid ${theme.colors.teal[6]}`
              : undefined,
          display: "flex",
          position: "relative",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelection(component.id as string);
        }}
      >
        <Group position="apart" noWrap>
          <Group spacing={4} noWrap w="100%">
            <ActionIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
              }}
              sx={{
                visibility: canExpand ? "visible" : "hidden",
                pointerEvents: canExpand ? "all" : "none",
                width: canExpand ? "auto" : 0,
                minWidth: canExpand ? "auto" : 0,
                cursor: "pointer",
              }}
            >
              <IconChevronDown
                size={ICON_SIZE}
                style={{
                  transition: "transform 200ms ease",
                  transform: opened ? `none` : "rotate(-90deg)",
                }}
              />
            </ActionIcon>
            {component.id !== "root" && icon}
            <Text
              id={`layer-${component.id}`}
              size="xs"
              lineClamp={1}
              sx={{ cursor: "move", width: "100%" }}
              {...draggable}
            >
              {component.id === "root"
                ? "Body"
                : component.id === "content-wrapper"
                ? "Content Wrapper"
                : component.name}
            </Text>
          </Group>
        </Group>
        {componentActions && !!componentActions.length && (
          <ActionIcon
            color="teal"
            variant="transparent"
            size={30}
            sx={{ position: "absolute", right: "0%" }}
          >
            <Icon name="IconBolt" size={ICON_SIZE} />
          </ActionIcon>
        )}
      </Card>
      <Collapse
        key={`${component.id}-${opened}`}
        in={component.id === "root" || opened}
      >
        {children}
      </Collapse>
    </>
  );
};

const ListItemWrapper = ({
  component,
  children,
  level,
  openCustom,
  test,
  counter,
}: ListItemProps) => {
  return (
    <SortableTreeItem component={component}>
      <List.Item key={component.id} w="100%">
        <ListItem
          component={component}
          level={level}
          openCustom={openCustom}
          test={test}
          counter={counter}
        >
          {(component.children ?? [])?.length > 0 && (
            <List
              size="xs"
              listStyleType="none"
              styles={{
                itemWrapper: {
                  width: "100%",
                },
              }}
            >
              {children}
            </List>
          )}
        </ListItem>
      </List.Item>
    </SortableTreeItem>
  );
};

export const EditorNavbarLayersSection = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const [counter, setCounter] = useState(0);
  const ref = useRef({
    currentTargetId,
  });

  const openCustom: any = useMemo(
    () =>
      debounce((selectedComponentId: any, open: any, component: any) => {
        console.log("test", { currentTargetId: ref.current.currentTargetId });
        //setCounter((prev) => ++prev);

        // const isCurrentTarget = currentTargetId === `layer-${component.id}`;
        // const isAncestorOfSelectedComponent =
        //   component.id && selectedComponentId
        //     ? checkIfIsDirectAncestor(
        //         editorTree.root,
        //         selectedComponentId,
        //         component.id
        //       )
        //     : false;

        // console.log(
        //   component.id === selectedComponentId,
        //   isAncestorOfSelectedComponent,
        //   isCurrentTarget
        // );
        // if (
        //   component.id === selectedComponentId ||
        //   isAncestorOfSelectedComponent ||
        //   isCurrentTarget
        // ) {
        //   open();
        // }
      }, 2000),
    [editorTree.root, currentTargetId]
  );

  const test = useMemo(
    () =>
      debounce(
        (selectedComponentId: any, open: any, component: any, opened: any) => {
          console.log("carai");

          const isAncestorOfSelectedComponent =
            component.id && selectedComponentId
              ? checkIfIsDirectAncestor(
                  editorTree.root,
                  selectedComponentId,
                  component.id
                )
              : false;

          if (
            component.id === selectedComponentId ||
            isAncestorOfSelectedComponent ||
            ref.current?.currentTargetId
          ) {
            console.log("carai", ref.current?.currentTargetId, opened);
            open();
          }
        },
        200
      ),
    [editorTree.root]
  );

  // useEffect(test, [counter, test]);

  useEffect(() => {
    ref.current.currentTargetId = currentTargetId;
  }, [currentTargetId]);

  const renderList = (component: Component, level: number = 0) => {
    if (!component) {
      return null;
    }

    return (
      <ListItemWrapper
        key={component.id}
        component={component}
        level={level}
        openCustom={openCustom}
        test={test}
        counter={counter}
      >
        {component.children?.map((child) => {
          return renderList(child, level + 1);
        })}
      </ListItemWrapper>
    );
  };

  return (
    <>
      -{counter}-
      <button onClick={() => setCounter((prev) => ++prev)}>test</button>
      <List
        size="xs"
        listStyleType="none"
        styles={{
          itemWrapper: {
            width: "100%",
          },
        }}
      >
        {renderList(editorTree.root)}
      </List>
    </>
  );
};
