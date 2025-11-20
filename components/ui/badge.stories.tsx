import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const TaskPriorities: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="destructive">High</Badge>
      <Badge variant="default">Medium</Badge>
      <Badge variant="secondary">Low</Badge>
    </div>
  ),
};

export const TaskFrequencies: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Daily</Badge>
      <Badge variant="outline">Weekly</Badge>
      <Badge variant="outline">Monthly</Badge>
      <Badge variant="outline">Custom</Badge>
    </div>
  ),
};

export const TaskStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Badge variant="default">Pending</Badge>
        <Badge variant="secondary">In Progress</Badge>
        <Badge variant="outline">Completed</Badge>
      </div>
      <div className="flex gap-2">
        <Badge variant="destructive">Overdue</Badge>
        <Badge variant="secondary">Paused</Badge>
        <Badge variant="outline">Scheduled</Badge>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
