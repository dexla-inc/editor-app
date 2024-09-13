import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { ChangeLanguageActionForm } from "@/components/actions/ChangeLanguageActionForm";
import { ChangeStateActionForm } from "@/components/actions/ChangeStateActionForm";
import { ChangeVariableActionForm } from "@/components/actions/ChangeVariableActionForm";
import { CustomJavascriptActionForm } from "@/components/actions/CustomJavascriptActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { GoToUrlForm } from "@/components/actions/GoToUrlForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { RefreshAPICallActionForm } from "@/components/actions/RefreshAPICallActionForm";
import { ResetComponentActionForm } from "@/components/actions/ResetComponentActionForm";
import { ResetVariableActionForm } from "@/components/actions/ResetVariableActionForm";
import { ShowNotificationActionForm } from "@/components/actions/ShowNotificationActionForm";
import { TriggerLogicFlowActionForm } from "@/components/actions/TriggerLogicFlowActionForm";
import {
  DataSourceAuthResponse,
  DataSourceResponse,
  Endpoint,
} from "@/requests/datasources/types";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { PageResponse } from "@/requests/pages/types";
import { FrontEndTypes } from "@/requests/variables/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputsStore } from "@/stores/inputs";
import { useThemeStore } from "@/stores/theme";
import { useVariableStore } from "@/stores/variables";
import { ComputeValueProps, ValueProps } from "@/types/dataBinding";
import { ArrayMethods } from "@/types/types";
import { performFetch, prepareRequestData } from "@/utils/actionsApi";
import { isObject, safeJsonParse, toBase64 } from "@/utils/common";
import { Component, getColorFromTheme } from "@/utils/editor";
import { executeFlow } from "@/utils/logicFlows";
import { UseFormReturnType } from "@mantine/form";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { queryClient } from "./reactQuery";

const triggers = [
  "onClick",
  "onHover",
  "onChange",
  "onFocus",
  "onBlur",
  "onOpen",
  "onClose",
  "onSubmit",
  "onInvalid",
  "onReset",
  "onKeyDown",
  "onSearchChange",
  "onItemSubmit",
  // table actions
  "onRowClick",
  "onRowHover",
  "onRowSelect",
  "onRowExpand",
  "onSort",
  "onFilterApplied",
  "onSuccess",
  "onError",
  // page actions
  "onPageLoad",
] as const;

type ActionGroup =
  | "Data & Logic"
  | "Design"
  | "Binding"
  | "Navigation"
  | "Modal & Overlays"
  | "Style & Props"
  | "Feedback"
  | "Utilities & Tools"
  | "Third-Party Plugins";

type ActionInfo = {
  name: string;
  group: ActionGroup;
  icon?: string;
};

export const actions: ActionInfo[] = [
  { name: "apiCall", group: "Data & Logic", icon: "IconApi" },
  { name: "triggerLogicFlow", group: "Data & Logic", icon: "IconFlow" },
  { name: "changeVariable", group: "Data & Logic", icon: "IconVariable" },
  { name: "resetVariable", group: "Data & Logic", icon: "IconVariableOff" },
  { name: "refreshApiCall", group: "Data & Logic", icon: "IconRefreshDot" },
  {
    name: "resetComponent",
    group: "Data & Logic",
    icon: "IconClearFormatting",
  },
  { name: "changeState", group: "Design", icon: "IconTransform" },
  { name: "navigateToPage", group: "Navigation", icon: "IconFileInvoice" },
  { name: "goToUrl", group: "Navigation", icon: "IconLink" },
  { name: "showNotification", group: "Feedback" },
  { name: "alert", group: "Feedback", icon: "IconAlert" },
  { name: "customJavascript", group: "Utilities & Tools", icon: "IconCode" },
  { name: "copyToClipboard", group: "Utilities & Tools", icon: "IconCopy" },
  {
    name: "changeLanguage",
    group: "Utilities & Tools",
    icon: "IconMessageLanguage",
  },
];

export type ActionFormProps<T> = {
  form: UseFormReturnType<T>;
  isPageAction?: boolean;
  actionId?: string;
};

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
  pageSlug: string;
  queryStrings?: Array<{ key: string; value: ValueProps }>;
  runInEditMode: boolean;
  openInNewTab: boolean;
}

export interface GoToUrlAction extends BaseAction {
  name: "goToUrl";
  url: ValueProps;
  openInNewTab: boolean;
}

export interface AlertAction extends BaseAction {
  name: "alert";
  message: string;
}

export interface TriggerLogicFlowAction extends BaseAction {
  name: "triggerLogicFlow";
  // obsolete, use logicFlow instead
  logicFlowId: string;
  logicFlow: LogicFlowResponse;
}

export interface ShowNotificationAction extends BaseAction {
  name: "showNotification";
  title: ValueProps;
  message: ValueProps;
  color: string;
}

export interface ChangeStateAction extends BaseAction {
  name: "changeState";
  componentId: ValueProps;
  state: ValueProps;
}

export type EndpointAuthType = "authenticated" | "login" | "logout";

export interface RefreshAPICallAction extends BaseAction {
  name: "refreshApiCall";
  endpoint: string;
}

export interface APICallAction extends BaseAction {
  name: "apiCall";
  endpoint: string;
  authConfig: Omit<DataSourceAuthResponse, "type">;
  showLoader?: boolean;
  datasources: DataSourceResponse[];
  binds?: {
    header: { [key: string]: any };
    parameter: { [key: string]: any };
    body: { [key: string]: any };
  };
  authType: EndpointAuthType;
}

export interface ChangeStepAction extends BaseAction {
  name: "changeStep";
  stepperId: string;
  control: "previous" | "next";
}

export interface ChangeLanguageAction extends BaseAction {
  name: "changeLanguage";
  language: ValueProps;
}

export interface CustomJavascriptAction extends BaseAction {
  name: "customJavascript";
  code: string;
}

export interface ChangeVariableAction extends BaseAction {
  name: "changeVariable";
  variableId: string;
  variableType: FrontEndTypes;
  value: ValueProps;
  method?: ArrayMethods;
  index?: ValueProps;
  partialUpdate?: boolean;
  path?: ValueProps;
}

export interface ResetVariableAction extends BaseAction {
  name: "resetVariable";
  variableId: string;
  variableIds: string[];
  multiple: boolean;
}

export interface ResetComponentAction extends BaseAction {
  name: "resetComponent";
  componentIds: string[];
}

export type ActionType =
  | NavigationAction
  | AlertAction
  | APICallAction
  | GoToUrlAction
  | ShowNotificationAction
  | ChangeStateAction
  | TriggerLogicFlowAction
  | ChangeLanguageAction
  | ChangeVariableAction
  | ResetComponentAction;

export type Action = {
  id: string;
  trigger: ActionTrigger;
  action: ActionType;
  sequentialTo?: string;
};

export type ActionParams = {
  actionId: string;
  router: AppRouterInstance;
  computeValue: ComputeValueProps;
  event?: any;
  entity: Component | PageResponse;
  data?: any;
  flowsList?: LogicFlowResponse[];
};

export type NavigationActionParams = ActionParams & {
  action: NavigationAction;
};

export type GoToUrlParams = ActionParams & {
  action: GoToUrlAction;
};

export const useNavigationAction = ({
  action,
  router,
  computeValue,
}: NavigationActionParams) => {
  const isLive = useEditorTreeStore.getState().isLive;
  const projectId = useEditorTreeStore.getState().currentProjectId;

  if (!action.pageId || !action.pageSlug) {
    console.error("Page Id is not defined");
    return;
  }

  let url = isLive
    ? `/${action.pageSlug}`.replace("//", "/")
    : `/projects/${projectId}/editor/${action.pageId}`;

  if (action.queryStrings?.length) {
    const queryStrings = action.queryStrings.map((item) => {
      return `${item.key}=${computeValue({ value: item.value })}`;
    });

    url += `?${queryStrings.join("&")}`;
  }

  if (action.openInNewTab) {
    window.open(url, "_blank");
  } else {
    router.push(url);
  }
};

export const useGoToUrlAction = async ({
  action,
  computeValue,
}: GoToUrlParams) => {
  const { url, openInNewTab } = action;
  const value = String(computeValue<string>({ value: url }));

  if (openInNewTab) {
    window.open(value, "_blank");
  } else {
    window.location.href = value;
  }
};

export type DebugActionParams = ActionParams & {
  action: AlertAction;
};

export const useDebugAction = async ({ action }: DebugActionParams) => {
  alert(action.message);
};

export type TriggerLogicFlowActionParams = ActionParams & {
  action: TriggerLogicFlowAction;
};

export type ShowNotificationActionParams = ActionParams & {
  action: ShowNotificationAction;
};

export type ChangeStateActionParams = ActionParams & {
  action: ChangeStateAction;
};

export type ChangeLanguageActionParams = ActionParams & {
  action: ChangeLanguageAction;
};

export type ResetComponentActionParams = ActionParams & {
  action: ResetComponentAction;
};

export const useShowNotificationAction = async ({
  action,
  computeValue,
}: ShowNotificationActionParams) => {
  const theme = useThemeStore.getState().theme;
  const showNotification = useThemeStore.getState().showNotification;
  const color = getColorFromTheme(theme, action.color);

  const title = String(computeValue<string>({ value: action.title }));
  const message = String(computeValue<string>({ value: action.message }));

  return showNotification({
    title,
    message,
    color,
  });
};

export const useTriggerLogicFlowAction = async (
  params: TriggerLogicFlowActionParams,
) => {
  const selectedFlow = params.flowsList?.find(
    (flow: LogicFlowResponse) => flow.id === params.action.logicFlowId,
  );

  if (selectedFlow) {
    return executeFlow(selectedFlow, params);
  }

  return;
};

export const useChangeStateAction = ({
  action,
  computeValue,
}: ChangeStateActionParams) => {
  const componentId = computeValue<string>({ value: action.componentId });
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;

  updateTreeComponentAttrs({
    componentIds: [componentId],
    attrs: {
      onLoad: { currentState: action.state },
    },
  });
};

export type APICallActionParams = ActionParams & {
  action: APICallAction;
  endpointResults: Endpoint[];
};

export type RefreshApiCallActionParams = ActionParams & {
  action: RefreshAPICallAction;
  endpointResults: Endpoint[];
};

const handleError = async (props: APICallActionParams) => {
  const onErrorAction = props.entity.actions?.find(
    (action: Action) =>
      action.trigger === "onError" && action.sequentialTo === props.actionId,
  );

  const onErrorActionMapped =
    onErrorAction && actionMapper(onErrorAction.action.name);

  if (!onErrorActionMapped || !onErrorAction) {
    return;
  }

  await onErrorActionMapped.action({
    ...props,
    // @ts-ignore
    action: onErrorAction?.action,
    actionId: onErrorAction.id,
  });
};

const handleSuccess = async (props: APICallActionParams) => {
  const onSuccessAction = props.entity.actions?.find(
    (action: Action) =>
      action.trigger === "onSuccess" && action.sequentialTo === props.actionId,
  );

  const onSuccessActionMapped =
    onSuccessAction && actionMapper(onSuccessAction.action.name);

  if (!onSuccessActionMapped || !onSuccessAction) {
    return;
  }

  return onSuccessActionMapped.action({
    ...props,
    // @ts-ignore
    action: onSuccessAction.action,
    actionId: onSuccessAction.id,
  });
};

const setLoadingState = (componentId: string, isLoading: boolean) => {
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;

  updateTreeComponentAttrs({
    componentIds: [componentId],
    attrs: { props: { loading: isLoading } },
    save: false,
  });
};

export const useRefreshApiCallAction = async (
  props: RefreshApiCallActionParams,
): Promise<any> => {
  const { action, endpointResults } = props;

  const endpoint = endpointResults?.find((e) => e.id === action.endpoint)!;

  const queryKey = endpoint?.id;

  if (queryKey) {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  }
};

export const useApiCallAction = async (
  props: APICallActionParams,
): Promise<any> => {
  const { action, computeValue, entity, endpointResults } = props;

  const projectId = useEditorTreeStore.getState().currentProjectId as string;

  if (entity?.props && action.showLoader) {
    setLoadingState(entity.id!, true);
  }

  const endpoint = endpointResults?.find((e) => e.id === action.endpoint)!;

  try {
    const accessToken = useDataSourceStore
      .getState()
      .getAuthState(projectId)?.accessToken;

    const { url, header, body } = prepareRequestData(
      action,
      endpoint,
      computeValue,
    );

    let responseJson: any;

    // TODO: Need to do this properly when we support more auth than bearer
    const authHeaderKey = accessToken ? "Bearer " + accessToken : "";

    const fetchUrl = endpoint?.isServerRequest
      ? `/api/proxy?targetUrl=${toBase64(url)}`
      : url;

    switch (action.authType) {
      case "login":
        responseJson = await performFetch(
          url,
          endpoint.methodType,
          header,
          body,
          endpoint.mediaType,
          authHeaderKey,
        );
        const apiAuthConfig = useDataSourceStore.getState().apiAuthConfig;
        const authConfig = apiAuthConfig?.[endpoint.dataSourceId];
        const mergedAuthConfig = { ...responseJson, ...authConfig };
        const setAuthTokens = useDataSourceStore.getState().setAuthTokens;

        setAuthTokens(projectId, mergedAuthConfig);
        break;
      case "logout":
        responseJson = await performFetch(
          fetchUrl,
          endpoint.methodType,
          header,
          body,
          endpoint.mediaType,
          authHeaderKey,
        );

        const clearAuthTokens = useDataSourceStore.getState().clearAuthTokens;
        const resetVariables = useVariableStore.getState().resetVariables;

        clearAuthTokens(projectId);
        resetVariables();

        break;
      default:
        const refreshAccessToken =
          useDataSourceStore.getState().refreshAccessToken;

        refreshAccessToken(projectId, endpoint?.dataSourceId as string);

        responseJson = await performFetch(
          fetchUrl,
          endpoint.methodType,
          header,
          body ?? {},
          endpoint.mediaType,
          authHeaderKey,
        );
    }

    return responseJson;
  } finally {
    setLoadingState(entity.id!, false);
  }
};

export const useChangeLanguageAction = ({
  action,
  computeValue,
}: ChangeLanguageActionParams) => {
  const setLanguage = useEditorTreeStore.getState().setLanguage;
  const language = computeValue({ value: action.language });
  setLanguage(language as string);
};

// IMPORTANT: do not delete the variable data as it is used in the eval
export const useCustomJavascriptAction = ({ action, data }: any) => {
  return new Function(action.code)();
};

export type ChangeVariableActionParams = ActionParams & {
  action: ChangeVariableAction;
};

export type ResetVariableActionParams = ActionParams & {
  action: ResetVariableAction;
};

type ArrayActionsType = Partial<{
  value: Array<any>;
  newValue: any;
  index: number;
  path: string;
}>;
const arrayActions = {
  REPLACE_ALL_ITEMS: ({ newValue }: ArrayActionsType) => newValue,

  UPDATE_ONE_ITEM: ({
    value = [],
    newValue,
    index = 0,
    path,
  }: ArrayActionsType) => {
    if (!path || path === "") {
      value[index] = newValue;
    } else {
      const item = value[index];
      value[index] = !isObject(item)
        ? { [path]: newValue }
        : { ...item, [path]: newValue };
    }
    return value;
  },

  INSERT_AT_END: ({ value = [], newValue }: ArrayActionsType) => {
    value.push(newValue);
    return value;
  },

  INSERT_AT_START: ({ value = [], newValue }: ArrayActionsType) => {
    value.unshift(newValue);
    return value;
  },

  INSERT_AT_INDEX: ({ value = [], newValue, index = 0 }: ArrayActionsType) => {
    value.splice(index, 0, newValue);
    return value;
  },

  REMOVE_AT_INDEX: ({ value = [], index = 0 }: ArrayActionsType) => {
    value.splice(index, 1);
    return value;
  },

  REMOVE_AT_START: ({ value = [] }: ArrayActionsType) => {
    value.shift();
    return value;
  },

  REMOVE_AT_LAST: ({ value = [] }: ArrayActionsType) => {
    value.pop();
    return value;
  },

  TOGGLE_ITEM: ({ value = [], newValue }: ArrayActionsType) => {
    const index = value.indexOf(newValue);
    if (index === -1) {
      value.push(newValue);
    } else {
      value.splice(index, 1);
    }
    return value;
  },
};

type UpdateVariableArrayParams = {
  currentValue: any;
  method: ArrayMethods | undefined;
  index: number | undefined;
  newValue: any;
  path: string;
};

const updateVariableArray = ({
  currentValue,
  method,
  index = 0,
  newValue,
  path,
}: UpdateVariableArrayParams) => {
  if (method) {
    currentValue = arrayActions[method]({
      value: currentValue,
      newValue,
      index,
      path,
    });
  }

  return currentValue;
};

export const useChangeVariableAction = async ({
  action,
  computeValue,
}: ChangeVariableActionParams) => {
  const variable = Object.values(useVariableStore.getState().variableList).find(
    (v) => v.id === action.variableId,
  );

  if (!variable) {
    return;
  }

  const variableValue = variable.value ?? variable.defaultValue;
  const currentValue =
    typeof variableValue === "string"
      ? safeJsonParse(variableValue)
      : variableValue;

  const setVariable = useVariableStore.getState().setVariable;
  const index = computeValue<number>({ value: action.index });
  const path = computeValue<string>({ value: action.path });
  const computedValue = computeValue({ value: action.value });
  let newValue = safeJsonParse(computedValue);

  if (action.variableType === "ARRAY") {
    newValue = updateVariableArray({
      currentValue,
      method: action.method,
      index,
      newValue,
      path,
    });
  } else if (action.variableType === "OBJECT" && action.partialUpdate) {
    currentValue[path] = newValue;
    newValue = currentValue;
  }

  setVariable({
    id: action.variableId,
    value: newValue,
  });
};

export const useResetVariableAction = async ({
  action,
}: ResetVariableActionParams) => {
  const resetVariable = useVariableStore.getState().resetVariable;

  action.variableIds?.forEach((id) => resetVariable(id));
};

export const useResetComponentAction = ({
  action,
}: ResetComponentActionParams) => {
  const resetComponents = useInputsStore.getState().resetInputValues;
  resetComponents(action.componentIds);
};

export const actionMapper = (actionName: string) => {
  const actions: Record<string, any> = {
    alert: {
      action: useDebugAction,
      form: DebugActionForm,
      defaultValues: {},
    },
    changeVariable: {
      action: useChangeVariableAction,
      form: ChangeVariableActionForm,
      defaultValues: {},
    },
    resetVariable: {
      action: useResetVariableAction,
      form: ResetVariableActionForm,
      defaultValues: {},
    },
    navigateToPage: {
      action: useNavigationAction,
      form: NavigationActionForm,
      defaultValues: {
        // runInEditMode: isPageAction ? false : true
        runInEditMode: true,
        queryStrings: [],
      },
    },
    refreshApiCall: {
      action: useRefreshApiCallAction,
      form: RefreshAPICallActionForm,
      defaultValues: {},
    },
    apiCall: {
      action: useApiCallAction,
      form: APICallActionForm,
      defaultValues: {
        authConfig: useDataSourceStore.getState().apiAuthConfig,
        showLoader: true,
        datasources: [],
        binds: {
          header: {},
          parameter: {},
          body: {},
        },
        authType: "authenticated",
      },
    },
    goToUrl: {
      action: useGoToUrlAction,
      form: GoToUrlForm,
      defaultValues: {},
    },
    triggerLogicFlow: {
      action: useTriggerLogicFlowAction,
      form: TriggerLogicFlowActionForm,
      defaultValues: {},
    },
    showNotification: {
      action: useShowNotificationAction,
      form: ShowNotificationActionForm,
      defaultValues: {
        color: "Primary.6",
      },
    },
    changeState: {
      action: useChangeStateAction,
      form: ChangeStateActionForm,
      defaultValues: {},
    },
    changeLanguage: {
      action: useChangeLanguageAction,
      form: ChangeLanguageActionForm,
      defaultValues: {},
    },
    customJavascript: {
      action: useCustomJavascriptAction,
      form: CustomJavascriptActionForm,
      defaultValues: {},
    },
    resetComponent: {
      action: useResetComponentAction,
      form: ResetComponentActionForm,
      defaultValues: {},
    },
  };

  const selectedAction = actions[actionName];

  const customAction = async (props: any) => {
    try {
      const responseJson = await selectedAction.action(props);

      props.setTriggeredActionsResponses(props.actionId, {
        success: responseJson,
        status: "success",
      });
      props.setActionsResponse(props.actionId, {
        success: responseJson,
        status: "success",
        list: {
          id: props.actionId,
          name: props.action.name,
          success: responseJson,
        },
      });

      // @ts-ignore
      await handleSuccess(props);
    } catch (error) {
      if (error instanceof Error) {
        props.setTriggeredActionsResponses(props.actionId, {
          error: safeJsonParse(error.message),
          status: "error",
        });
        props.setActionsResponse(props.actionId, {
          error: safeJsonParse(error.message),
          status: "error",
          list: {
            id: props.actionId,
            name: props.action.name,
            error: error.message,
          },
        });
      }

      // @ts-ignore
      await handleError(props);
    }
  };

  return { ...selectedAction, action: customAction };
};
