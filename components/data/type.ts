import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { Component } from "@/utils/editor";
import { DataType } from "@/types/dataBinding";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: DataType;
};
