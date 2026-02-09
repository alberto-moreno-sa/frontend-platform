import React from "react";

const createMockComponent = (name: string) => {
  const Component = ({ children, ...props }: Record<string, unknown>) =>
    React.createElement("div", { "data-testid": `recharts-${name}`, ...props }, children as React.ReactNode);
  Component.displayName = name;
  return Component;
};

export const AreaChart = createMockComponent("AreaChart");
export const Area = createMockComponent("Area");
export const BarChart = createMockComponent("BarChart");
export const Bar = createMockComponent("Bar");
export const PieChart = createMockComponent("PieChart");
export const Pie = createMockComponent("Pie");
export const Cell = createMockComponent("Cell");
export const XAxis = createMockComponent("XAxis");
export const YAxis = createMockComponent("YAxis");
export const Tooltip = createMockComponent("Tooltip");
export const Legend = createMockComponent("Legend");
export const ResponsiveContainer = createMockComponent("ResponsiveContainer");
