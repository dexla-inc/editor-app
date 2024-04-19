import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { PageResponse } from "@/requests/pages/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Action, ActionTrigger, actionMapper } from "@/utils/actions";
import { Component } from "@/utils/editor";
import { NextRouter } from "next/router";
import { ChangeEvent } from "react";
import { useDataBinding } from "@/hooks/dataBinding/useDataBinding";
import { useFlowsQuery } from "@/hooks/reactQuery/useFlowsQuery";
import { ComputeValueProps } from "@/types/dataBinding";

const nonDefaultActionTriggers = ["onSuccess", "onError"];

type UseTriggersProps = {
  entity: Component | PageResponse;
  router: NextRouter;
  projectId?: string;
};

export const useTriggers = ({
  entity,
  router,
  projectId,
}: UseTriggersProps) => {
  const currentProjectId =
    useEditorTreeStore((state) => state.currentProjectId) ?? projectId;
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;
  const { computeValue } = useDataBinding();
  const { data: endpoints } = useDataSourceEndpoints(currentProjectId);
  const { data: logicFlows } = useFlowsQuery(currentProjectId ?? "");

  const actionResponses: Record<string, any> = {};
  const setActionsResponses = (actionId: string, response: any) => {
    actionResponses[actionId] = response;
  };

  const customComputeValue: ComputeValueProps = (args) =>
    computeValue(args, { actions: actionResponses });

  const actions: Action[] = entity?.actions ?? [];

  const buildAction = (action: Action, event?: any): any => {
    return actionMapper[action.action.name].action({
      // @ts-ignore
      action: action.action,
      actionId: action.id,
      router,
      computeValue: customComputeValue,
      setActionsResponses,
      event,
      endpointResults: endpoints?.results ?? [],
      entity,
      flowsList: logicFlows?.results ?? [],
    });
  };

  const buildTriggers = () => {
    return actions.reduce(
      (acc, action: Action) => {
        if (nonDefaultActionTriggers.includes(action.trigger)) {
          return acc;
        }

        return {
          ...acc,
          [action.trigger]: async (e: any) => {
            return buildAction(action, e);
          },
        };
      },
      {} as Record<ActionTrigger, any>,
    );
  };

  const triggers = buildTriggers();

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
    triggers: {
      ...triggers,
      onChange: handleOnChange,
    },
    buildAction,
  };
};
