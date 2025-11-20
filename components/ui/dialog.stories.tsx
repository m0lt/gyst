import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog. It provides context about what the dialog is for.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const CreateTask: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to your daily routine. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning meditation"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional details about this task..."
              className="min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" defaultValue="08:00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" type="number" placeholder="30" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const DeleteConfirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your task
            and remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const StreakCelebration: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Celebration</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            🔥 7-Day Streak! 🔥
          </DialogTitle>
          <DialogDescription className="text-center">
            Congratulations! You've completed your tasks 7 days in a row.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="text-6xl">🎉</div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-primary">
              Amazing consistency!
            </p>
            <p className="text-sm text-muted-foreground">
              Keep up the great work. You're building a lasting habit!
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const EditProfile: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@johndoe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              defaultValue="Building better habits, one task at a time."
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Info</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
          <DialogDescription>
            This dialog doesn't have footer buttons.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            Sometimes you just need to display information without requiring
            user actions. Click the X or press Escape to close.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const QuickNote: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Quick Note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Note</DialogTitle>
          <DialogDescription>
            Jot down a quick thought or reminder
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="What's on your mind?"
            className="min-h-[150px]"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost">Discard</Button>
          <Button>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LargeContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            Complete information about your task
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              This is a detailed description of the task. It can contain multiple
              paragraphs and extensive information about what needs to be done.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Checklist</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>First step to complete</li>
              <li>Second step to complete</li>
              <li>Third step to complete</li>
              <li>Fourth step to complete</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Notes</h4>
            <p className="text-sm text-muted-foreground">
              Additional notes and reminders about this task can go here.
              This section can be as long as needed.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
