import {
  Box,
  Center,
  Group,
  PasswordInputProps,
  Progress,
  Text,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import React, { Fragment } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";

type Props = Omit<PasswordInputProps, "value"> & {
  children: React.ReactNode;
  isPreviewMode: Boolean;
  value: string;
  displayRequirements?: boolean;
  testParameters: { [key: string]: any };
};

function getStrength(password: string, requirements: any) {
  let multiplier = password?.length > 5 ? 0 : 1;

  requirements?.forEach((requirement: any) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

function createValidationObject(passwordRange: Array<any>) {
  const [minLength, maxLength] = passwordRange;
  const regexPattern = `^.{${minLength},${maxLength}}$`;
  const regex = new RegExp(regexPattern);

  const label = `Must be between ${minLength} and ${maxLength} characters`;

  return {
    re: regex,
    label: label,
  };
}

function fetchRequirements(testParameters: any) {
  let requirements = [] as any;
  if (testParameters?.passwordRange) {
    requirements.push(createValidationObject(testParameters.passwordRange));
  }
  if (testParameters?.passwordNumber) {
    requirements.push({ re: /[0-9]/, label: "Includes number" });
  }
  if (testParameters?.passwordLower) {
    requirements.push({ re: /[a-z]/, label: "Includes lowercase letter" });
  }
  if (testParameters?.passwordUpper) {
    requirements.push({ re: /[A-Z]/, label: "Includes uppercase letter" });
  }
  if (testParameters?.passwordSpecial) {
    requirements.push({
      re: /[$&+,:;=?@#|'<>.^*()%!-]/,
      label: "Includes special symbol",
    });
  }
  return requirements;
}

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text component="div" c={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? (
          <IconCheck size="0.9rem" stroke={1.5} />
        ) : (
          <IconX size="0.9rem" stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

export const PasswordInputWrapper = ({
  children,
  value,
  displayRequirements,
  testParameters,
  width,
}: Props) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const sanitizedValue = value ?? "";
  const requirements = fetchRequirements(testParameters);
  const strength = getStrength(sanitizedValue, requirements);
  const checks = requirements.map((requirement: any, index: number) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(sanitizedValue)}
    />
  ));
  const bars = Array(requirements.length)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          sanitizedValue.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / requirements.length) * 100
              ? 100
              : 0
        }
        color={strength > 90 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  const Wrapper = !isPreviewMode ? Fragment : Box;
  const dropdownContent =
    isPreviewMode && displayRequirements ? (
      <Box>
        <Group spacing={5} grow mt="xs" mb="md">
          {bars}
        </Group>
        {checks}
      </Box>
    ) : (
      <></>
    );

  return (
    <Wrapper {...(isPreviewMode ? { w: width } : {})}>
      {children}
      {dropdownContent}
    </Wrapper>
  );
};
