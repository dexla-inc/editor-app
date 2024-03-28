import React from "react";
import { render } from "@testing-library/react";
import { renderHook as rtlRenderHook } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a function to generate a new QueryClient instance for isolation between tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Turn off retries for testing
        retry: false,
      },
    },
  });
const AllTheProviders = ({ children }: any) => {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

const renderHook = (hook: any, props?: any) => {
  const { initialProps, wrapper = AllTheProviders, ...options } = props ?? {};

  return rtlRenderHook(hook, { initialProps, wrapper, ...options });
};

const customRender = (ui: any, options: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-hooks";
export { customRender as render, renderHook };
