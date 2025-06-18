import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from 'lucide-react';

// Sample Data (can be passed as props)
const defaultChartData = [
  { category: "Groceries", spending: 450, fill: "var(--color-groceries)" },
  { category: "Utilities", spending: 220, fill: "var(--color-utilities)" },
  { category: "Transport", spending: 180, fill: "var(--color-transport)" },
  { category: "Entertainment", spending: 300, fill: "var(--color-entertainment)" },
  { category: "Healthcare", spending: 90, fill: "var(--color-healthcare)" },
  { category: "Other", spending: 150, fill: "var(--color-other)" },
];

// Sample Chart Configuration (can be passed as props or derived)
const defaultChartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))", // Default color for the bar
  },
  groceries: {
    label: "Groceries",
    color: "hsl(var(--chart-1))", // Example: using distinct colors for legend items
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-2))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--chart-3))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-4))",
  },
  healthcare: {
    label: "Healthcare",
    color: "hsl(var(--chart-5))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

interface SpendingDataPoint {
  category: string;
  spending: number;
  fill?: string; // Optional: if you want to control color per bar directly
}

interface SpendingAnalysisChartWidgetProps {
  title?: string;
  description?: string;
  data?: SpendingDataPoint[];
  chartConfig?: ChartConfig;
  // Future props: chartType ('bar', 'pie', 'line'), onTimePeriodChange, etc.
}

const SpendingAnalysisChartWidget: React.FC<SpendingAnalysisChartWidgetProps> = ({
  title = "Spending Analysis",
  description = "Monthly spending by category",
  data = defaultChartData,
  chartConfig = defaultChartConfig,
}) => {
  const [timePeriod, setTimePeriod] = useState("last30days");
  console.log('SpendingAnalysisChartWidget loaded');

  // Determine total spending for display
  const totalSpending = data.reduce((sum, item) => sum + item.spending, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger
              id="time-period"
              aria-label="Select time period"
              className="w-auto h-8 text-xs"
            >
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last90days">Last 90 Days</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -20, // Adjust to make Y-axis labels visible
                bottom: 5,
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" hideLabel />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="spending"
                radius={4}
                // If 'fill' is not in data, it uses chartConfig['spending'].color
                // If 'fill' IS in data, it uses that specific color for the bar
                // Recharts Bar component looks for `fill` on data items first.
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm pt-4 border-t">
        <div className="flex gap-2 font-medium leading-none">
          Total spending this period: ${totalSpending.toFixed(2)}
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing data for {timePeriod === "last30days" ? "the last 30 days" : timePeriod.replace(/([A-Z])/g, ' $1').toLowerCase()}.
        </div>
      </CardFooter>
    </Card>
  );
};

export default SpendingAnalysisChartWidget;