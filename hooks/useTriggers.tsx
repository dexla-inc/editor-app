import { useDataContext } from "@/contexts/DataProvider";
import { PageResponse } from "@/requests/pages/types";
import { Action, ActionTrigger, actionMapper } from "@/utils/actions";
import { Component } from "@/utils/editor";
import { Router, useRouter } from "next/router";
import { ChangeEvent, useCallback } from "react";

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
  const router = useRouter();
  const { computeValue, setNonEditorActions } = useDataContext()!;

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
          [action.trigger]: (e: any) => {
            return actionMapper[action.action.name].action({
              // @ts-ignore
              action: action.action,
              actionId: action.id,
              router: router as Router,
              computeValue,
              setNonEditorActions,
              event: e,
              onSuccess: onSuccessActions.find(
                (sa) => sa.sequentialTo === action.id,
              ),
              onError: onErrorActions.find(
                (ea) => ea.sequentialTo === action.id,
              ),
              entity,
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
