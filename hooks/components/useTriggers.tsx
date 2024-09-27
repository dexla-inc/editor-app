import { useDataBinding } from "@/hooks/data/useDataBinding";
import { useDataTransformers } from "@/hooks/data/useDataTransformers";
import { useFlowsQuery } from "@/hooks/editor/reactQuery/useFlowsQuery";
import { PageResponse } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { ComputeValueProps } from "@/types/dataBinding";
import { Action, ActionTrigger, actionMapper } from "@/utils/actions";
import { isRestrictedComponent } from "@/utils/common";
import { isEditorModeSelector } from "@/utils/componentSelectors";
import { Component } from "@/utils/editor";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ChangeEvent, useMemo } from "react";
import { useEndpoints } from "../editor/reactQuery/useDataSourcesEndpoints";

const nonDefaultActionTriggers = ["onSuccess", "onError"];

type UseTriggersProps = {
  entity: Component | PageResponse;
  router: AppRouterInstance;
  projectId?: string;
  shareableContent?: Record<string, any>;
};

export const useTriggers = ({
  entity,
  router,
  projectId,
  shareableContent = {},
}: UseTriggersProps) => {
  const currentProjectId =
    useEditorTreeStore((state) => state.currentProjectId) ?? projectId;
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const { computeValue } = useDataBinding(entity?.id);
  const { endpoints, isFetched } = useEndpoints(currentProjectId as string);
  const { data: logicFlows, isFetched: logicFlowsIsFetched } =
    useFlowsQuery(currentProjectId);
  const setActionsResponse = useEditorStore(
    (state) => state.setActionsResponse,
  );
  const { itemTransformer } = useDataTransformers();

  const triggeredActionResponses: Record<string, any> = {};
  const setTriggeredActionsResponses = (actionId: string, response: any) => {
    triggeredActionResponses[actionId] = response;
  };

  const triggers = useMemo(() => {
    // removing triggers for restricted components
    if (
      !isFetched ||
      !logicFlowsIsFetched ||
      isRestrictedComponent(entity?.id)
    ) {
      return {} as Record<ActionTrigger, any>;
    }

    const actions: Action[] = entity?.actions ?? [];

    return actions.reduce(
      (acc, action: Action) => {
        if (nonDefaultActionTriggers.includes(action.trigger)) {
          return acc;
        }

        return {
          ...acc,
          [action.trigger]: async (e: any) => {
            const isEditorMode = isEditorModeSelector(
              useEditorTreeStore.getState(),
            );
            if (isEditorMode) return;

            const customComputeValue: ComputeValueProps = (args) => {
              return computeValue<any>(
                { ...args, shareableContent },
                {
                  actions: { ...triggeredActionResponses },
                  event: e,
                  item: itemTransformer(shareableContent.relatedComponentsData),
                },
              );
            };

            return actionMapper(action.action.name).action({
              // @ts-ignore
              action: action.action,
              actionId: action.id,
              router,
              computeValue: customComputeValue,
              event: e,
              endpointResults: endpoints ?? [],
              entity,
              flowsList: logicFlows?.results ?? [],
              setActionsResponse,
              setTriggeredActionsResponses,
            });
          },
        };
      },
      {} as Record<ActionTrigger, any>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    triggeredActionResponses,
    endpoints,
    entity,
    isFetched,
    logicFlows?.results,
    logicFlowsIsFetched,
    router,
    shareableContent,
  ]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeof triggers.onChange === "function") {
      triggers.onChange(e);
    }
    if (entity.props?.hasError) {
      updateTreeComponentAttrs?.({
        componentIds: [entity.id!],
        attrs: { props: { hasError: false } },
        save: false,
      });
    }
  };

  return {
    ...triggers,
    onChange: handleOnChange,
  };
};
