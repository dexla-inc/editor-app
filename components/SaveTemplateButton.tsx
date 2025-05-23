import { ActionIconDefault } from "@/components/ActionIconDefault";
import { getPage } from "@/requests/pages/mutations";
import { upsertTemplate } from "@/requests/templates/mutations";
import { TemplateParams, TemplateTypes } from "@/requests/templates/types";
import { upsertTile } from "@/requests/tiles/mutations";
import { TileParams } from "@/requests/tiles/types";
import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { encodeSchema } from "@/utils/compression";
import { getTileData, getTiles } from "@/utils/editor";
import camelcase from "lodash.camelcase";
import { memo } from "react";

const SaveTemplateButtonComponent = () => {
  const saveTemplate = async () => {
    const startLoading = useAppStore.getState().startLoading;
    const stopLoading = useAppStore.getState().stopLoading;
    const company = usePropelAuthStore.getState().activeCompany;

    try {
      startLoading({
        id: "save-template",
        title: "Saving Template",
        message: "Please wait while we save your template",
      });

      const editorTree = useEditorTreeStore.getState().tree;
      const pageId = useEditorTreeStore.getState().currentPageId!;
      const projectId = useEditorTreeStore.getState().currentProjectId!;

      const page = await getPage(projectId, pageId);

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
      const templateState = encodeSchema(JSON.stringify(editorTree));

      const templateParams: TemplateParams = {
        id: pageId,
        name: camelcase(page.title),
        state: templateState,
        type: page.queryStrings?.type as TemplateTypes,
        tags: page.queryStrings?.tags as any,
        prompt: `
        type ${camelcase(page.title)}Template = {
          name: "${camelcase(page.title)}Template"
          tiles: (${tilesData.map((t) => t.id).join(" | ")})[]
        }
      `,
      };

      const templateResponse = await upsertTemplate(
        company.orgId,
        templateParams,
      );

      tilesData.map(async (tile) => {
        const tileParams: TileParams = {
          id: `${templateResponse.id}-${tile.id}`,
          name: tile.id,
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
    } catch (error: any) {
      stopLoading({
        id: "save-template",
        title: "Oops",
        message: error,
        isError: true,
      });
    }
  };

  return (
    <ActionIconDefault
      iconName="IconTemplate"
      tooltip="Save Template"
      onClick={saveTemplate}
      variant="default"
    />
    // <Tooltip label="Save Template" withArrow fz="xs">
    //   <ActionIcon onClick={saveTemplate} variant="light" color="indigo">
    //     <IconTemplate size={ICON_SIZE} />
    //   </ActionIcon>
    // </Tooltip>
  );
};

export const SaveTemplateButton = memo(SaveTemplateButtonComponent);
