import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { MonacoEditorJson } from "@/components/MonacoEditorJson";
import { NumberInput, Select, TextInput } from "@mantine/core";

export const ComponentToBindField = {
  Boolean: SegmentedControlInput,
  YesNo: SegmentedControlYesNo,
  Array: MonacoEditorJson,
  Text: TextInput,
  Number: NumberInput,
  Select: Select,
};
