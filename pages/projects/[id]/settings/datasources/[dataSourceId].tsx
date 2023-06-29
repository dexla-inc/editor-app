import { Shell } from "@/components/AppShell";
import {
  BasicDetailsInputs,
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import {
  SwaggerURLInput,
  validateSwaggerUrl,
} from "@/components/datasources/SwaggerURLInput";
import {
  getDataSource,
  getDataSourceEndpoints,
} from "@/requests/datasources/queries";
import { DataSourceParams } from "@/requests/datasources/types";
import { Container, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectId = router.query.id as string;
  const dataSourceId = router.query.dataSourceId as string;

  useEffect(() => {
    const fetch = async () => {
      const result = await getDataSource(projectId, dataSourceId);
      form.setValues(result);

      const authEndpointResult = await getDataSourceEndpoints(
        projectId,
        result.type,
        dataSourceId,
        { authOnly: true }
      );
      console.log("authEndpointResult:" + JSON.stringify(authEndpointResult));
    };

    fetch();
  }, [projectId, dataSourceId]);

  const form = useForm<DataSourceParams>({
    initialValues: {
      swaggerUrl: "",
    },
    validate: {
      swaggerUrl: (value) => validateSwaggerUrl(value),
      baseUrl: (value) => validateBaseUrl(value),
      name: (value) => validateName(value),
    },
  });

  const onSubmit = async (values: DataSourceParams) => {};

  return (
    <Shell navbarType="project" user={user}>
      <Container py="xl">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <Title>Data Source Details</Title>
            <SwaggerURLInput isLoading={isLoading} form={form} />
            <BasicDetailsInputs form={form} />
          </Stack>
        </form>
      </Container>
    </Shell>
  );
}
