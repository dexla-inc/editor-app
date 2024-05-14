import { withModifier } from "@/hoc/withModifier";
import { CheckboxFormBuilder } from "./CheckboxFormBuilder";

const Modifier = withModifier(({ selectedComponent }) => {
  return <CheckboxFormBuilder selectedComponent={selectedComponent} />;
});

export default Modifier;
