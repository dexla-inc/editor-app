import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { PageResponse } from "@/requests/pages/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Action, ActionTrigger, actionMapper } from "@/utils/actions";
import { Component } from "@/utils/editor";
import { Router, useRouter } from "next/router";
import { ChangeEvent } from "react";
import { useDataBinding } from "@/hooks/dataBinding/useDataBinding";
import { useFlowsQuery } from "@/hooks/reactQuery/useFlowsQuery";
import { Endpoint } from "@/requests/datasources/types";
import { LogicFlowResponse } from "@/requests/logicflows/types";

const nonDefaultActionTriggers = ["onSuccess", "onError"];

type UseTriggersProps = {
  entity: Component | PageResponse;
  projectId: string;
};

export const useTriggers = ({ entity, projectId }: UseTriggersProps) => {
  const currentProjectId =
    useEditorTreeStore((state) => state.currentProjectId) ?? projectId;
  const router = useRouter();
  const { computeValue } = useDataBinding();
  const { data: endpointsResponse } = useDataSourceEndpoints(currentProjectId);
  const { data: flowsList } = useFlowsQuery(currentProjectId);

  const actionResponses: Record<string, any> = {};
  const setActionsResponses = (actionId: string, response: any) => {
    actionResponses[actionId] = response;
  };

  const triggers = () => {
    const actions: Action[] = entity?.actions ?? [];

    return actions.reduce(
      (acc, action: Action) => {
        if (nonDefaultActionTriggers.includes(action.trigger)) {
          return acc;
        }

        return {
          ...acc,
          [action.trigger]: async (e: any) => {
            return actionMapper[action.action.name].action({
              // @ts-ignore
              action: action.action,
              actionId: action.id,
              router: router as Router,
              computeValue,
              actionResponses,
              setActionsResponses,
              event: e,
              endpointResults: endpointsResponse?.results ?? [],
              entity,
              flowsList: flowsList?.results ?? [],
            });
          },
        };
      },
      {} as Record<ActionTrigger, any>,
    );
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeof triggers().onChange === "function") {
      triggers().onChange(e);
    }
  };

  return {
    ...triggers(),
    onChange: handleOnChange,
  };
};
