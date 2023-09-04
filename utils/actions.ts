import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { BindResponseToComponentActionForm } from "@/components/actions/BindResponseToComponentActionForm";
import { ChangeStateActionForm } from "@/components/actions/ChangeStateActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { GoToUrlForm } from "@/components/actions/GoToUrlForm";
import { LoginActionForm } from "@/components/actions/LoginActionForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { OpenDrawerActionForm } from "@/components/actions/OpenDrawerActionForm";
import { OpenModalActionForm } from "@/components/actions/OpenModalActionForm";
import { OpenPopOverActionForm } from "@/components/actions/OpenPopOverActionForm";
import { OpenToastActionForm } from "@/components/actions/OpenToastActionForm";
import { TogglePropsActionForm } from "@/components/actions/TogglePropsActionForm";
import {
  getDataSourceAuth,
  getDataSourceEndpoints,
} from "@/requests/datasources/queries";
import { DataSourceResponse, Endpoint } from "@/requests/datasources/types";
import { useAuthStore } from "@/stores/auth";
import { useEditorStore } from "@/stores/editor";
import { Component, getComponentById } from "@/utils/editor";
import { flattenKeysWithRoot } from "@/utils/flattenKeys";
import { showNotification } from "@mantine/notifications";
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
  { name: "apiCall", group: "API & Data" },
  { name: "bindResponse", group: "API & Data" },
  { name: "login", group: "API & Data" },
  { name: "goToUrl", group: "Navigation" },
  { name: "navigateToPage", group: "Navigation" },
  { name: "openDrawer", group: "Modal & Overlays" },
  { name: "openModal", group: "Modal & Overlays" },
  { name: "openPopover", group: "Modal & Overlays" },
  { name: "toggleVisibility", group: "Style & Props" },
  { name: "alert", group: "Feedback" },
  { name: "changeState", group: "Feedback" },
  { name: "openToast", group: "Feedback" },
  { name: "copyToClipboard", group: "Utilities & Tools" },
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

export type AlertAction = {
  name: "alert";
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

export type TogglePropsAction = {
  name: "toggleVisibility";
  componentId: string;
  props: string;
};

export type OpenToastAction = {
  name: "openToast";
  toastId: string;
  title: string;
  message: string;
};

export type ChangeStateAction = {
  name: "changeState";
  componentId: string;
  state?: string;
  data?: any;
};

export type APICallAction = {
  name: "apiCall";
  endpoint: string;
  showLoader?: boolean;
  datasource: DataSourceResponse;
  binds?: { [key: string]: any };
  data?: any;
};

export type LoginAction = Omit<APICallAction, "name"> & {
  name: "login";
};

export type BindResponseToComponentAction = {
  name: "bindResponse";
  data?: any;
  binds?: {
    component: string;
    value: string;
    example: string;
  }[];
};

export type Action = {
  id: string;
  trigger: ActionTrigger;
  action:
    | NavigationAction
    | AlertAction
    | APICallAction
    | BindResponseToComponentAction
    | GoToUrlAction
    | LoginAction
    | OpenModalAction
    | OpenDrawerAction
    | OpenPopOverAction
    | TogglePropsAction
    | OpenToastAction
    | ChangeStateAction;
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
  action: AlertAction;
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

export type OpenToastActionParams = ActionParams & {
  action: OpenToastAction;
};

export type TogglePropsActionParams = ActionParams & {
  action: TogglePropsAction;
};

export type ChangeStateActionParams = ActionParams & {
  action: ChangeStateAction;
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

export const togglePropsAction = ({ action }: TogglePropsActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const editorTree = useEditorStore.getState().tree;
  const selectedComponent = getComponentById(
    editorTree.root,
    action.componentId as string
  );
  let viewItem;

  selectedComponent?.props?.style.visibility === "none"
    ? (viewItem = "flex")
    : (viewItem = "none");

  updateTreeComponent(action.componentId, {
    style: { visibility: viewItem as string },
  });
};

export const openToastAction = ({ action }: OpenToastActionParams) => {
  showNotification({ title: action.title, message: action.message });
};

export const changeStateAction = ({ action }: ChangeStateActionParams) => {
  const setTreeComponentCurrentState =
    useEditorStore.getState().setTreeComponentCurrentState;
  setTreeComponentCurrentState(action.componentId, action.state ?? "default");
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
      const actions = component.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess"
      )!;
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
      const actions = component.actions ?? [];
      const onErrorAction: Action = actions.find(
        (action: Action) => action.trigger === "onError"
      )!;
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

    updateTreeComponent(
      component.id!,
      {
        // @ts-ignore
        loading: component.actions.find(
          (a: { id: string }) => a.id === actionId
          // @ts-ignore
        ).action.showLoader,
      },
      false
    );

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
      const actions = component.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess"
      )!;
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
      const actions = component.actions ?? [];
      const onErrorAction: Action = actions.find(
        (action: Action) => action.trigger === "onError"
      )!;
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
      updateTreeComponent(
        bind.component,
        {
          data: { value, base: data },
          dataPath: bind.value.startsWith("root[0].")
            ? bind.value.split("root[0].")[1]
            : bind.value.split("root.")[1],
        },
        false
      );
    }
  });
};

export const actionMapper = {
  alert: {
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
  bindResponse: {
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
  openToast: {
    action: openToastAction,
    form: OpenToastActionForm,
  },
  changeState: {
    action: changeStateAction,
    form: ChangeStateActionForm,
  },
  toggleVisibility: {
    action: togglePropsAction,
    form: TogglePropsActionForm,
  },
};
