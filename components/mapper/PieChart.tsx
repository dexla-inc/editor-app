import { Card, useMantineTheme } from "@mantine/core";
import {
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
} from "recharts";

const data01 = [
  { name: "Category 1", value: 200 },
  { name: "Category 2", value: 350 },
  { name: "Category 3", value: 100 },
  { name: "Category 4", value: 450 },
  { name: "Category 5", value: 300 },
];

export const PieChart = () => {
  const theme = useMantineTheme();
  return (
    <Card withBorder w="100%" h="100%">
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data01}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={50}
            fill={theme.colors.blue[6]}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Card>
  );
};
