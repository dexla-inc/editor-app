import { Endpoint, ExampleResponse } from "@/requests/datasources/types";
import {
  Flex,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Prism } from "@mantine/prism";

type DataSourceEndpointDetailProps = {
  endpoint: Endpoint;
};
const demoCode = `import { Button } from '@mantine/core';

function Demo() {
  return <Button>Hello</Button>
}`;

const MethodTypeArray = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

export const DataSourceEndpointDetail = ({
  endpoint,
}: DataSourceEndpointDetailProps) => {
  return (
    <Stack p="md">
      <TextInput
        label="Description"
        placeholder="Add a new user"
        defaultValue={endpoint.description ?? ""}
      />
      <Flex gap="md">
        <Select
          label="Method Type"
          placeholder="Add a new user"
          data={MethodTypeArray}
          value={endpoint.methodType}
          sx={{ width: 100 }}
        ></Select>
        <TextInput
          label="Relative URL"
          placeholder="/v1/user"
          defaultValue={endpoint.relativeUrl}
          sx={{ flexGrow: 1 }}
        />
      </Flex>
      {endpoint.requestBody.length > 0 && <Title order={6}>Request Body</Title>}
      {endpoint.requestBody.map((bodyParameter, index) => (
        <Flex key={index} align="center" gap="md">
          <TextInput size="sm" defaultValue={bodyParameter.name} />
          <TextInput placeholder="value" sx={{ flexGrow: 1 }} />
        </Flex>
      ))}
      <Title order={6}>Parameters</Title>
      {endpoint.parameters.length > 0
        ? endpoint.parameters.map((parameter, index) => (
            <Flex key={index} align="center" gap="md">
              <Text size="xs" color="grey" sx={{ width: 50 }}>
                {`(${parameter.location})`}
              </Text>
              <TextInput size="sm" defaultValue={parameter.name}></TextInput>
              <TextInput placeholder="value" sx={{ flexGrow: 1 }} />
            </Flex>
          ))
        : "1"}
      <Tabs defaultValue="example">
        <Tabs.List>
          <Tabs.Tab value="example">Example Response</Tabs.Tab>
          {/* <Tabs.Tab value="actual">Actual Response</Tabs.Tab> */}
        </Tabs.List>
        <Tabs.Panel value="example" pt="xs">
          <Prism language="json">
            {JSON.stringify(endpoint.exampleResponse, null, 2)}
          </Prism>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

function convertExampleResponseToObject(
  arr: ExampleResponse[] | undefined
): any {
  const result: { [key: string]: any } = {};

  arr?.forEach(({ name, type, children }) => {
    if (type === "object") {
      result[name] = convertExampleResponseToObject(children);
    } else if (type === "array") {
      if (children && children.length > 0) {
        // Create an object that contains all properties of the children
        const childObject = children.reduce((obj, child) => {
          return { ...obj, ...convertExampleResponseToObject([child]) };
        }, {});
        result[name] = [childObject];
      } else {
        result[name] = [];
      }
    } else if (type === "string") {
      result[name] = "";
    } else if (type === "integer") {
      result[name] = 0;
    }
  });

  return result;
}
