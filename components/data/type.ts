import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { Component } from "@/utils/editor";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};
