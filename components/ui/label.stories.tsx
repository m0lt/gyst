import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';
import { Checkbox } from './checkbox';
import { Textarea } from './textarea';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </Label>
    </div>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="message">Your Message</Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="required">
        Required Field <span className="text-destructive">*</span>
      </Label>
      <Input type="text" id="required" placeholder="This field is required" />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input type="text" id="username" placeholder="johndoe" />
      <p className="text-xs text-muted-foreground">
        This is your public display name.
      </p>
    </div>
  ),
};

export const FormLabels: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="heading-4">Task Form</h3>
        <p className="text-sm text-muted-foreground">
          Create a new daily task
        </p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-name">
          Task Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="task-name"
          type="text"
          placeholder="e.g., Morning exercise"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          placeholder="Optional details..."
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          Add any relevant details about this task
        </p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-category">Category</Label>
        <Input
          id="task-category"
          type="text"
          placeholder="Health & Wellness"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="task-recurring" />
        <Label htmlFor="task-recurring">Make this a recurring task</Label>
      </div>
    </div>
  ),
};

export const MultipleLabels: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="email-2">Email</Label>
        <Input id="email-2" type="email" />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="message-2">Message</Label>
        <Textarea id="message-2" />
      </div>
    </div>
  ),
};

export const DisabledLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled-input" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Disabled Field
      </Label>
      <Input type="text" id="disabled-input" placeholder="Disabled" disabled />
    </div>
  ),
};
