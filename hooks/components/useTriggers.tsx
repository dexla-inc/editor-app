import { PageResponse } from "@/requests/pages/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Action, ActionTrigger, actionMapper } from "@/utils/actions";
import { Component } from "@/utils/editor";
import { Router } from "next/router";
import { ChangeEvent, useMemo } from "react";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { useFlowsQuery } from "@/hooks/reactQuery/useFlowsQuery";
import { ComputeValueProps } from "@/types/dataBinding";
import { useEndpoints } from "../reactQuery/useDataSourcesEndpoints";

const nonDefaultActionTriggers = ["onSuccess", "onError"];

type UseTriggersProps = {
  entity: Component | PageResponse;
  router: Router;
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
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;
  const { computeValue } = useDataBinding();
  const { endpoints, isFetched } = useEndpoints(currentProjectId as string);
  const { data: logicFlows, isFetched: logicFlowsIsFetched } =
    useFlowsQuery(currentProjectId);

  const actionResponses: Record<string, any> = {};
  const setActionsResponses = (actionId: string, response: any) => {
    actionResponses[actionId] = response;
  };

  const triggers = useMemo(() => {
    if (!isFetched || !logicFlowsIsFetched) {
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
            const customComputeValue: ComputeValueProps = (args) =>
              computeValue(
                { ...args, shareableContent },
                {
                  actions: { ...actionResponses },
                  event: e,
                },
              );

            return actionMapper[action.action.name].action({
              // @ts-ignore
              action: action.action,
              actionId: action.id,
              router,
              computeValue: customComputeValue,
              actionResponses,
              setActionsResponses,
              event: e,
              endpointResults: endpoints ?? [],
              entity,
              flowsList: logicFlows?.results ?? [],
            });
          },
        };
      },
      {} as Record<ActionTrigger, any>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionResponses,
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
    if (entity.props?.error) {
      updateTreeComponentAttrs?.({
        componentIds: [entity.id!],
        attrs: { props: { error: `` } },
        save: false,
      });
    }
  };

  return {
    ...triggers,
    onChange: handleOnChange,
  };
};
