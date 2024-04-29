import { Component } from "@/utils/editor";
import { CSSObject } from "@mantine/core";

export const handleBackground = (component: Component, styles: CSSObject) => {
  const isGradient = component.props?.bg?.includes("gradient");
  const hasImage = !!styles.backgroundImage;

  if (isGradient && hasImage) {
    styles.backgroundImage = `${styles.backgroundImage}, ${component.props?.bg}`;
  }
};
