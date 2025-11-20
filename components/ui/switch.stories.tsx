import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { Label } from './label';

const meta = {
  title: 'UI/Switch',
  component: Switch,
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
} satisfies Meta<typeof Switch>;

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
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const NotificationSwitch: Story = {
  render: () => (
    <div className="flex items-center justify-between space-x-2 w-[300px]">
      <Label htmlFor="notifications" className="flex-1">
        Enable notifications
      </Label>
      <Switch id="notifications" defaultChecked />
    </div>
  ),
};

export const SettingsSwitches: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="heading-4">App Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize your Gyst experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-setting">Push Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Receive task reminders
            </p>
          </div>
          <Switch id="notifications-setting" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-xs text-muted-foreground">
              Use dark color scheme
            </p>
          </div>
          <Switch id="dark-mode" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-effects">Sound Effects</Label>
            <p className="text-xs text-muted-foreground">
              Play sounds on task completion
            </p>
          </div>
          <Switch id="sound-effects" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">Usage Analytics</Label>
            <p className="text-xs text-muted-foreground">
              Help improve Gyst
            </p>
          </div>
          <Switch id="analytics" />
        </div>
      </div>
    </div>
  ),
};

export const PrivacyToggles: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="heading-4">Privacy Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control your privacy preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="profile-public">Public Profile</Label>
            <p className="text-xs text-muted-foreground">
              Make your profile visible to others
            </p>
          </div>
          <Switch id="profile-public" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-streak">Show Streak</Label>
            <p className="text-xs text-muted-foreground">
              Display your streak on profile
            </p>
          </div>
          <Switch id="show-streak" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="activity-status">Activity Status</Label>
            <p className="text-xs text-muted-foreground">
              Let others see when you're active
            </p>
          </div>
          <Switch id="activity-status" />
        </div>
      </div>
    </div>
  ),
};

export const TaskToggles: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="heading-4">Task Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Set up your new task
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="is-recurring">Recurring Task</Label>
          <Switch id="is-recurring" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="has-reminder">Set Reminder</Label>
          <Switch id="has-reminder" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="requires-photo">Requires Photo Proof</Label>
          <Switch id="requires-photo" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="add-to-calendar">Add to Calendar</Label>
          <Switch id="add-to-calendar" defaultChecked />
        </div>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="off" />
        <Label htmlFor="off">Off</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="on" checked />
        <Label htmlFor="on">On</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off">Disabled (Off)</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" checked disabled />
        <Label htmlFor="disabled-on">Disabled (On)</Label>
      </div>
    </div>
  ),
};

export const CompactList: Story = {
  render: () => (
    <div className="w-[280px] space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="compact-1">WiFi</Label>
        <Switch id="compact-1" defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="compact-2">Bluetooth</Label>
        <Switch id="compact-2" defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="compact-3">Airplane Mode</Label>
        <Switch id="compact-3" />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="compact-4">Location</Label>
        <Switch id="compact-4" defaultChecked />
      </div>
    </div>
  ),
};
