import { getPage } from "@/requests/pages/queries";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { getTileData, getTiles } from "@/utils/editor";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconTemplate } from "@tabler/icons-react";
import camelcase from "lodash.camelcase";
import { useRouter } from "next/router";

export const SaveTemplateButton = () => {
  const router = useRouter();
  const editorTree = useEditorStore((state) => state.tree);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const saveTemplate = async () => {
    try {
      startLoading({
        id: "save-template",
        title: "Saving Template",
        message: "Please wait while we save your template",
      });
      const page = await getPage(
        router.query.id as string,
        router.query.page as string,
      );

      const tiles = getTiles(editorTree.root);
      const tilesData = tiles.map((tile) => {
        const data = getTileData(tile.node);
        const id = camelcase(
          `${tile.node.description?.replace(".tile", "")}Tile`,
        );
        const prompt = `
          // create precisely ${tile.count} variations of this tile
          type ${id} = {
            name: "${id}"
            data: ${JSON.stringify(data, null, 2)}
          }
        `;

        return { id, tile, prompt };
      });

      const templateResponse = await fetch("/api/templates/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: page.id,
          name: camelcase(page.title),
          state: editorTree,
          type: page.queryStrings?.type,
          prompt: `
          type ${camelcase(page.title)}Template = {
            name: "${camelcase(page.title)}Template"
            tiles: (${tilesData.map((t) => t.id).join(" | ")})[]
          }
        `,
        }),
      });

      const templateData = await templateResponse.json();

      await fetch("/api/tiles/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tiles: tilesData.map((tile) => {
            return {
              id: `${templateData.id}-${tile.id}`,
              name: tile.id,
              state: tile.tile.node,
              prompt: tile.prompt,
              templateId: templateData.id,
            };
          }),
        }),
      });

      stopLoading({
        id: "save-template",
        title: "Saved Template",
        message: "Your template has been saved",
      });
    } catch (error) {
      console.log(error);
      stopLoading({
        id: "save-template",
        title: "Oops",
        message: "Something went wrong while saving your template",
        isError: true,
      });
    }
  };

  return (
    <Tooltip label="Save Template" withArrow fz="xs">
      <ActionIcon onClick={saveTemplate} variant="light" color="indigo">
        <IconTemplate size={ICON_SIZE} />
      </ActionIcon>
    </Tooltip>
  );
};
