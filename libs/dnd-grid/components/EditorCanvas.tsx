import { Droppable } from "@/components/Droppable";
import { IFrame } from "@/components/IFrame";
import useEditorHotkeys from "@/hooks/editor/useEditorHotkeys";
import { useEditorTreeStore } from "@/stores/editorTree";
import { componentMapper } from "@/libs/dnd-flex/utils/componentMapper";
import { HEADER_HEIGHT } from "@/utils/config";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Paper } from "@mantine/core";
import { memo } from "react";
import { RenderTreeFunc } from "@/types/component";
import { ComponentToolbox } from "@/components/ComponentToolbox";
import DnDGrid from "@/libs/dnd-grid/DnDGrid";
import ErrorBoundary from "@/libs/dnd-grid/components/ErrorBoundary";

type Props = {
  projectId: string;
};

const store = {
  id: "main-grid",
  name: "Container",
  description: "Container",
  blockDroppingChildrenInside: false,
  children: [
    {
      id: "V7BXq3wbqGhduq57Pj_04",
      name: "Container",
      description: "Container",
      blockDroppingChildrenInside: false,
      props: {
        bg: "lightgray",
        c: "black",
        style: {
          gridColumn: "40/69",
          gridRow: "9/18",
        },
      },
      children: [
        {
          id: "oGFqO5RNPd1u1ptj-FbIK",
          name: "Button",
          description: "Button",
          blockDroppingChildrenInside: true,
          props: {
            bg: "lightblue",
            c: "white",
            style: {
              gridColumn: "2/13",
              gridRow: "3/7",
            },
          },
        },
        {
          id: "JzVEIvdwuNVUIgLCe0C_o",
          name: "Text",
          description: "Text",
          blockDroppingChildrenInside: true,
          props: {
            bg: "white",
            c: "black",
            style: {
              gridColumn: "22/27",
              gridRow: "4/6",
            },
          },
        },
      ],
    },
  ],
};

const EditorCanvasComponent = ({ projectId }: Props) => {
  // const isComponentSelected = useEditorTreeStore(
  //   (state) =>
  //     !!(state.selectedComponentIds && state.selectedComponentIds.length > 0),
  // );
  // const editorTree = useEditorTreeStore((state) => state.tree);
  // useEditorHotkeys();

  // const [canvasRef] = useAutoAnimate();

  // const renderTree: RenderTreeFunc = (componentTree, shareableContent) => {
  //   if (componentTree.id === "root") {
  //     return (
  //       <Droppable
  //         key={`${componentTree.id}`}
  //         id={componentTree.id}
  //         m={0}
  //         p={2}
  //         miw={980}
  //       >
  //         <Paper
  //           shadow="xs"
  //           ref={canvasRef}
  //           bg="gray.0"
  //           display="flex"
  //           sx={{ flexDirection: "column" }}
  //         >
  //           {componentTree.children?.map((child) =>
  //             renderTree(child, shareableContent),
  //           )}
  //         </Paper>
  //       </Droppable>
  //     );
  //   }

  //   const componentToRender = componentMapper[componentTree.name];

  //   if (!componentToRender) {
  //     return componentTree.children?.map((child) =>
  //       renderTree(child, shareableContent),
  //     );
  //   }

  //   return componentToRender?.Component({
  //     component: componentTree,
  //     renderTree,
  //     shareableContent,
  //   });
  // };

  // if ((editorTree?.root?.children ?? [])?.length === 0) {
  //   return null;
  // }

  // return (
  //   <>
  //     <Box
  //       pos="relative"
  //       style={{
  //         minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  //         height: "100%",
  //         overflow: "hidden",
  //       }}
  //       p={0}
  //       // TODO: get this back - turn it off for now
  //       // onPointerMove={(event) => {
  //       //   event.preventDefault();
  //       //   setCursor({
  //       //     x: Math.round(event.clientX),
  //       //     y: Math.round(event.clientY),
  //       //   });
  //       // }}
  //       // onPointerLeave={() => setCursor(undefined)}
  //     >
  //       <IFrame projectId={projectId}>
  //         {renderTree(editorTree.root)}
  //         {isComponentSelected && <ComponentToolbox />}
  //       </IFrame>
  //     </Box>
  //   </>
  // );

  return (
    <IFrame projectId={projectId}>
      <ErrorBoundary>
        <DnDGrid components={store} />
      </ErrorBoundary>
    </IFrame>
  );
};

export const EditorCanvas = memo(EditorCanvasComponent);
