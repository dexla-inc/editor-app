import { useDataContext } from "@/contexts/DataProvider";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { PageResponse } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import {
  Action,
  ActionTrigger,
  actionMapper,
  TriggerLogicFlowAction,
} from "@/utils/actions";
import { Component } from "@/utils/editor";
import { Router, useRouter } from "next/router";
import { ChangeEvent } from "react";
import { decodeSchema } from "@/utils/compression";

const nonDefaultActionTriggers = ["onSuccess", "onError"];

type UseTriggersProps = {
  entity: Component | PageResponse;
  isEditorMode?: boolean;
  updateTreeComponent?: (update: any) => void;
};

export const useTriggers = ({
  entity,
  updateTreeComponent,
}: UseTriggersProps) => {
  const projectId = useEditorStore((state) => state.currentProjectId);
  const router = useRouter();
  const { computeValue } = useDataContext()!;
  const setNonEditorActions = useEditorStore(
    (state) => state.setNonEditorActions,
  );
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const setTriggeredLogicFlow = useEditorStore(
    (state) => state.setTriggeredLogicFlow,
  );
  const setTriggeredAction = useEditorStore(
    (state) => state.setTriggeredAction,
  );

  const triggers = () => {
    const actions: Action[] = entity?.actions ?? [];

    const onSuccessActions: Action[] = actions.filter(
      (action: Action) => action.trigger === "onSuccess",
    );

    const onErrorActions: Action[] = actions.filter(
      (action: Action) => action.trigger === "onError",
    );

    return actions.reduce(
      (acc, action: Action) => {
        if (nonDefaultActionTriggers.includes(action.trigger)) {
          return acc;
        }

        return {
          ...acc,
          [action.trigger]: async (e: any) => {
            if (action.action.hasOwnProperty("logicFlow")) {
              const { logicFlow } = action.action as TriggerLogicFlowAction;
              const decoded = decodeSchema(logicFlow?.data);
              const nodeData = JSON.parse(decoded).nodes;
              await setTriggeredLogicFlow(nodeData);
            } else {
              await setTriggeredAction(actions);
            }

            return actionMapper[action.action.name].action({
              // @ts-ignore
              action: action.action,
              actionId: action.id,
              router: router as Router,
              computeValue,
              setNonEditorActions,
              event: e,
              endpointResults: endpoints?.results ?? [],
              onSuccess: onSuccessActions.find(
                (sa) => sa.sequentialTo === action.id,
              ),
              onError: onErrorActions.find(
                (ea) => ea.sequentialTo === action.id,
              ),
              entity,
              setTriggeredLogicFlow,
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

    if (entity.props?.error) {
      updateTreeComponent?.({
        componentId: entity.id,
        props: { error: "" },
      });
    }
  };

  return {
    ...triggers(),
    onChange: handleOnChange,
  };
};
