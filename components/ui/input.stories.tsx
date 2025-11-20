import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'name@example.com',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search tasks...',
  },
};

export const Date: Story = {
  args: {
    type: 'date',
  },
};

export const Time: Story = {
  args: {
    type: 'time',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithDefaultValue: Story = {
  args: {
    type: 'text',
    defaultValue: 'Default value',
  },
};

export const TaskNameInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="task-name">Task Name</Label>
      <Input
        type="text"
        id="task-name"
        placeholder="e.g., Morning meditation"
      />
      <p className="text-xs text-muted-foreground">
        Give your task a clear, actionable name
      </p>
    </div>
  ),
};

export const TaskTimeInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="task-time">Estimated Time (minutes)</Label>
      <Input
        type="number"
        id="task-time"
        placeholder="15"
        min="1"
        max="480"
      />
    </div>
  ),
};

export const FormInputs: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="heading-4">Create New Task</h3>
        <p className="text-sm text-muted-foreground">
          Add a new task to your daily routine
        </p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="name">Task Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., Read for 20 minutes"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          placeholder="Optional details..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" defaultValue="08:00" />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input id="duration" type="number" defaultValue="30" />
        </div>
      </div>
    </div>
  ),
};

export const AllInputTypes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-3">
      <div className="grid gap-1.5">
        <Label>Text Input</Label>
        <Input type="text" placeholder="Text input" />
      </div>

      <div className="grid gap-1.5">
        <Label>Email Input</Label>
        <Input type="email" placeholder="email@example.com" />
      </div>

      <div className="grid gap-1.5">
        <Label>Password Input</Label>
        <Input type="password" placeholder="********" />
      </div>

      <div className="grid gap-1.5">
        <Label>Number Input</Label>
        <Input type="number" placeholder="123" />
      </div>

      <div className="grid gap-1.5">
        <Label>Search Input</Label>
        <Input type="search" placeholder="Search..." />
      </div>

      <div className="grid gap-1.5">
        <Label>Date Input</Label>
        <Input type="date" />
      </div>

      <div className="grid gap-1.5">
        <Label>Time Input</Label>
        <Input type="time" />
      </div>

      <div className="grid gap-1.5">
        <Label>Disabled Input</Label>
        <Input type="text" placeholder="Disabled" disabled />
      </div>
    </div>
  ),
};
