import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { BindResponseToComponentActionForm } from "@/components/actions/BindResponseToComponentActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { GoToUrlForm } from "@/components/actions/GoToUrlForm";
import { LoginActionForm } from "@/components/actions/LoginActionForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { OpenPopOverActionForm } from "@/components/actions/OpenPopOverActionForm";
import { OpenDrawerActionForm } from "@/components/actions/OpenDrawerActionForm";
import { OpenModalActionForm } from "@/components/actions/OpenModalActionForm";
import {
  getDataSourceAuth,
  getDataSourceEndpoints,
} from "@/requests/datasources/queries";
import { DataSourceResponse, Endpoint } from "@/requests/datasources/types";
import { useAuthStore } from "@/stores/auth";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { flattenKeysWithRoot } from "@/utils/flattenKeys";
import get from "lodash.get";
import { Router } from "next/router";

const triggers = [
  "onClick",
  "onHover",
  "onDoubleClick", // Do not think we need this, can just use onClick
  "onMount",
  "onChange",
  "onFocus",
  "onBlur",
  "onOpen",
  "onClose",
  "onSubmit",
  "onInvalid",
  "onReset",
  //table actions
  "onRowClick",
  "onRowHover",
  "onRowSelect",
  "onRowExpand",
  "onPaginationChange",
  "onSort",
  "onFilterApplied",
  "onSuccess",
  "onError",
] as const;

export const actions = [
  "apiCall",
  "bindResponseToComponent",
  "copyToClipboard",
  "debug",
  "goToUrl",
  "login",
  "navigateToPage",
  "openDrawer",
  "openModal",
  "openPopover",
  "openToast",
  "showTooltip",
];

type ActionTriggerAll = (typeof triggers)[number];

export type ActionTrigger = ActionTriggerAll;
export type SequentialTrigger = Extract<
  ActionTriggerAll,
  "onSuccess" | "onError"
>;

export type NavigationAction = {
  name: "navigateToPage";
  pageId: string;
  data?: any;
};

export type GoToUrlAction = {
  name: "goToUrl";
  url: string;
  openInNewTab: boolean;
  data?: any;
};

export type DebugAction = {
  name: "debug";
  message: string;
  data?: any;
};

export type OpenModalAction = {
  name: "openModal";
  modalId: string;
  data?: any;
};

export type OpenDrawerAction = {
  name: "openDrawer";
  drawerId: string;
  data?: any;
};

export type OpenPopOverAction = {
  name: "openPopOver";
  popOverId: string;
  data?: any;
};

export type APICallAction = {
  name: "apiCall";
  endpoint: string;
  datasource: DataSourceResponse;
  binds?: { [key: string]: any };
  data?: any;
};

export type LoginAction = Omit<APICallAction, "name"> & {
  name: "login";
};

export type BindResponseToComponentAction = {
  name: "bindResponseToComponent";
  data?: any;
  binds?: {
    component: string;
    value: string;
  }[];
};

export type Action = {
  id: string;
  trigger: ActionTrigger;
  action:
    | NavigationAction
    | DebugAction
    | APICallAction
    | BindResponseToComponentAction
    | GoToUrlAction
    | LoginAction
    | OpenModalAction
    | OpenDrawerAction
    | OpenPopOverAction;
  sequentialTo?: string;
};

export type ActionParams = {
  actionId: string;
  router: Router;
  onSuccess?: Action;
  onError?: Action;
  event?: any;
  component: Component;
  data?: any;
};

export type NavigationActionParams = ActionParams & {
  action: NavigationAction;
};

export type GoToUrlParams = ActionParams & {
  action: GoToUrlAction;
};

export const navigationAction = ({
  action,
  router,
}: NavigationActionParams) => {
  const projectId = router.query.id as string;
  router.push(`/projects/${projectId}/editor/${action.pageId}`);
};

export const goToUrlAction = ({ action }: GoToUrlParams) => {
  const { url, openInNewTab } = action;
  if (openInNewTab) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
};

export type DebugActionParams = ActionParams & {
  action: DebugAction;
};

export const debugAction = ({ action }: DebugActionParams) => {
  alert(action.message);
};

export type OpenModalActionParams = ActionParams & {
  action: OpenModalAction;
};

export type OpenDrawerActionParams = ActionParams & {
  action: OpenDrawerAction;
};

export type OpenPopOverActionParams = ActionParams & {
  action: OpenPopOverAction;
};

export const openModalAction = ({ action }: OpenModalActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.modalId, { opened: true }, false);
};

export const openDrawerAction = ({ action }: OpenDrawerActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.drawerId, { opened: true }, false);
};

export const openPopOverAction = ({ action }: OpenPopOverActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.popOverId, { opened: true }, false);
};

export type APICallActionParams = ActionParams & {
  action: APICallAction;
};

export type LoginActionParams = ActionParams & {
  action: LoginAction;
};

let cachedEndpoints: Endpoint[] | undefined;

export const loginAction = async ({
  actionId,
  action,
  router,
  onSuccess,
  onError,
  component,
  ...rest
}: LoginActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

  try {
    const iframeWindow = useEditorStore.getState().iframeWindow;
    const projectId = router.query.id as string;

    updateTreeComponent(component.id!, { loading: true }, false);

    // TODO: Storing in memory for now as the endpoints API call is slow. We only ever want to call it once.
    // Can revisit later and create a cashing layer.
    if (!cachedEndpoints) {
      const { results } = await getDataSourceEndpoints(
        projectId,
        action.datasource.id
      );
      cachedEndpoints = results;
    }

    const endpoint = cachedEndpoints.find((e) => e.id === action.endpoint);

    const keys = Object.keys(action.binds ?? {});

    const url =
      keys.length > 0
        ? keys.reduce((url: string, key: string) => {
            let value = action.binds?.[key] as string;

            if (value?.startsWith(`valueOf_`)) {
              const el = iframeWindow?.document.querySelector(`
          input#${value.split(`valueOf_`)[1]}
          `) as HTMLInputElement;
              value = el?.value ?? "";
            }

            return url.replace(`{${key}}`, value);
          }, `${action.datasource.baseUrl}/${endpoint?.relativeUrl}`)
        : `${action.datasource.baseUrl}/${endpoint?.relativeUrl}`;

    const body =
      endpoint?.methodType === "POST"
        ? Object.keys(action.binds ?? {}).reduce(
            (body: string, key: string) => {
              let value = action.binds?.[key] as string;

              if (value.startsWith(`valueOf_`)) {
                const el = iframeWindow?.document.querySelector(`
          input#${value.split(`valueOf_`)[1]}
        `) as HTMLInputElement;
                value = el?.value ?? "";
              }

              return {
                ...(body as any),
                [key]: value,
              };
            },
            {} as any
          )
        : undefined;

    const response = await fetch(url, {
      method: endpoint?.methodType,
      headers: {
        // Will need to build up headers from endpoint.headers in future
        "Content-Type": endpoint?.mediaType ?? "application/json",
      },
      ...(!!body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.status.toString().startsWith("20")) {
      throw new Error(response.statusText);
    }

    const responseJson = await response.json();

    const dataSourceAuthConfig = await getDataSourceAuth(
      projectId,
      action.datasource.id
    );

    const mergedAuthConfig = { ...responseJson, ...dataSourceAuthConfig };

    const authStore = useAuthStore.getState();
    authStore.setAuthTokens(mergedAuthConfig);

    if (onSuccess && onSuccess.sequentialTo === actionId) {
      const actions = component.props?.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess"
      );
      const onSuccessActionMapped = actionMapper[onSuccess.action.name];
      onSuccessActionMapped.action({
        // @ts-ignore
        action: onSuccessAction.action,
        router,
        ...rest,
        data: responseJson,
      });
    }
  } catch (error) {
    if (onError && onError.sequentialTo === actionId) {
      const actions = component.props?.actions ?? [];
      const onErrorAction: Action = actions.find(
        (action: Action) => action.trigger === "onError"
      );
      const onErrorActionMapped = actionMapper[onError.action.name];
      onErrorActionMapped.action({
        // @ts-ignore
        action: onErrorAction.action,
        router,
        ...rest,
        data: { value: (error as Error).message },
      });
    }
  } finally {
    updateTreeComponent(component.id!, { loading: false }, false);
  }
};

export const apiCallAction = async ({
  actionId,
  action,
  router,
  onSuccess,
  onError,
  component,
  ...rest
}: APICallActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

  try {
    const iframeWindow = useEditorStore.getState().iframeWindow;
    const projectId = router.query.id as string;

    updateTreeComponent(component.id!, { loading: true }, false);

    // TODO: Storing in memory for now as the endpoints API call is slow. We only ever want to call it once.
    // Can revisit later and create a cashing layer.
    if (!cachedEndpoints) {
      const { results } = await getDataSourceEndpoints(
        projectId,
        action.datasource.id
      );
      cachedEndpoints = results;
    }
    const endpoint = cachedEndpoints.find((e) => e.id === action.endpoint);

    const keys = Object.keys(action.binds ?? {});

    const url =
      keys.length > 0
        ? keys.reduce((url: string, key: string) => {
            // @ts-ignore
            let value = action.binds[key] as string;

            if (value.startsWith(`valueOf_`)) {
              const el = iframeWindow?.document.querySelector(`
          input#${value.split(`valueOf_`)[1]}
        `) as HTMLInputElement;
              value = el?.value ?? "";
            }

            if (!url.includes(`{${key}}`)) {
              const _url = new URL(url);
              _url.searchParams.append(key, value);
              return _url.toString();
            } else {
              return url.replace(`{${key}}`, value);
            }
          }, `${action.datasource.baseUrl}/${endpoint?.relativeUrl}`)
        : `${action.datasource.baseUrl}/${endpoint?.relativeUrl}`;

    const body =
      endpoint?.methodType === "POST"
        ? Object.keys(action.binds ?? {}).reduce(
            (body: string, key: string) => {
              // @ts-ignore
              let value = action.binds[key] as string;

              if (value.startsWith(`valueOf_`)) {
                const el = iframeWindow?.document.querySelector(`
          input#${value.split(`valueOf_`)[1]}
        `) as HTMLInputElement;
                value = el?.value ?? "";
              }

              return {
                ...(body as any),
                [key]: value,
              };
            },
            {} as any
          )
        : undefined;

    // TODO: Need to add a binding for headers.
    // We could then remove the auth code below and just build headers up instead

    const authStore = useAuthStore.getState();
    authStore.refreshAccessToken();

    let authHeaderKey =
      endpoint?.authenticationScheme === "BEARER"
        ? "Bearer " + authStore.getAccessToken()
        : "";

    const response = await fetch(url, {
      method: endpoint?.methodType,
      headers: {
        // Will need to build up headers from endpoint.headers in future
        "Content-Type": endpoint?.mediaType ?? "application/json",
        ...(authHeaderKey ? { Authorization: authHeaderKey } : {}),
      },
      ...(!!body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.status.toString().startsWith("20")) {
      throw new Error(response.statusText);
    }

    const responseJson = await response.json();

    if (onSuccess && onSuccess.sequentialTo === actionId) {
      const actions = component.props?.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess"
      );
      const onSuccessActionMapped = actionMapper[onSuccess.action.name];
      onSuccessActionMapped.action({
        // @ts-ignore
        action: onSuccessAction.action,
        router,
        ...rest,
        data: responseJson,
      });
    }
  } catch (error) {
    if (onError && onError.sequentialTo === actionId) {
      const actions = component.props?.actions ?? [];
      const onErrorAction: Action = actions.find(
        (action: Action) => action.trigger === "onError"
      );
      const onErrorActionMapped = actionMapper[onError.action.name];
      onErrorActionMapped.action({
        // @ts-ignore
        action: onErrorAction.action,
        router,
        ...rest,
        data: { value: (error as Error).message },
      });
    }
  } finally {
    updateTreeComponent(component.id!, { loading: false }, false);
  }
};

export type BindResponseToComponentActionParams = ActionParams & {
  action: BindResponseToComponentAction;
};

export const bindResponseToComponentAction = ({
  action,
  data,
}: BindResponseToComponentActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

  action.binds?.forEach((bind) => {
    if (bind.component && bind.value) {
      const dataFlatten = flattenKeysWithRoot(data);
      const value = get(dataFlatten, bind.value);
      updateTreeComponent(bind.component, { data: { value } }, false);
    }
  });
};

export const actionMapper = {
  debug: {
    action: debugAction,
    form: DebugActionForm,
  },
  navigateToPage: {
    action: navigationAction,
    form: NavigationActionForm,
  },
  apiCall: {
    action: apiCallAction,
    form: APICallActionForm,
  },
  bindResponseToComponent: {
    action: bindResponseToComponentAction,
    form: BindResponseToComponentActionForm,
  },
  goToUrl: {
    action: goToUrlAction,
    form: GoToUrlForm,
  },
  login: {
    action: loginAction,
    form: LoginActionForm,
  },
  openModal: {
    action: openModalAction,
    form: OpenModalActionForm,
  },
  openDrawer: {
    action: openDrawerAction,
    form: OpenDrawerActionForm,
  },
  openPopOver: {
    action: openPopOverAction,
    form: OpenPopOverActionForm,
  },
};
