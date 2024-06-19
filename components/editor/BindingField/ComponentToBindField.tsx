import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { MonacoEditorJson } from "@/components/MonacoEditorJson";
import { NumberInput, Select, TextInput } from "@mantine/core";

export const ComponentToBindField = {
  Text: TextInput,
  Array: MonacoEditorJson,
  YesNo: SegmentedControlYesNo,
  Boolean: SegmentedControlInput,
  Segmented: SegmentedControlInput,
  Select: Select,
  Number: NumberInput,
};
