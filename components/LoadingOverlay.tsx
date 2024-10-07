import React from "react";
import { Loader, LoaderProps, Text, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor:
      theme.colorScheme === "dark"
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure the overlay is above other elements
  },
}));

/**
 * LoadingOverlay Component
 *
 * @param {Object} props
 * @param {boolean} props.visible - Determines if the overlay is visible
 * @param {string} [props.text] - Optional text to display below the loader
 */

type Props = {
  visible?: boolean;
  text?: string;
} & LoaderProps;

const LoadingOverlay = ({ visible, text, ...props }: Props) => {
  const { classes } = useStyles();

  if (!visible) return null;

  return (
    <div className={classes.overlay}>
      <Loader {...props} />
      {text && (
        <Text size="md" mt="md" align="center">
          {text}
        </Text>
      )}
    </div>
  );
};

export default LoadingOverlay;
