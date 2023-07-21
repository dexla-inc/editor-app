import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { DataSourceResponse } from "@/requests/datasources/types";
import { useEditorStore } from "@/stores/editor";
import { Router } from "next/router";

export const triggers = [
  "onClick",
  "onHover",
  "onDoubleClick",
  "onMount",
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

export const navigationAction = (
  action: NavigationAction,
  router: Router,
  e?: any
) => {
  const projectId = router.query.id as string;
  router.push(`/projects/${projectId}/editor/${action.pageId}`);
};

export const debugAction = (action: DebugAction, router: Router, e?: any) => {
  alert(action.message);
};

export const apiCallAction = async (
  action: APICallAction,
  router: Router,
  e?: any
) => {
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

  console.log(url);
  const response = await fetch(url, { method: endpoint?.methodType });
  console.log(response);
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
