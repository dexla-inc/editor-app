import { Chart } from "@/libs/dnd-flex/components/mapper/charts/Chart";
import { EditableComponentMapper } from "@/utils/editor";

type Props = EditableComponentMapper;

export const AreaChart = (props: Props) => {
  return <Chart {...props} />;
};
