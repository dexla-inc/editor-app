import { PageResponse } from "@/requests/pages/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  Action,
  ActionTrigger,
  actionMapper,
  handleError,
  handleSuccess,
} from "@/utils/actions";
import { Component } from "@/utils/editor";
import { ChangeEvent, useMemo } from "react";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { useFlowsQuery } from "@/hooks/editor/reactQuery/useFlowsQuery";
import { ComputeValueProps } from "@/types/dataBinding";
import { useEndpoints } from "../editor/reactQuery/useDataSourcesEndpoints";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEditorStore } from "@/stores/editor";
import { safeJsonParse } from "@/utils/common";

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
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;
  const { computeValue } = useDataBinding(entity?.id);
  const { endpoints, isFetched } = useEndpoints(currentProjectId as string);
  const { data: logicFlows, isFetched: logicFlowsIsFetched } =
    useFlowsQuery(currentProjectId);
  const setActionsResponse = useEditorStore.getState().setActionsResponse;

  const localActionResponses: Record<string, any> = {};
  const setLocalActionsResponses = (actionId: string, response: any) => {
    localActionResponses[actionId] = response;
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
              computeValue<any>(
                { ...args, shareableContent },
                {
                  actions: { ...localActionResponses },
                  event: e,
                },
              );

            const props = {
              // @ts-ignore
              action: action.action,
              actionId: action.id,
              router,
              computeValue: customComputeValue,
              event: e,
              endpointResults: endpoints ?? [],
              entity,
              flowsList: logicFlows?.results ?? [],
            };

            try {
              const responseJson =
                // @ts-ignore
                await actionMapper[action.action.name].action(props);

              setLocalActionsResponses(action.id, {
                success: responseJson,
                status: "success",
              });
              setActionsResponse(action.id, {
                success: responseJson,
                status: "success",
                list: {
                  id: action.id,
                  name: action.action.name,
                  success: responseJson,
                },
              });

              // @ts-ignore
              await handleSuccess(props);
            } catch (error) {
              if (error instanceof Error) {
                setLocalActionsResponses(action.id, {
                  error: safeJsonParse(error.message),
                  status: "error",
                });
                setActionsResponse(action.id, {
                  error: safeJsonParse(error.message),
                  status: "error",
                  list: {
                    id: action.id,
                    name: action.action.name,
                    error: error.message,
                  },
                });
              }

              // @ts-ignore
              await handleError(props);
            }
          },
        };
      },
      {} as Record<ActionTrigger, any>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    localActionResponses,
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
