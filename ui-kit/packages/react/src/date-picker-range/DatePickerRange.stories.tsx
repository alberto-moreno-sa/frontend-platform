import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePickerRange } from "./DatePickerRange";
import type { DatePickerRangeValue } from "./DatePickerRange";

const meta = {
  title: "Components/DatePickerRange",
  component: DatePickerRange,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    numberOfMonths: { control: "number" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    displayFormat: { control: "text" },
    cancelLabel: { control: "text" },
    applyLabel: { control: "text" },
  },
} satisfies Meta<typeof DatePickerRange>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========== Wrapper for controlled state ========== */

function DatePickerRangeWrapper(props: React.ComponentProps<typeof DatePickerRange>) {
  const [value, setValue] = useState<DatePickerRangeValue>(props.value);
  return <DatePickerRange {...props} value={value} onChange={setValue} />;
}

/* ========== Stories ========== */

export const Default: Story = {
  render: (args) => <DatePickerRangeWrapper {...args} />,
};

export const WithValue: Story = {
  render: (args) => <DatePickerRangeWrapper {...args} />,
  args: {
    value: { from: new Date(2026, 1, 2), to: new Date(2026, 1, 14) },
  },
};

export const SingleMonth: Story = {
  render: (args) => <DatePickerRangeWrapper {...args} />,
  args: {
    numberOfMonths: 1,
  },
};

export const Disabled: Story = {
  render: (args) => <DatePickerRangeWrapper {...args} />,
  args: {
    disabled: true,
    value: { from: new Date(2026, 1, 2), to: new Date(2026, 1, 14) },
  },
};

export const CustomFormat: Story = {
  render: (args) => <DatePickerRangeWrapper {...args} />,
  args: {
    displayFormat: "dd/MM/yyyy",
    inputFormat: "dd/MM/yyyy",
    value: { from: new Date(2026, 1, 2), to: new Date(2026, 1, 14) },
  },
};

export const WithMinMaxDate: Story = {
  render: (args) => <DatePickerRangeWrapper {...args} />,
  args: {
    minDate: new Date(2026, 0, 1),
    maxDate: new Date(2026, 11, 31),
    placeholder: "Select within 2026",
  },
};

export const AlignEnd: Story = {
  render: (args) => (
    <div className="flex justify-end" style={{ width: 600 }}>
      <DatePickerRangeWrapper {...args} />
    </div>
  ),
  args: {
    align: "end",
  },
};

export const CustomLabels: Story = {
  render: (args) => <DatePickerRangeWrapper {...args} />,
  args: {
    cancelLabel: "Cancelar",
    applyLabel: "Aplicar",
    placeholder: "Seleccionar rango",
  },
};
