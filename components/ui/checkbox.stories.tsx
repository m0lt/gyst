import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from './label';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const TaskCompleteCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="task-complete" />
      <Label htmlFor="task-complete">Mark task as complete</Label>
    </div>
  ),
};

export const SubtaskCheckboxes: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="subtask-1" defaultChecked />
        <Label htmlFor="subtask-1" className="font-normal">
          Wake up at 6:00 AM
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="subtask-2" defaultChecked />
        <Label htmlFor="subtask-2" className="font-normal">
          Drink a glass of water
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="subtask-3" />
        <Label htmlFor="subtask-3" className="font-normal">
          Do 10 minutes of stretching
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="subtask-4" />
        <Label htmlFor="subtask-4" className="font-normal">
          Meditate for 15 minutes
        </Label>
      </div>
    </div>
  ),
};

export const SettingsCheckboxes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="heading-4">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Choose which notifications you want to receive
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="notify-tasks" defaultChecked />
          <Label htmlFor="notify-tasks" className="font-normal">
            Task reminders
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="notify-streaks" defaultChecked />
          <Label htmlFor="notify-streaks" className="font-normal">
            Streak milestones
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="notify-achievements" />
          <Label htmlFor="notify-achievements" className="font-normal">
            Achievement unlocks
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="notify-weekly" />
          <Label htmlFor="notify-weekly" className="font-normal">
            Weekly summary emails
          </Label>
        </div>
      </div>
    </div>
  ),
};

export const FormCheckboxes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="heading-4">Task Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure your task settings
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox id="recurring" defaultChecked className="mt-0.5" />
          <div className="space-y-1">
            <Label htmlFor="recurring">Make this task recurring</Label>
            <p className="text-xs text-muted-foreground">
              Task will repeat based on your schedule
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="reminders" defaultChecked className="mt-0.5" />
          <div className="space-y-1">
            <Label htmlFor="reminders">Enable reminders</Label>
            <p className="text-xs text-muted-foreground">
              Get notified before task is due
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="public" className="mt-0.5" />
          <div className="space-y-1">
            <Label htmlFor="public">Make this task public</Label>
            <p className="text-xs text-muted-foreground">
              Others can see this task in shared lists
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="checked-state" checked />
        <Label htmlFor="checked-state">Checked</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-state" disabled />
        <Label htmlFor="disabled-state">Disabled</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked-state" checked disabled />
        <Label htmlFor="disabled-checked-state">Disabled Checked</Label>
      </div>
    </div>
  ),
};
