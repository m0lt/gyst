import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            This is the sheet description. It slides in from the side.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Sheet content goes here.</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const FromRight: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open from Right</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust your preferences here
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const FromLeft: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open from Left</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Quick access to all sections
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Tasks
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const FromTop: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open from Top</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have 3 new notifications
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="flex-1">
              <p className="font-medium">Task completed!</p>
              <p className="text-sm text-muted-foreground">
                You finished "Morning meditation"
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="flex-1">
              <p className="font-medium">Streak milestone 🔥</p>
              <p className="text-sm text-muted-foreground">
                7 days in a row!
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const FromBottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open from Bottom</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Select an action to perform
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          <Button variant="outline">
            <span className="mr-2">📋</span>
            New Task
          </Button>
          <Button variant="outline">
            <span className="mr-2">📅</span>
            Schedule
          </Button>
          <Button variant="outline">
            <span className="mr-2">📊</span>
            View Stats
          </Button>
          <Button variant="outline">
            <span className="mr-2">⚙️</span>
            Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const TaskDetails: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">View Task Details</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Morning Routine</SheetTitle>
          <SheetDescription>
            Health & Wellness • Daily Task
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Status</h4>
            <div className="flex gap-2">
              <Badge variant="default">Active</Badge>
              <Badge variant="outline">Daily</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Description</h4>
            <p className="text-sm text-muted-foreground">
              Start your day with a healthy morning routine including meditation,
              stretching, and a nutritious breakfast.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Schedule</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Time:</span> 7:00 AM
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span> 30 min
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Current Streak</h4>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-lg font-semibold text-primary">7 days</span>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">Edit Task</Button>
          <Button>Complete Now</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const FilterPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Tasks</SheetTitle>
          <SheetDescription>
            Refine your task list
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                All Categories
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Health & Wellness
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Productivity
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Personal Growth
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Badge variant="destructive" className="mr-2">High</Badge>
                High Priority
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Badge variant="default" className="mr-2">Med</Badge>
                Medium Priority
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Badge variant="secondary" className="mr-2">Low</Badge>
                Low Priority
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">Reset</Button>
          <Button>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const MobileMenu: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          ☰
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate Gyst
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 py-4">
          <Button variant="ghost" className="justify-start">
            🏠 Home
          </Button>
          <Button variant="ghost" className="justify-start">
            ✓ Tasks
          </Button>
          <Button variant="ghost" className="justify-start">
            📅 Calendar
          </Button>
          <Button variant="ghost" className="justify-start">
            📊 Statistics
          </Button>
          <Button variant="ghost" className="justify-start">
            🏆 Achievements
          </Button>
          <Button variant="ghost" className="justify-start">
            ⚙️ Settings
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  ),
};
