import { getPage } from "@/requests/pages/queries";
import { createTemplate, updateTemplate } from "@/requests/templates/mutations";
import { TemplateParams, TemplateTypes } from "@/requests/templates/types";
import { upsertTile } from "@/requests/tiles/mutations";
import { TileParams } from "@/requests/tiles/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { encodeSchema } from "@/utils/compression";
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
  const company = usePropelAuthStore((state) => state.activeCompany);

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
          // each one should be unique and have different data values respecting the type below
          type ${id} = {
            name: "${id}"
            data: ${JSON.stringify(data, null, 2)}
          }
        `;

        return { id, tile, prompt };
      });

      const templateParams: TemplateParams = {
        name: camelcase(page.title),
        //state: JSON.stringify(editorTree),
        state: encodeSchema(JSON.stringify(editorTree)),
        type: page.queryStrings?.type as TemplateTypes,
        tags: page.queryStrings?.tags as any,
        prompt: `
        type ${camelcase(page.title)}Template = {
          name: "${camelcase(page.title)}Template"
          tiles: (${tilesData.map((t) => t.id).join(" | ")})[]
        }
      `,
      };

      const templateResponse = page.id
        ? await updateTemplate(page.id, company.orgId, templateParams)
        : await createTemplate(company.orgId, templateParams);

      tilesData.map(async (tile) => {
        const tileParams: TileParams = {
          id: `${templateResponse.id}-${tile.id}`,
          name: tile.id,
          //state: JSON.stringify(tile.tile.node),
          state: encodeSchema(JSON.stringify(tile.tile.node)),
          prompt: tile.prompt,
          templateId: templateResponse.id,
        };

        const tileResponse = await upsertTile(
          company.orgId,
          templateResponse.id,
          tileParams,
        );
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
