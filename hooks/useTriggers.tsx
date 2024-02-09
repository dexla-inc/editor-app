import { Action, ActionTrigger, actionMapper } from "@/utils/actions";
import { Component } from "@/utils/editor";
import { Router, useRouter } from "next/router";
import { ChangeEvent, useCallback, useMemo } from "react";
import { PageResponse } from "@/requests/pages/types";

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

        const actionFunction = actionMapper[action.action.name].action();
        const onSuccessAction = onSuccessActions.find(
          (sa) => sa.sequentialTo === action.id,
        );
        const onErrorAction = onErrorActions.find(
          (ea) => ea.sequentialTo === action.id,
        );

        const onSuccessObj = onSuccessAction && {
          onSuccess: actionMapper[onSuccessAction?.action.name]?.action(),
        };
        const onErrorObj = onErrorAction && {
          onError: actionMapper[onErrorAction?.action.name]?.action(),
        };
        return {
          ...acc,
          [action.trigger]: (e: any) => {
            actionFunction({
              // @ts-ignore
              action: action.action,
              actionId: action.id,
              router: router as Router,
              event: e,
              ...onSuccessObj,
              ...onErrorObj,
              entity,
            });
          },
        };
      },
      {} as Record<ActionTrigger, any>,
    );
  };

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (entity.props?.error) {
        updateTreeComponent?.({
          componentId: entity.id,
          props: { error: "" },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entity],
  );

  return {
    ...triggers(),
    onChange: handleOnChange,
  };
};
