// import NextButton from "@/components/projects/NextButton";
// import { patchDataSource } from "@/requests/datasources/mutations";
// import { Endpoint } from "@/requests/datasources/types";
// import { PatchParams } from "@/requests/types";
// import { DataSourceStepperProps } from "@/utils/dashboardTypes";
// import {
//   Anchor,
//   Divider,
//   Flex,
//   Group,
//   Select,
//   Stack,
//   TextInput,
// } from "@mantine/core";
// import { UseFormReturnType, useForm } from "@mantine/form";
// import { useRouter } from "next/router";
// import { Dispatch, SetStateAction } from "react";
// import BackButton from "../projects/BackButton";
// import { AuthenticationStepParams } from "./AuthenticationStep";

// export const BasicDetailsInputs = ({
//     form,
//   }: {
//     form: UseFormReturnType<AuthenticationStepParams>;
//   }) => {
//     return (
// <>
// <Select
//           label="Login Endpoint (POST)"
//           description="The endpoint used to login to your API"
//           placeholder="/v1/login"
//           searchable
//           nothingFound="No options"
//           onChange={(value) => {
//             setLoginEndpoint(value ?? "");
//             form.getInputProps("loginEndpointId").onChange(value);
//           }}
//           defaultValue={loginEndpointId}
//           data={postEndpoints}
//         />
//         <Select
//           label="Refresh Endpoint (POST)"
//           description="The endpoint used to refresh your API token"
//           placeholder="/v1/login/refresh"
//           searchable
//           onChange={(value) => {
//             setRefreshEndpoint(value ?? "");
//             form.getInputProps("refreshEndpointId").onChange(value);
//           }}
//           defaultValue={refreshEndpointId}
//           data={postEndpoints}
//         />
//         <Select
//           label="User endpoint (GET)"
//           description="The endpoint used to user information"
//           placeholder="/v1/user"
//           searchable
//           onChange={(value) => {
//             setUserEndpoint(value ?? "");
//             form.getInputProps("userEndpointId").onChange(value);
//           }}
//           defaultValue={userEndpointId}
//           data={getEndpoints}
//         />
//         <TextInput
//           label="Access token property"
//           description="The property name of the access token in the response"
//           placeholder="access"
//           value={accessToken || ""}
//           onChange={(event) => setAccessToken(event.currentTarget.value)}
//         />
//         <TextInput
//           label="Refresh token property"
//           description="The property name of the refresh token in the response"
//           placeholder="refresh"
//           value={refreshToken || ""}
//           onChange={(event) => setRefreshToken(event.currentTarget.value)}
//         />
//         </>

// );
// };
