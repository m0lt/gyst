import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div>Item 1</div>
      <Separator orientation="vertical" />
      <div>Item 2</div>
      <Separator orientation="vertical" />
      <div>Item 3</div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="w-[400px] rounded-lg border bg-card p-6">
      <div className="space-y-1">
        <h3 className="heading-4">Task Details</h3>
        <p className="text-sm text-muted-foreground">
          Information about your task
        </p>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Category</p>
          <p className="text-sm text-muted-foreground">Health & Wellness</p>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium">Priority</p>
          <p className="text-sm text-muted-foreground">High</p>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium">Due Date</p>
          <p className="text-sm text-muted-foreground">Today, 5:00 PM</p>
        </div>
      </div>
    </div>
  ),
};

export const NavigationMenu: Story = {
  render: () => (
    <div className="w-[500px] rounded-lg border bg-card p-4">
      <div className="flex items-center space-x-4 text-sm">
        <div className="font-medium">Dashboard</div>
        <Separator orientation="vertical" className="h-4" />
        <div>Tasks</div>
        <Separator orientation="vertical" className="h-4" />
        <div>Calendar</div>
        <Separator orientation="vertical" className="h-4" />
        <div>Statistics</div>
        <Separator orientation="vertical" className="h-4" />
        <div>Settings</div>
      </div>
    </div>
  ),
};

export const SectionDivider: Story = {
  render: () => (
    <div className="w-[500px] space-y-6">
      <div>
        <h3 className="heading-4 mb-3">Morning Routine</h3>
        <div className="space-y-2 text-sm">
          <p>Wake up at 6:00 AM</p>
          <p>Drink a glass of water</p>
          <p>10 minutes of stretching</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="heading-4 mb-3">Afternoon Tasks</h3>
        <div className="space-y-2 text-sm">
          <p>Review daily goals</p>
          <p>Work on main project</p>
          <p>Take a lunch break</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="heading-4 mb-3">Evening Wind Down</h3>
        <div className="space-y-2 text-sm">
          <p>Prepare for tomorrow</p>
          <p>Read for 30 minutes</p>
          <p>Meditation before bed</p>
        </div>
      </div>
    </div>
  ),
};

export const Breadcrumbs: Story = {
  render: () => (
    <div className="flex items-center space-x-2 text-sm">
      <span>Home</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Tasks</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Morning Routine</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-muted-foreground">Details</span>
    </div>
  ),
};

export const StatsList: Story = {
  render: () => (
    <div className="w-[400px] rounded-lg border bg-card p-6">
      <h3 className="heading-4 mb-4">Your Statistics</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tasks Completed</span>
          <span className="text-lg font-semibold">127</span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Streak</span>
          <span className="text-lg font-semibold">🔥 42 days</span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Time</span>
          <span className="text-lg font-semibold">156 hours</span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Achievements</span>
          <span className="text-lg font-semibold">24 🏆</span>
        </div>
      </div>
    </div>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <div className="w-[500px] rounded-lg border bg-card p-3">
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1 text-sm hover:bg-accent rounded">
          Bold
        </button>
        <Separator orientation="vertical" className="h-6" />
        <button className="px-3 py-1 text-sm hover:bg-accent rounded">
          Italic
        </button>
        <Separator orientation="vertical" className="h-6" />
        <button className="px-3 py-1 text-sm hover:bg-accent rounded">
          Underline
        </button>
        <Separator orientation="vertical" className="h-6" />
        <button className="px-3 py-1 text-sm hover:bg-accent rounded">
          Link
        </button>
      </div>
    </div>
  ),
};

export const FooterLinks: Story = {
  render: () => (
    <div className="w-[600px] rounded-lg border bg-card p-6">
      <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground">About</a>
        <Separator orientation="vertical" className="h-4" />
        <a href="#" className="hover:text-foreground">Privacy</a>
        <Separator orientation="vertical" className="h-4" />
        <a href="#" className="hover:text-foreground">Terms</a>
        <Separator orientation="vertical" className="h-4" />
        <a href="#" className="hover:text-foreground">Contact</a>
        <Separator orientation="vertical" className="h-4" />
        <a href="#" className="hover:text-foreground">Help</a>
      </div>
    </div>
  ),
};

export const DifferentThickness: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      <div>
        <p className="text-sm mb-2">Default (1px)</p>
        <Separator />
      </div>

      <div>
        <p className="text-sm mb-2">Thick (2px)</p>
        <Separator className="h-0.5" />
      </div>

      <div>
        <p className="text-sm mb-2">Very Thick (4px)</p>
        <Separator className="h-1" />
      </div>
    </div>
  ),
};
