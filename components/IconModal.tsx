import { Icon } from "@/components/Icon";
import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Anchor,
  Col,
  Grid,
  Input,
  Modal,
  Pagination,
  Paper,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import * as Icons from "@tabler/icons-react";
import { useState } from "react";

const toSpaced = (name: string) => {
  return name
    .replace("Icon", "")
    .replace(/([A-Z])/g, " $1")
    .trim();
};

const allIconNames = Object.keys(Icons)
  .filter(
    (name) =>
      name !== "Icon" &&
      name !== "TablerIconsProps" &&
      name !== "createReactComponent"
  )
  .map((name) => ({ original: name, spaced: toSpaced(name) }));

type Props = {
  onIconSelect: (iconName: string) => void;
};

export const IconModal = ({ onIconSelect }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useMantineTheme();
  const iconsPerPage = 30;

  const filteredIconNames = allIconNames.filter(({ spaced }) =>
    spaced.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Get current icons
  const indexOfLastIcon = currentPage * iconsPerPage;
  const indexOfFirstIcon = indexOfLastIcon - iconsPerPage;
  const currentIcons = filteredIconNames.slice(
    indexOfFirstIcon,
    indexOfLastIcon
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const onIconClick = (iconName: string) => {
    onIconSelect(iconName);
    closeModal();
  };

  return (
    <Stack>
      <Anchor onClick={openModal} size="sm">
        Change Icon <Icon name="IconExternalLink" size={ICON_SIZE} />
      </Anchor>
      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        title="Select an icon"
        size="70%"
      >
        <Stack spacing="lg">
          <Input
            placeholder="Search icons"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <Grid
            gutter={theme.spacing.md}
            style={{ marginTop: theme.spacing.md }}
          >
            {currentIcons.map(({ original, spaced }) => (
              <Col span={2} key={original}>
                <Tooltip label={spaced}>
                  <Paper
                    p={theme.spacing.md}
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      boxShadow:
                        "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                      ...buttonHoverStyles(theme),
                    }}
                    onClick={() => onIconClick(original)}
                  >
                    <Icon name={original} size={LARGE_ICON_SIZE} />
                    <Text truncate>{spaced}</Text>
                  </Paper>
                </Tooltip>
              </Col>
            ))}
          </Grid>
          <Pagination
            total={Math.ceil(filteredIconNames.length / iconsPerPage)}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </Stack>
      </Modal>
    </Stack>
  );
};
