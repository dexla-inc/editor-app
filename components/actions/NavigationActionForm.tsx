import { QueryStringsForm } from "@/components/QueryStringsForm";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { QueryStringListItem } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import { NavigationAction } from "@/utils/actions";
import { requiredFieldValidator } from "@/utils/validation";
import { Select, Stack } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
type Props = {
  form: UseFormReturnType<Omit<NavigationAction, "name">>;
};

export const NavigationActionForm = ({ form }: Props) => {
  const pages = useEditorStore((state) => state.pages);

  // const pageId = form.getInputProps("pageId").value;

  // const pageQueryStrings = useMemo(() => {
  //   if (action.action?.pageId === pageId && action.action?.queryStrings) {
  //     return action.action?.queryStrings;
  //   }
  //
  //   return pages.find((page) => page.id === pageId)?.queryStrings ?? {};
  // }, [pages, pageId, action.action]);
  //
  const queryStringState = useState<Array<{ key: string; value: string }>>([]);

  // useEffect(() => {
  //   queryStringState[1](
  //     Object.entries(pageQueryStrings).map(([key, value]) => ({
  //       key,
  //       value,
  //     })),
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pageQueryStrings]);

  // const onSubmit = (values: FormValues) => {
  //   handleLoadingStart({ startLoading });
  //
  //   const queryStrings = queryStringState[0].reduce(
  //     (acc: Record<string, string>, item: QueryStringListItem) => {
  //       acc[item.key] = item.value;
  //       return acc;
  //     },
  //     {},
  //   );
  //
  //   try {
  //     updateActionInTree<NavigationAction>({
  //       selectedComponentId: selectedComponentId!,
  //       componentActions,
  //       id,
  //       updateValues: {
  //         pageId: values.pageId,
  //         pageSlug: values.pageSlug,
  //         queryStrings,
  //       },
  //       updateTreeComponentActions,
  //     });
  //
  //     handleLoadingStop({ stopLoading });
  //   } catch (error) {
  //     handleLoadingStop({ stopLoading, success: false });
  //   }
  // };

  return (
    <Stack>
      <Select
        size="xs"
        placeholder="Select a page"
        label="Page"
        searchable
        data={pages.map((page) => {
          return {
            label: page.title,
            value: page.id,
          };
        })}
        //required
        {...form.getInputProps("pageId")}
        onChange={(value) => {
          const page = pages.find((page) => page.id === value);
          form.setValues({
            pageId: value as string,
            pageSlug: page?.slug ?? "",
          });
        }}
      />
      {!!queryStringState[0].length && (
        <QueryStringsForm queryStringState={queryStringState} readOnlyKeys />
      )}
    </Stack>
  );
};
