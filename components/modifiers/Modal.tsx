import { withModifier } from "@/hoc/withModifier";
import { ModalDrawerFormBuilder } from "@/components/modifiers/ModalDrawerFormBuilder";

const Modifier = withModifier(({ selectedComponent }) => {
  return <ModalDrawerFormBuilder selectedComponent={selectedComponent} />;
});

export default Modifier;
