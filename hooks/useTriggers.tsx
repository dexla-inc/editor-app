import { Action, ActionTrigger, actionMapper } from "@/utils/actions";
import { Component } from "@/utils/editor";
import { Router, useRouter } from "next/router";
import { ChangeEvent, useCallback, useMemo } from "react";

const nonDefaultActionTriggers = ["onSuccess", "onError"];

type UseTriggersProps = {
  component: Component;
  isEditorMode: boolean;
  updateTreeComponent: (update: any) => void;
};

export const useTriggers = ({
  component,
  isEditorMode,
  updateTreeComponent,
}: UseTriggersProps) => {
  const router = useRouter();

  const triggers = useMemo(() => {
    const actions: Action[] = component.actions ?? [];

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
            actionMapper[action.action.name].action({
              // @ts-ignore
              action: action.action,
              actionId: action.id,
              router: router as Router,
              event: e,
              onSuccess: onSuccessActions.find(
                (sa) => sa.sequentialTo === action.id,
              ),
              onError: onErrorActions.find(
                (ea) => ea.sequentialTo === action.id,
              ),
              component,
            });
          },
        };
      },
      {} as Record<ActionTrigger, any>,
    );
  }, [component]);

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      triggers.onChange?.(e);
      if (component.props?.error) {
        updateTreeComponent({
          componentId: component.id,
          props: { error: "" },
          save: false,
        });
      }
    },
    [component],
  );

  const handleOnSubmit = useCallback((e: any) => {
    if (isEditorMode) e.preventDefault();
    !isEditorMode && triggers.onSubmit?.(e);
  }, []);

  return {
    ...triggers,
    onChange: handleOnChange,
    onSubmit: handleOnSubmit,
  };
};
