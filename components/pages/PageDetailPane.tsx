import { PageResponse } from "@/requests/pages/types";
import { ICON_SIZE } from "@/utils/config";
import { Button, Flex } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

type PageDetailPaneProps = {
  setShowDetail: (id: boolean) => void;
  page?: PageResponse;
};

export default function PageDetailPane({
  setShowDetail,
  page,
}: PageDetailPaneProps) {
  return (
    <>
      <Flex>
        <Button
          onClick={() => setShowDetail(false)}
          variant="subtle"
          leftIcon={<IconArrowLeft size={ICON_SIZE} />}
        >
          Back
        </Button>
      </Flex>
    </>
  );
}
