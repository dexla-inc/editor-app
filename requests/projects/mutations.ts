import { ProjectParams, ProjectResponse } from "@/requests/projects/types";
import { PatchParams } from "@/requests/types";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { del, get, patch, post } from "@/utils/api";
import { buildQueryString } from "@/types/dashboardTypes";
import { evictCache } from "@/requests/cache/queries-noauth";

export const createProject = async (
  params: ProjectParams | { companyId: string },
  empty: boolean = false,
) => {
  let url = `/projects`;

  url += buildQueryString({ empty });

  const response = (await post<ProjectResponse>(
    url,
    params,
  )) as ProjectResponse;

  return response;
};

export const createEntities = async (params: ProjectParams, init = {}) => {
  const accessToken = usePropelAuthStore.getState().accessToken;
  const response = await fetch("/api/ai/entities", {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...params,
      appDescription: params.description,
      appIndustry: params.industry,
      accessToken,
    }),
  });

  const json = await response.json();
  return json as ProjectResponse;
};

export const patchProject = async (id: string, params: PatchParams[]) => {
  const url = `/projects/${id}`;
  const response = (await patch<ProjectResponse>(
    url,
    params,
  )) as ProjectResponse;

  const cacheTag = getCacheTag(id);
  await evictCache(cacheTag);

  return response;
};

export const deleteProject = async (id: string) => {
  const url = `/projects/${id}`;

  const response = (await del<any>(url)) as any;

  const cacheTag = getCacheTag(id);
  await evictCache(cacheTag);

  return response;
};

export const getProject = async (
  projectIdOrDomain: string,
  branding: boolean,
) => {
  const url = `/projects/${projectIdOrDomain}?branding=${branding}`;
  const response = (await get<ProjectResponse>(url, {})) as ProjectResponse;

  return response;
};

const getCacheTag = (projectId: string) => `/projects/${projectId}`;
