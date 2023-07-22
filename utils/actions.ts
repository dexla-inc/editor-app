import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { DataSourceResponse } from "@/requests/datasources/types";
import { useEditorStore } from "@/stores/editor";
import { Router } from "next/router";
import { Component } from "@/utils/editor";

export const triggers = [
  "onClick",
  "onHover",
  "onDoubleClick",
  "onMount",
  "onSuccess",
  "onError",
] as const;

export const actions = ["debug", "navigation", "apiCall"];

export type ActionTrigger = (typeof triggers)[number];

export type NavigationAction = {
  name: "navigation";
  pageId: string;
};

export type DebugAction = {
  name: "debug";
  message: string;
};

export type APICallAction = {
  name: "apiCall";
  endpoint: string;
  datasource: DataSourceResponse;
  binds?: { [key: string]: any };
  data?: any;
};

export type Action = {
  trigger: ActionTrigger;
  action: NavigationAction | DebugAction | APICallAction;
};

export type ActionParams = {
  router: Router;
  onSuccess?: Action["action"];
  onError?: Action["action"];
  event?: any;
  component: Component;
};

export type NavigationActionParams = ActionParams & {
  action: NavigationAction;
};

export const navigationAction = ({
  action,
  router,
}: NavigationActionParams) => {
  const projectId = router.query.id as string;
  router.push(`/projects/${projectId}/editor/${action.pageId}`);
};

export type DebugActionParams = ActionParams & {
  action: DebugAction;
};

export const debugAction = ({ action }: DebugActionParams) => {
  alert(action.message);
};

export type APICallActionParams = ActionParams & {
  action: APICallAction;
};

export const apiCallAction = async ({
  action,
  router,
  onSuccess,
  onError,
  component,
  ...rest
}: APICallActionParams) => {
  try {
    const iframeWindow = useEditorStore.getState().iframeWindow;
    const projectId = router.query.id as string;
    const { results } = await getDataSourceEndpoints(
      projectId,
      action.datasource.id
    );

    const endpoint = results.find((e) => e.id === action.endpoint);

    const url = Object.keys(action.binds ?? {}).reduce(
      (url: string, key: string) => {
        // @ts-ignore
        let value = action.binds[key] as string;

        if (value.startsWith(`valueOf_`)) {
          const el = iframeWindow?.document.querySelector(`
          input#${value.split(`valueOf_`)[1]}
        `) as HTMLInputElement;
          value = el?.value ?? "";
        }

        return url.replace(`{${key}}`, value);
      },
      `${action.datasource.baseUrl}/${endpoint?.relativeUrl}`
    );

    const response = await fetch(url, { method: endpoint?.methodType });
    console.log(response);

    if (!response.status.toString().startsWith("20")) {
      throw new Error(response.statusText);
    }

    if (onSuccess) {
      const actions = component.props?.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess"
      );
      const onSuccessActionMapped = actionMapper[onSuccess!.name];
      onSuccessActionMapped.action({
        // @ts-ignore
        action: onSuccessAction.action,
        router,
        ...rest,
      });
    }
  } catch (error) {
    if (onError) {
      const actions = component.props?.actions ?? [];
      const onErrorAction: Action = actions.find(
        (action: Action) => action.trigger === "onError"
      );
      const onErrorActionMapped = actionMapper[onError.name];
      onErrorActionMapped.action({
        // @ts-ignore
        action: onErrorAction.action,
        router,
        ...rest,
      });
    }
  }
};

export const actionMapper = {
  debug: {
    action: debugAction,
    form: DebugActionForm,
  },
  navigation: {
    action: navigationAction,
    form: NavigationActionForm,
  },
  apiCall: {
    action: apiCallAction,
    form: APICallActionForm,
  },
};
