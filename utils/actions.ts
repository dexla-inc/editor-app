import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { BindDataActionForm } from "@/components/actions/BindDataActionForm";
import { BindResponseToComponentActionForm } from "@/components/actions/BindResponseToComponentActionForm";
import { ChangeStateActionForm } from "@/components/actions/ChangeStateActionForm";
import { CloseModalActionForm } from "@/components/actions/CloseModalActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { GoToUrlForm } from "@/components/actions/GoToUrlForm";
import { LoginActionForm } from "@/components/actions/LoginActionForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { NextStepActionForm } from "@/components/actions/NextStepActionForm";
import { OpenDrawerActionForm } from "@/components/actions/OpenDrawerActionForm";
import { OpenModalActionForm } from "@/components/actions/OpenModalActionForm";
import { OpenPopOverActionForm } from "@/components/actions/OpenPopOverActionForm";
import { OpenToastActionForm } from "@/components/actions/OpenToastActionForm";
import { PreviousStepActionForm } from "@/components/actions/PreviousStepActionForm";
import { ReloadComponentActionForm } from "@/components/actions/ReloadComponentActionForm";
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
import { nanoid } from "nanoid";
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
  // table actions
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
  { name: "nextStep", group: "Navigation" },
  { name: "previousStep", group: "Navigation" },
  { name: "openDrawer", group: "Modal & Overlays" },
  { name: "openModal", group: "Modal & Overlays" },
  { name: "closeModal", group: "Modal & Overlays" },
  { name: "openPopover", group: "Modal & Overlays" },
  { name: "toggleVisibility", group: "Style & Props" },
  { name: "alert", group: "Feedback" },
  { name: "changeState", group: "Feedback" },
  { name: "openToast", group: "Feedback" },
  { name: "reloadComponent", group: "Feedback" },
  { name: "copyToClipboard", group: "Utilities & Tools" },
];

type ActionTriggerAll = (typeof triggers)[number];

export type ActionTrigger = ActionTriggerAll;
export type SequentialTrigger = Extract<
  ActionTriggerAll,
  "onSuccess" | "onError"
>;

export interface BaseAction {
  name: string;
  data?: any;
}

export interface NavigationAction extends BaseAction {
  name: "navigateToPage";
  pageId: string;
  queryStrings?: Record<string, string>;
}

export interface GoToUrlAction extends BaseAction {
  name: "goToUrl";
  url: string;
  openInNewTab: boolean;
}

export interface AlertAction extends BaseAction {
  name: "alert";
  message: string;
}

export interface OpenModalAction extends BaseAction {
  name: "openModal";
  modalId: string;
}

export interface OpenDrawerAction extends BaseAction {
  name: "openDrawer";
  drawerId: string;
}

export interface OpenPopOverAction extends BaseAction {
  name: "openPopOver";
  popOverId: string;
}

export interface TogglePropsAction extends BaseAction {
  name: "toggleVisibility";
  conditionRules: Array<{ componentId: string; condition: string }>;
}

export interface OpenToastAction extends BaseAction {
  name: "openToast";
  title: string;
  message: string;
}

export interface ChangeStateAction extends BaseAction {
  name: "changeState";
  componentId: string;
  state?: string;
}

export interface APICallAction extends BaseAction {
  name: "apiCall";
  endpoint: string;
  showLoader?: boolean;
  datasources: DataSourceResponse[];
  binds?: { [key: string]: any };
}

export interface LoginAction extends Omit<APICallAction, "name"> {
  name: "login";
}

export interface BindResponseToComponentAction extends BaseAction {
  name: "bindResponse";
  data?: any;
  binds?: {
    component: string;
    value: string;
    example: string;
  }[];
}

export interface ReloadComponentAction extends BaseAction {
  name: "reloadComponent";
  componentId: string;
  onMountActionId?: string;
}

export interface ToggleNavbarAction extends BaseAction {
  name: "toggleNavbar";
}

export interface NextStepAction extends BaseAction {
  name: "nextStep";
  stepperId: string;
  activeStep: number;
}

export interface PreviousStepAction extends BaseAction {
  name: "previousStep";
  stepperId: string;
  activeStep: number;
}

export interface BindDataAction extends BaseAction {
  name: "bindData";
  componentId: string;
}

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
    | ChangeStateAction
    | ReloadComponentAction
    | ToggleNavbarAction
    | NextStepAction
    | PreviousStepAction
    | BindDataAction;
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
  const { isLive } = useEditorStore.getState();
  const projectId = router.query.id as string;
  let url = isLive
    ? `/${action.pageId}`
    : `/projects/${projectId}/editor/${action.pageId}`;

  if (action.queryStrings && Object.keys(action.queryStrings).length) {
    const queryStrings = [];
    for (const key in action.queryStrings) {
      queryStrings.push(`${key}=${action.queryStrings[key]}`);
    }

    url += `?${queryStrings.join("&")}`;
  }

  router.push(url);
};

export const goToUrlAction = ({ action }: GoToUrlParams) => {
  const { url, openInNewTab } = action;

  if (url.startsWith("dataPath_")) {
    const { tree: editorTree } = useEditorStore.getState();
    const path = url.split(`dataPath_`)[1];
    const componentId = path.split(".")[0];
    const component = getComponentById(editorTree.root, componentId);
    console.log({ component, path });
  }

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
export type ToggleNavbarActionParams = ActionParams & {
  action: ToggleNavbarAction;
};
export type NextStepActionParams = ActionParams & {
  action: NextStepAction;
};
export type PreviousStepActionParams = ActionParams & {
  action: PreviousStepAction;
};

export const openModalAction = ({ action }: OpenModalActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.modalId, { opened: true }, false);
};

export const closeModalAction = ({ action }: OpenModalActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.modalId, { opened: false }, false);
};

export const openDrawerAction = ({ action }: OpenDrawerActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.drawerId, { opened: true }, false);
};

export const openPopOverAction = ({ action }: OpenPopOverActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.popOverId, { opened: true }, false);
};

export const goToNextStepAction = ({ action }: NextStepActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

  const step = action.activeStep + 1;

  updateTreeComponent(action.stepperId, { activeStep: step }, false);
};

export const goToPreviousStepAction = ({
  action,
}: PreviousStepActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

  const step = Math.max(1, action.activeStep - 1);

  updateTreeComponent(action.stepperId, { activeStep: step }, false);
};
export const togglePropsAction = ({
  action,
  event,
}: TogglePropsActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  action.conditionRules.map((item) => {
    updateTreeComponent(
      item.componentId,
      {
        style: { display: item.condition === event ? "flex" : "none" },
      },
      false,
    );
  });
};
export const toggleNavbarAction = ({ action }: ToggleNavbarActionParams) => {
  const { updateTreeComponent, tree: editorTree } = useEditorStore.getState();
  const selectedComponent = editorTree.root.children?.find(
    (tree) => tree.name === "Navbar",
  );
  const buttonComponent = selectedComponent?.children?.find(
    (tree) => tree.description === "Button to toggle Navbar",
  );
  const linksComponent = selectedComponent?.children?.find(
    (tree) => tree.description === "Container for navigation links",
  );
  const buttonIcon = buttonComponent?.children?.reduce(
    (obj, tree) => ({ ...obj, ...tree }),
    {} as Component,
  );

  const isExpanded = selectedComponent?.props?.style.width !== "100px";
  const name = isExpanded ? "IconChevronRight" : "IconChevronLeft";
  const width = isExpanded ? "100px" : "260px";
  const flexDirection = isExpanded ? "column" : "row";
  const justifyContent = isExpanded ? "center" : "flex-start";

  updateTreeComponent(buttonIcon?.id!, { name });
  linksComponent?.children?.forEach((child) => {
    updateTreeComponent(child?.id as string, {
      style: { flexDirection, justifyContent },
    });
  });
  updateTreeComponent(selectedComponent?.id!, { style: { width } });
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
      const { results } = await getDataSourceEndpoints(projectId);
      cachedEndpoints = results;
    }

    const endpoint = cachedEndpoints.find((e) => e.id === action.endpoint);
    const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;
    const keys = Object.keys(action.binds ?? {});

    const url =
      keys.length > 0
        ? keys.reduce((url: string, key: string) => {
            key.startsWith("type_key_")
              ? (key = key.split(`type_Key_`)[1])
              : key;
            let value = action.binds?.[key] as string;

            if (value?.startsWith(`valueOf_`)) {
              const el = iframeWindow?.document.querySelector(`
          input#${value.split(`valueOf_`)[1]}
          `) as HTMLInputElement;
              value = el?.value ?? "";
            }

            if (value?.startsWith(`queryString_pass_`)) {
              value = getQueryElementValue(value, iframeWindow);
            }

            return url.replace(`{${key}}`, value);
          }, apiUrl)
        : apiUrl;

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

              if (value?.startsWith(`queryString_pass_`)) {
                value = getQueryElementValue(value, iframeWindow);
              }

              return {
                ...(body as any),
                [key]: value,
              };
            },
            {} as any,
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
      endpoint?.dataSourceId!,
    );

    const mergedAuthConfig = { ...responseJson, ...dataSourceAuthConfig };

    const authStore = useAuthStore.getState();
    authStore.setAuthTokens(mergedAuthConfig);

    if (onSuccess && onSuccess.sequentialTo === actionId) {
      const actions = component.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess",
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
        (action: Action) => action.trigger === "onError",
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

function getElementValue(value: string, iframeWindow: any): string {
  const _id = value.split("valueOf_")[1];
  let el = iframeWindow?.document.getElementById(_id);
  const tag = el?.tagName?.toLowerCase();

  if (tag !== "input") {
    el = el?.getElementsByTagName("input")[0];
  }

  return (el as HTMLInputElement)?.value ?? "";
}

function getQueryElementValue(value: string, iframeWindow: any): string {
  const el = iframeWindow?.document.querySelector(
    `input#${value.split("queryString_pass_")[1]}`,
  ) as HTMLInputElement;
  return el?.value ?? "";
}

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
  const setStoreData = useEditorStore.getState().setStoreData;
  const storeData = useEditorStore.getState().storeData;

  try {
    const iframeWindow = useEditorStore.getState().iframeWindow;
    const projectId = router.query.id as string;

    updateTreeComponent(
      component.id!,
      {
        // @ts-ignore
        loading: component.actions.find(
          (a: { id: string }) => a.id === actionId,
          // @ts-ignore
        ).action.showLoader,
      },
      false,
    );

    // TODO: Storing in memory for now as the endpoints API call is slow. We only ever want to call it once.
    // Can revisit later and create a cashing layer.
    if (!cachedEndpoints) {
      const { results } = await getDataSourceEndpoints(projectId);
      cachedEndpoints = results;
    }
    const endpoint = cachedEndpoints.find((e) => e.id === action.endpoint);

    const keys = Object.keys(action.binds ?? {});

    const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;

    const url =
      keys.length > 0
        ? keys.reduce((url: string, key: string) => {
            key.startsWith("type_Key_")
              ? (key = key.split(`type_key_`)[1])
              : key;
            // @ts-ignore
            let value = action.binds[key] as string;

            if (value.startsWith(`valueOf_`)) {
              value = getElementValue(value, iframeWindow);
            }

            if (value?.startsWith(`queryString_pass_`)) {
              value = getQueryElementValue(value, iframeWindow);
            }

            if (!url.includes(`{${key}}`)) {
              const _url = new URL(url);
              _url.searchParams.append(key, value);
              return _url.toString();
            } else {
              return url.replace(`{${key}}`, value);
            }
          }, apiUrl)
        : apiUrl;

    const body =
      endpoint?.methodType === "POST"
        ? Object.keys(action.binds ?? {}).reduce(
            (body: string, key: string) => {
              // @ts-ignore
              let value = action.binds[key] as string;

              if (value.startsWith(`valueOf_`)) {
                value = getElementValue(value, iframeWindow);
              }

              if (value?.startsWith(`queryString_pass_`)) {
                value = getQueryElementValue(value, iframeWindow);
              }

              return {
                ...(body as any),
                [key]: value,
              };
            },
            {} as any,
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

    const fetchUrl = endpoint?.isServerRequest
      ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
      : url;

    const response = await fetch(fetchUrl, {
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
    setStoreData({ data: responseJson });

    if (onSuccess && onSuccess.sequentialTo === actionId) {
      const actions = component.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess",
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
    console.log({ error });
    if (onError && onError.sequentialTo === actionId) {
      const actions = component.actions ?? [];
      const onErrorAction: Action = actions.find(
        (action: Action) => action.trigger === "onError",
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
        false,
      );
    }
  });
};

export type ReloadComponentActionParams = ActionParams & {
  action: ReloadComponentAction;
};

export const reloadComponentAction = ({
  action,
}: ReloadComponentActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const removeOnMountActionsRan =
    useEditorStore.getState().removeOnMountActionsRan;

  removeOnMountActionsRan(action.onMountActionId ?? "");
  updateTreeComponent(action.componentId, { key: nanoid() }, false);
};

export type BindDataActionParams = ActionParams & { action: BindDataAction };

export const bindDataAction = ({ action }: BindDataActionParams) => {};

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
  closeModal: {
    action: closeModalAction,
    form: CloseModalActionForm,
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
  reloadComponent: {
    action: reloadComponentAction,
    form: ReloadComponentActionForm,
  },
  toggleNavbar: {
    action: toggleNavbarAction,
    form: TogglePropsActionForm,
  },
  nextStep: {
    action: goToNextStepAction,
    form: NextStepActionForm,
  },
  previousStep: {
    action: goToPreviousStepAction,
    form: PreviousStepActionForm,
  },
  bindData: {
    action: bindDataAction,
    form: BindDataActionForm,
  },
};
