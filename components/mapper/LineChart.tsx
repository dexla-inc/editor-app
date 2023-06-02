import { Card, useMantineTheme } from "@mantine/core";
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "January", sales: 1000, expenses: 500 },
  { month: "February", sales: 1500, expenses: 600 },
  { month: "March", sales: 2000, expenses: 700 },
  { month: "April", sales: 2500, expenses: 800 },
  { month: "May", sales: 3000, expenses: 900 },
  { month: "June", sales: 3500, expenses: 1000 },
  { month: "July", sales: 4000, expenses: 1100 },
  { month: "August", sales: 4500, expenses: 1200 },
  { month: "September", sales: 5000, expenses: 1300 },
  { month: "October", sales: 5500, expenses: 1400 },
  { month: "November", sales: 6000, expenses: 1500 },
  { month: "December", sales: 6500, expenses: 1600 },
];

export const LineChart = () => {
  const theme = useMantineTheme();
  return (
    <Card withBorder w="100%" h="100%">
      <ResponsiveContainer>
        <RechartsLineChart data={data}>
          <Line
            type="monotone"
            dataKey="sales"
            stroke={theme.colors.blue[6]}
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke={theme.colors.orange[6]}
            strokeWidth={3}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </Card>
  );
};
