import { Component } from "@/utils/editor";
import { PagingResponse } from "@/requests/types";
import { Endpoint } from "@/requests/datasources/types";
import { DynamicSettings } from "@/components/data/forms/DynamicSettings";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};
export const ContainerData = ({ component, endpoints }: DataProps) => {
  return <DynamicSettings component={component} endpoints={endpoints!} />;
};
